const db = require('./db');


module.exports = {
    checkAllStaffs:async ()=>{
        const sql = 'select * from staff';
        return await db.query(sql)
    },
    checkAllAdmins:async ()=>{
        const sql = 'select * from admin'
        return await db.query(sql);
    },
    checkAllSuperAdmin:async ()=>{
        const sql = 'select * from superadmin'
        return await db.query(sql);
    },
    changeTheStaffSort:async (account,sort)=>{
        const sql = 'update staff set sort = ? where account = ?'
        await db.query(sql,[sort,account])
    },
    arrangeProjectPrincipal:async (account,project) =>{
        const sql1 = 'delete from charge where project = ?'
        await db.query(sql1,[project])
        const sql = 'insert into charge values (?,?)'
        await db.query(sql,[account,project])

    },
    recycleProjectPrincipal:async (account,project) =>{
        const sql = 'delete from charge where account = ? and project = ?'
    },
    checkTheCharge:async (account) =>{
        const sql = 'select * from charge where account = ?'
        return await db.query(sql,account)
    },
    checkAllProjects:async ()=>{
        const sql = 'select * from charge'
        return await db.query(sql)
    },
    getAdminName:async (account)=>{
        const sql = 'select * from admin where account = ?'
        return await db.query(sql,account)
    },
    transferTask:async (account)=>{
        const sql = 'select * from staff where account = ?'
        const theStaff = await db.query(sql,account)
        const sort = theStaff[0].sort
        const sql1 = 'select * from perform where account = ?'
        const myTasks = await db.query(sql1,account)
        let tasks = []
        for(let i=0;i<myTasks.length;i++){
            const sql2 = 'select * from task where id = ? and (done = 0 or done = 2)'
            const theTask = await db.query(sql2,myTasks[i].id)
            if(theTask.length !== 0){
                tasks.push(theTask[0].id)
            }
        }
        const sql3 = 'select * from staff where sort = ? and account <> ?'
        const otherStaffs = await db.query(sql3,[sort,account])
        if(otherStaffs.length === 0){
            return false;
        }
        let staffs = []
        for(let i=0;i<otherStaffs.length;i++){
            staffs.push(otherStaffs[i].account)
        }

        const sql4 = 'insert into perform values (?,?,?,null,0)'
        const msg = 'insert into messagebox values (?,?,null,1)'
        for(let i=0;i<tasks.length;i++){
            let cur = Math.ceil(Math.random()*staffs.length - 1);
            await db.query(sql4,[staffs[cur],tasks[i],staffs[cur]])
            await db.query(msg,["管理员已将任务"+tasks[i].toString()+"分配给您，请注意查看",staffs[cur]])
        }

        return true;
    },
    Login: async (account, password) => {
        const sql = 'select * from superadmin where account = ? and password = ?';
        return await db.query(sql, [account, password]);
    },
    getPariticpate:async (project)=>{
        const sql = 'select * from participate where project = ?'
        return await db.query(sql,[project])
    },
    deleteAdmin:async (account) =>{
        const sql = 'delete from admin where account = ?'
        await db.query(sql,account)
    },
    deleteStaff:async (account) =>{
        const sql = 'delete from staff where account = ?'
        await db.query(sql,account)
    },
    checkInStaff:async (account) =>{
        const sql = 'select * from staff where account = ?'
        return await db.query(sql,account)
    },
    checkInAdmin:async (account) =>{
        const sql = 'select * from admin where account = ?'
        return await db.query(sql,account)
    },
    transferProject:async (account) =>{
        const sql = 'select * from charge where account = ?'
        const sql1 = 'select * from admin '
        const admins = await db.query(sql1)
        if(admins.length === 0){
            return false
        }
        const projects = await db.query(sql,account)
        const sql2 = 'delete from admin where account = ?'
        const sql3 = 'delete from charge where account = ?'
        await db.query(sql2,account)
        await db.query(sql3,account)
        const sql4 = 'select * from admin'
        const newAdmins = await db.query(sql4)
        const sql5 = 'insert into charge values (?,?)'
        const msg = 'insert into messagebox values (?,?,null,1)'
        for(let i=0;i<projects.length;i++){
            let cur = Math.ceil(Math.random()*newAdmins.length -1);
            await db.query(sql5,[newAdmins[cur].account,projects[i].project])
            await db.query(msg,["超级管理员已将"+projects[i].project.toString()+"项目移交给您，注意查看",newAdmins[cur].account])
        }
        return true;
    }
}
