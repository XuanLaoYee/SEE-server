const db = require('./db')

function isInArray(arr, value) {
    for (var i = 0; i < arr.length; i++) {
        if (value === arr[i]) {
            return true;
        }
    }
    return false;
}


module.exports = {
    insertSubTask: async (sort,project) =>{
        const sql = 'insert into task values(null ,?,?,0) '
        return await db.query(sql, [sort,project]);
    },
    insertPerform: async (account,id,executor) =>{
        const sql = 'insert into perform values(?,?,?,null,0)';
        await db.query(sql,[account,id,executor]);
        const sql1 = 'select project from task where id = ?';
        const projectId = await db.query(sql1,id);
        const sql2 = 'select * from participate where account = ? and project = ?';
        const participate = await db.query(sql2,[account,projectId[0].project]);
        if(participate.size() !== 0){
            const sql3 = 'insert into participate value (?,?,0)';
            await db.query(sql3,[account,projectId[0].project]);
        }
    },
    findTaskByProject: async (project)=>{
        const sql = 'select * from task where project = ?'
        return await db.query(sql,project)
    },
    getTheProjectName: async (project) =>{
        const sql = 'select * from projectname where project = ?'
        return await db.query(sql,project)
    },
    getIsDone: async (id)=>{
        const sql = 'select * from task where id = ?'
        const theTask  = await db.query(sql,id)
        return theTask[0].done;
    },
    getTheSort:async (id)=>{
        const sql = 'select * from task where id = ?'
        const theTask = await db.query(sql,id);
        return theTask[0].sort;
    },
    recyleTaskByTime:async (time)=>{
        const sql = 'select * from perform where deadline <= ? and transfer = 1';
        const performs = db.query(sql,time);
        const msg = 'insert into messagebox values ("您的"+?+"号任务执行时间已超时,执行权被自动回收",?,null,0)'
        const msg1 = 'insert into messagebox values ("您委托的"+?+"号任务在规定时间内未完成,执行权被自动回收",?,null,0)'
        for(let i =0;i<performs.length;i++){
            await db.query(msg,[performs[i].id,performs[i].executor])
            await db.query(msg1,[performs[i].id,performs[i].account])
            const sql2 = 'update perform set executor = ? and transfer = 0 where id = ?';
            await db.query(sql2,[performs[i].account,performs[i].id])
        }
    }






}
