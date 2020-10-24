
const Router = require('koa-router');


let Routers = new Router();

const adminRouter  = require('./router/adminRouter');
const staffRouter = require('./router/staffRouter');
const messageRouter = require('./router/messageRouter')


Routers.use(adminRouter.routes());
Routers.use(staffRouter.routes());
Routers.use(messageRouter.routes());


module.exports = Routers
