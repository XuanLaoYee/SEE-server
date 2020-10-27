const db = require('./db')

module.exports = {
    getMessage:async (account)=>{
        const sql = 'select * from messagebox where receiver = ?'
        return await db.query(sql,account)
    },
    deleteMessage:async (account) =>{
        const sql = 'delete from messagebox where receiver = ?'
        return await db.query(sql,account)
    }
}
