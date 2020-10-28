const db = require('./db')

module.exports = {
    checkStaffA:async ()=>{
        const sql = 'select * from staff where sort = "A"';
        return await db.query(sql)
    },
    checkStaffB:async ()=>{
        const sql = 'select * from staff where sort = "B"';
        return await db.query(sql)
    },
    checkStaffC:async ()=>{
        const sql = 'select * from staff where sort = "C"';
        return await db.query(sql)
    },
    checkMySort:async (account)=>{
        const sql = 'select * from staff where account = ?';
        const sort =  await db.query(sql,account)
        return sort[0].sort;
    },
    checkAllStaff:async ()=>{
        const sql = 'select * from staff'
        return await db.query(sql)
    },
    checkMyName:async (account)=>{
        const sql = 'select * from staff where account = ?'
        return await db.query(sql,account)
    },
    checkAccountIsRepeat:async (account) =>{
        const sql = 'select * from staff where account = ?'
        const sql1 = 'select * from admin where account = ?'
        const sql2 = 'select * from superadmin where account = ?'
        const staffs = await db.query(sql,account)
        const admins = await db.query(sql1,account)
        const superAdmins = await db.query(sql2,account)
        return !(staffs.length !== 0 || admins.length !== 0 || superAdmins.length !== 0);
    },
    checkUserNameIsRepeat:async (userName) =>{
        const sql = 'select * from staff where userName = ?'
        const sql1 = 'select * from admin where userName = ?'
        const sql2 = 'select * from superadmin where userName = ?'
        const staffs = await db.query(sql,userName)
        const admins = await db.query(sql1,userName)
        const superAdmins = await db.query(sql2,userName)
        return !(staffs.length !== 0 || admins.length !== 0 || superAdmins.length !== 0);
    },
    register:async (account,userName,password,sort)=>{
        const sql = 'insert into staff values (?,?,?,?)'
        await db.query(sql,[account,password,sort,userName])
    }

}
