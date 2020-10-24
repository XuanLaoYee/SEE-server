const Router = require('koa-router');
const messageController = require('../../controllers/messageController');

let messageRouter = new Router();

messageRouter
    .post('/api/message',messageController.getMessage)



module.exports = messageRouter;
