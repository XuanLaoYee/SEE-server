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
    }
}
