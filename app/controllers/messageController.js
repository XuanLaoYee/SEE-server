const messageDao = require('../models/Dao/messageDao')

module.exports = {
    getMessage: async ctx=> {
        let {account} = ctx.request.body
        const messages = await messageDao.getMessage(account)
        if(messages.size === 0){
            ctx.body = {
                code:'000'
            }
        }else{
            var sender = []
            var msg = []
            var kind = []
            for(var i =0;i<messages.size;i++){
                sender.push(messages[i].theSender)
                msg.push(messages[i].msg)
                kind.push(messages[i].theKind)
            }
            ctx.body = {
                code:'001',
                sender,
                msg,
                kind
            }
        }
    }
}
