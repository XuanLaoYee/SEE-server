
const Router = require('koa-router');


let Routers = new Router();

const adminRouter  = require('./router/adminRouter');


Routers.use(adminRouter.routes());


module.exports = Routers