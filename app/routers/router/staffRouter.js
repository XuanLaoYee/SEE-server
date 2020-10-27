
const Router = require('koa-router');
const staffController = require('../../controllers/staffController');

let staffRouter = new Router();

staffRouter
    .post('/login',staffController.Login)
    .post('/api/staff/do',staffController.doWork)
    .post('/api/staff/myProject',staffController.checkMyProject)
    .post('/api/staff/checkProjectProgress',staffController.checkProjectProgress)
    .post('/api/staff/transferTask',staffController.transferTask)
    .post('/api/staff/myTask',staffController.allMyTask)
    .post('/api/staff/recycleTask',staffController.recycleTask)//TODO
    .post('/api/staff/checkSameStaff',staffController.checkSameStaff)
    .post('/api/echo',staffController.echo)
    .post('/api/staff/isCanDo',staffController.checkTaskIsCanDo)
module.exports = staffRouter;
