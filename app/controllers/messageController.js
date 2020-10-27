const messageDao = require('../models/Dao/messageDao')

module.exports = {
    getMessage: async ctx=> {
        // let {account} = ctx.request.body
        let account = ctx.session.user.account
        const messages = await messageDao.getMessage(account)

        let sender = []
        let msg = []
        let kind = []
        if(messages.length === 0){
            ctx.body = {
                code:'001',
                status:0
            }
        }else{
            for(var i =0;i<messages.length;i++){
                sender.push(messages[i].theSender)
                msg.push(messages[i].msg)
                kind.push(messages[i].theKind)
            }
            await messageDao.deleteMessage(account);
            ctx.body = {
                code:'001',
                sender,
                msg,
                kind,
                status:1
            }
        }
    }
}
