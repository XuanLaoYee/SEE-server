const db = require('./db')


module.exports = {
    insertSubTask: async (sort,order,project) =>{
        const sql = 'insert into task values(null ,?,?,?,0) '
        return await db.query(sql, [sort,order,project]);
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
    }






}
