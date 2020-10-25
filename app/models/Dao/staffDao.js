const db = require("./db")

function timestamps2string(v){
    var now = new Date(v)
    var yy = now.getFullYear();      //年
    var mm = now.getMonth() + 1;     //月
    var dd = now.getDate();          //日
    var hh = now.getHours();         //时
    var ii = now.getMinutes();       //分
    var ss = now.getSeconds();       //秒
    var clock = yy + "-";
    if(mm < 10) clock += "0";
    clock += mm + "-";
    if(dd < 10) clock += "0";
    clock += dd + " ";
    if(hh < 10) clock += "0";
    clock += hh + ":";
    if (ii < 10) clock += '0';
    clock += ii + ":";
    if (ss < 10) clock += '0';
    clock += ss;
    return clock;
}



module.exports = {
    login:async (account,password)=>{
        const sql = 'select * from staff where account = ? and password = ?'
        return await db.query(sql,[account,password])
    },
    finishTheTask: async (id) => {
        const sql = 'update task set done = 1 where id = ?';
        await db.query(sql, id)
        const sql1 = 'select * from task where id = ?';
        const theTask = await db.query(sql1,id);
        const project = theTask[0].project;
        const sql2 = 'select * from task where project = ? and done = 0'
        const leftTask = await db.query(sql2,project);
        if(leftTask.length === 0){
            const sql3 = 'update participate set done = 1 where project = ?'
            await db.query(sql3,project)
        }
    },
    transforTheTask: async (id, account, deadline) => {
        const sql = 'select * from perform where id = ? and transfer = 0'
        const sql1 = 'update perform set executor = ? where id = ? and transfer = 0'
        const sql2 = 'update perform set deadline =? where id = ? and transfer = 0'
        const sql3 = 'update perform set transfer = 1 where id = ? and transfer = 0'
        await db.query(sql1, [account, id])
        await db.query(sql2, [deadline, id])
        await db.query(sql3,[id])
        const oldStaff = await db.query(sql,[id])
        if(deadline !== null){
            const msg1 = 'insert into messagebox values ("您好,我已将我的"+?+"号子任务移交给您,请您在"+?+"之前完成，谢谢",?,?,2)'
            const theTime = timestamps2string(deadline)
            await db.query(msg1,[id,theTime,account,oldStaff[0].account])
        }
    },
    findOngoingTask: async (account, id) => {
        const sql = 'select * from perform where id = ? and account = ? and transfer = 1'
        return await db.query(sql, [id, account])
    },
    findTask: async (account) => {
        const sql = 'select * from perform where account=? ';
        return await db.query(sql, account)
    },
    recycleTask: async (id,account) => {
        const sql1 = 'select * from perform where transfer = 1 and id = ?'
        const theExecutor = await db.query(sql1,[id])
        const sql = 'update perform set executor = ? where id = ?'
        const sql2 = 'update perform set transfer = 0 where executor = ? and account = ? and id = ?'
        await db.query(sql2,[account,account,id])
        await db.query(sql,[account,id])
        const msg = 'insert into messagebox values ("交由您的"+?+"号任务已被我收回",?,?,2)'
        await db.query(msg,[id,theExecutor[0].executor,account,])
    },
    allMyTask: async (account) => {
        const sql = 'select * from perform where account = ?';
        return await db.query(account)
    },
    findParticipateProject:async (account) => {
        const sql = 'select * from participate where account = ?'
        return await db.query(sql,account)
    },
    checkIsMyAndCanDo: async (id,account) =>{
        const sql = 'select * from perform where id = ? and account = ? and transfer = 0';
        const tasks = await db.query(sql,[id,account])
        if(tasks.length === 0){
            return null
        }
        const sql1 = 'select * from task where id = ? and done = 0';
        return await db.query(sql1, id)
    },
    checkIsMyProject:async (account,project) =>{
        const sql = 'select * from participate where project = ? and account = ?  ';
        return await db.query(sql, [project, account]);
    },
    checkProjectProgress: async (project)=>{
        const sql = 'select * from task where project = ?'
        return await db.query(sql,project);
    },
    checkMyTaskInProject : async (project,account) =>{
        const sql = 'select * from task where project = ?'
        const tasks = await db.query(sql,project);
        var ids = []
        for(var i=0;i<tasks.length;i++){
            const sql1 = 'select * from perform where id = ? and account = ?';
            const theTask = await db.query(sql1,[tasks[i].id,account])
            if(theTask.length!==0){
                ids.push(theTask[0].id)
            }
        }
        return ids
    },
    checkTheTask:async (id)=>{
        const sql = 'select * from task where id = ?'
        return await db.query(sql,id)
    },
    isCanDoThisTask:async (id,account)=>{
        const sql = 'select * from perform where id = ? and account = ?';
        const theTask = await db.query(sql,[id,account])
        if(theTask.length !== 0){
            const sql1 = 'select * from task where id = ? and done = 0';
            const theTask1 = await db.query(sql1,id);
            if(theTask1.length!==0){
                if(theTask1[0].orderid===1){
                    return true;
                }else {
                    const sql2 = 'select * from task where id = ? and done = 1 and orderid = ?';
                    const theTask2 = await db.query(sql1,[id,theTask1[0].orderid-1]);
                    if(theTask2.length!==0){
                        return true;
                    }
                }
            }
        }
        return false;
    },

}
