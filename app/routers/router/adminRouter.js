/*
    管理员路由模块
 */

const Router = require('koa-router');
const adminController = require('../../controllers/adminController');

let adminRouter = new Router();

adminRouter
    .post('/api/admin/newProject',adminController.startProject)
    .post('/api/admin/stopProject',adminController.stopProject)
    .post('/api/admin/restartProject',adminController.restartProject)
    .post('/api/admin/allProjects',adminController.findParticipateProject)
    .post('/api/admin/changeOrders',adminController.changeOrders) //TODO
    .post('/api/admin/changeStaff',adminController.changePerformPerson)//TODO
    .post('/api/admin/checkProjectDetails',adminController.checkAllProjects)
    .post('/api/checkStaffA',adminController.checkStaffA)
    .post('/api/checkStaffB',adminController.checkStaffB)
    .post('/api/checkStaffC',adminController.checkStaffC)
    .post('/api/checkAllStaff',adminController.checkAllStaff)
    .post('/api/admin/createProject',adminController.createProject)


module.exports = adminRouter;
