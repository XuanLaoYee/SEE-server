const db = require('./db');

function isInArray(arr, value) {
    for (var i = 0; i < arr.length; i++) {
        if (value === arr[i]) {
            return true;
        }
    }
    return false;
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
        const sql1 = 'select * from participate where project = ?'
        const tasks = await db.query(sql1,project)
        var staffs = []
        for (var i = 0; i < tasks.length; i++) {
            if(isInArray(staffs,tasks[i].account)){
                staffs.push(tasks[i].account);
            }
        }
        await db.query(sql, project)
        for(var i= 0 ;i<staffs.length;i++){
            const msg = 'insert into msg values ("管理员已终结"+?+"号项目",?,null,1)';
            await db.query(msg,[project,staffs[i]])
        }
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
            const sql1 = 'insert into task values (null ,?,?,?,0)';
            await db.query(sql1, [sorts[cur], i + 1, projectId]);
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
        return projectId
    },
    restartProject: async (projectId) => {
        const sql1 = 'select * from participate where project = ?'
        const tasks = await db.query(sql1,projectId)
        const sql = 'update task set done = 0 where project = ?'
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
    findParticipateProject: async () => {
        const sql = 'select * from participate order by project asc '
        return await db.query(sql)
    },
    checkAllProjects: async () => {
        const sql = 'select * from task';
        return await db.query(sql)
    },
    checkTheTaskByProject:async(project)=>{
        const sql = 'select * from task where project = ? order by orderid asc';
        return await db.query(sql,project)
    }

}
