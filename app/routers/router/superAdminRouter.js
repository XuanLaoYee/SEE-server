const Router = require('koa-router');
const superAdminController = require('../../controllers/superAdminController');
const adminController = require('../../controllers/adminController')

let superAdminRouter = new Router();


superAdminRouter
    .post('/api/superAdmin/checkAllPeople',superAdminController.checkAllPeople)
    .post('/api/superAdmin/checkAllStaffs',superAdminController.checkAllStaffs)
    .post('/api/superAdmin/checkAllAdmins',superAdminController.checkAllAdmins)
    .post('/api/superAdmin/checkAllprojects',superAdminController.checkAllProjects)
    .post('/api/superAdmin/changeTheStaffSort',superAdminController.changeTheStaffSort)
    .post('/api/superAdmin/arrangeProjectPrincipal',superAdminController.arrangeProjectPrincipal)
    .post('/api/superAdmin/createProject',adminController.createProject)
    .post('/api/superAdmin/newProject',adminController.startProject)
    .post('/api/superAdmin/stopProject',adminController.stopProject)
    .post('/api/superAdmin/restartProject',adminController.restartProject)
    .post('/api/superAdmin/deleteUser',superAdminController.deleteUser)

module.exports = superAdminRouter
