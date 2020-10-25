const db = require('./db');

function isInArray(arr, value) {
    for (var i = 0; i < arr.length; i++) {
        if (value === arr[i]) {
            return true;
        }
    }
    return false;
}

function max(a,b){
    if(a>b){
        return a;
    }
    return b;
}

function min(a,b){
    if(a<b){
        return a;
    }
    return b;
}


function unique(arr) {
    if (!Array.isArray(arr)) {
        console.log('type error!')
        return
    }
    var array =[];
    for(var i = 0; i < arr.length; i++) {
        if( !array.includes( arr[i]) ) {//includes 检测数组是否有某个值
            array.push(arr[i]);
        }
    }
    return array
}
module.exports = {
    Login: async (account, password) => {
        const sql = 'select * from admin where account = ? and password = ?';
        return await db.query(sql, [account, password]);
    },
    changePerformPerson: async (id, account) => {
        const sql = 'select * from perform where id = ? and transfer = 0';
        perform1 = await db.query(sql, id);
        if (perform1.size() !== 0) {
            const msg1 = 'insert into messagebox(msg,receiver,sender,kind) values ("您的"+?+"号任务已被管理员重新分配给其他人",?,null,1)';
            await db.query(msg1, [id, perform1[0].account])
            const sql1 = 'update perform set transfer = 1 where id = ? and transfer = 0';
            await db.query(sql1, id)
            const sql2 = 'select * from task where id = ?';
            const task = await db.query(sql2, id);
            projectId = task[0].project;
            const sql3 = 'select * from task where project = ?';
            const tasks = await db.query(sql3, projectId);
            var flag = false;
            for (var i = 0; i < tasks.size; i++) {
                const sql4 = 'select * from perform where id = ? and transfer = 0';
                var a = await db.query(sql4, tasks[i].id)
                if (a.size() !== 0) {
                    flag = true;
                }
            }
            if (flag === false) {
                const sql5 = 'delete * from participate where account = ? and project = ?'
                await db.query(sql5, [perform1[0].account, projectId])
            }
        }
        const sql6 = 'insert into perform values (?,?,?,null,0)'
        await db.query(sql6, [account, id, account])
        const msg2 = 'insert into messagebox(msg,receiver,sender,kind) values ("管理员将"+?+"号任务分配给您",?,null,1)'
        await db.query(msg2, [id, account])
        const sql7 = 'select * from task where id = ?'
        const tasks = await db.query(sql7, id);
        const sql8 = 'select * from participate where project = ? and account = ?'
        const b = await db.query(sql8, [tasks[0].project, account])
        if (b.size !== 0) {
            sql9 = 'insert into participate values (?,?,0)'
            await db.query(sql9, [account, tasks[0].project])
        }
    },
    changeOrders: async (ids, orders) => {
        for (var i = 0; i < ids.size; i++) {
            const sql = 'update task set order =? where id =?'
            await db.query(sql, [orders[i], ids[i]])
        }
        var staffs = []
        for (var i = 0; i < ids.length; i++) {
            const sql1 = 'select * from perform where id = ?  '
            const theStaff = await db.query(sql1, [ids[i]])
            if (isInArray(staffs, theStaff[0].account)) {
                staffs.push(theStaff[0].account)
            }
            if (isInArray(staffs, theStaff[0].executor)) {
                staffs.push(theStaff[0].executor)
            }
        }
        const sql2 = 'select * from task where id = ?'
        const project = await db.query(sql2, ids[0])
        for (var i = 0; i < staffs.length; i++) {
            const msg = 'insert into messagebox values ("管理员已调整"+?+"号任务顺序",?,null,1)'
            await db.query(msg, [project[0].project, staffs[i]])
        }
    },
    terminationProject: async (project) => {
        const sql1 = 'select * from participate where project = ? and done = 0'
        const tasks = await db.query(sql1,project)
        var staffs = []
        for (var i = 0; i < tasks.length; i++) {
            if(isInArray(staffs,tasks[i].account)){
                staffs.push(tasks[i].account);
            }
        }
        await db.query(sql, project)
        for(var i= 0 ;i<staffs.length;i++){
            const msg = 'insert into msg values ("管理员已暂停"+?+"号项目",?,null,1)';
            await db.query(msg,[project,staffs[i]])
        }
        const sql2 = 'update participate set done = 2 where project = ?';
        await db.query(sql2,[project])
        const sql3 = 'update task set done = 2 where project = ? and done = 0';
        await db.query(sql3,[project])
    },
    startNewProject: async (subNums,projectName) => {
        const sql = 'select * from task order by project desc'
        const tasks = await db.query(sql)
        var projectId = 0
        if (tasks.size === 0) {
            projectId = 0;
        } else {
            projectId = tasks[0].project + 1;
        }
        for (var i = 0; i < subNums; i++) {
            var sorts = ['A', 'B', 'C']
            var cur = Math.ceil(Math.random() * 3-1);
            const sql1 = 'insert into task values (null ,?,?,0)';
            await db.query(sql1, [sorts[cur],projectId]);
        }
        const sql2 = 'select *from staff where sort = "A"';
        const sql3 = 'select *from staff where sort = "B"';
        const sql4 = 'select *from staff where sort = "C"';
        const groupA = await db.query(sql2)
        const groupB = await db.query(sql3)
        const groupC = await db.query(sql4)
        const sql5 = 'select * from task where project = ?'
        const projects = await db.query(sql5, projectId);
        const msg = 'insert into messagebox values ("管理员开启了新的项目，请查看任务",?,null,0)'
        for (var i = 0; i < projects.length; i++) {
            var accountTemp = ""
            if (projects[i].sort === 'A') {
                var cur = Math.ceil(Math.random() * groupA.length -1)
                const sql6 = 'insert into perform values (?,?,?,null,0)';
                accountTemp = groupA[cur].account;
                await db.query(sql6, [groupA[cur].account, projects[i].id, groupA[cur].account]);
                await db.query(msg,[groupA[cur].account])
            } else if (projects[i].sort === 'B') {
                var cur = Math.ceil(Math.random() * groupB.length -1)
                const sql6 = 'insert into perform values (?,?,?,null,0)';
                accountTemp = groupB[cur].account;
                await db.query(sql6, [groupB[cur].account, projects[i].id, groupB[cur].account]);
                await db.query(msg,[groupB[cur].account])
            } else if (projects[i].sort === 'C') {
                var cur = Math.ceil(Math.random() * groupC.length -1)
                const sql6 = 'insert into perform values (?,?,?,null,0)';
                accountTemp = groupC[cur].account;
                await db.query(sql6, [groupC[cur].account, projects[i].id, groupC[cur].account]);
                await db.query(msg,[groupC[cur].account])
            }
            const sql8 = 'select * from participate where project = ? and account = ?'
            const b = await db.query(sql8, [projectId, accountTemp])
            if (b.size !== 0) {
                sql9 = 'insert into participate values (?,?,0)'
                await db.query(sql9, [accountTemp, projectId])
            }
        }
        const sql10 = 'insert into projectName values (?,?)'
        await db.query(sql10,[projectName,projectId])
        let already = [];
        let old = [];
        for(var i=0;i<subNums;i++){
            old.push(projects[i].id)
        }
        while(old.length>0){
            if(already.length === 0){
                let cur = Math.ceil(Math.random() * old.length -1)
                already.push(old.push(old[cur]))
                old.slice(cur,1)
            }else{
                var cur1 = Math.ceil(Math.random() * old.length -1)
                var cur2 = Math.ceil(Math.random() * already.length - 1);
                var maxId = max(old[cur1],already[cur2]);
                var minId = min(old[cur1],already[cur2]);
                const sql11 = 'insert into sequence values (?,?)'
                await db.query(sql11,[minId,maxId])
                already.push(old[cur1]);
                old.splice(cur1,1);
            }
        }
        return projectId
    },
    restartProject: async (projectId) => {
        const sql1 = 'select * from participate where project = ?'
        const tasks = await db.query(sql1,projectId)
        const sql = 'update task set done = 0 where project = ? and done = 2'
        return await db.query(sql, projectId)
        var staffs = []
        for (var i = 0; i < tasks.length; i++) {
            if(isInArray(staffs,tasks[i].account)){
                staffs.push(tasks[i].account);
            }
        }
        await db.query(sql, projectId)
        for(var i= 0 ;i<staffs.length;i++) {
            const msg = 'insert into msg values ("管理员已重启"+?+"号项目",?,null,1)';
            await db.query(msg, [projectId, staffs[i]])
        }

    },
    createProject:async (projectName,sorts,staffIds,sources,targets)=>{
        for(var i = 0;i<staffIds.length;i++){
            const msg = 'insert into messagebox values ("管理员开启了新的项目，请查看任务",?,null,0)'
            await db.query(msg,staffIds[i]);
        }
        const sql = 'select * from task order by project desc'
        const tasks = await db.query(sql)
        var projectId = 0
        if (tasks.size === 0) {
            projectId = 0;
        } else {
            projectId = tasks[0].project + 1;
        }
        const sql1 = 'select * from task order by id desc '
        const topTask = await db.query(sql1)
        const offset = topTask[0].id;
        const sql2 = 'insert into tasks values(null,?,?,0)'
        const sql3 = 'insert into perform values (?,?,?,null,0)'
        for(var i=0;i<sorts.length;i++){
            await db.query(sql2,[sorts[i],projectId])
            await db.query(sql3,[staffIds[0],i+1+offset,staffIds[0]])

        }

        const sql4 = 'insert into sequence values (?,?)'
        await db.query(sql4,[sources[i],targets[i]])
        var theAccounts = unique(staffIds)
        const sql5 = 'insert into participate values (?,?,0)'
        for(var i=0;i<theAccounts.length;i++){
            await db.query(sql5,[theAccounts[0],projectId])
        }
        const sql6 = 'insert into projectName values (?,?)'
        await db.query(sql6,[projectName,projectId])
    },
    findParticipateProject: async () => {
        const sql = 'select * from participate order by project asc '
        return await db.query(sql)
    },
    checkAllProjects: async () => {
        const sql = 'select * from task';
        return await db.query(sql)
    },
    checkTheTaskByProject:async(project)=>{
        const sql = 'select * from task where project = ?';
        return await db.query(sql,project)
    },
    getTheSequence:async (id) =>{
        const sql = 'select * from sequence where thisTask = ? or nextTask = ?'
        return await db.query(sql,[id,id])
    }

}
