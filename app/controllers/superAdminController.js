const superAdminDao = require('../models/Dao/superAdminDao')
const userDao = require('../models/Dao/userDao')
const itemDao = require('../models/Dao/ItemsDao')

module.exports = {
    checkAllPeople: async ctx => {
        const staffs = await superAdminDao.checkAllStaffs();
        const admins = await superAdminDao.checkAllAdmins();
        const superAdmins = await superAdminDao.checkAllSuperAdmin();

        let staffAccounts = []
        let staffNames = []
        let staffSorts = []

        let adminAccounts = []
        let adminNames = []

        let superAdminAccounts = []
        let superAdminNames = []

        for (let i = 0; i < staffs.length; i++) {
            staffAccounts.push(staffs[i].account)
            staffNames.push(staffs[i].userName)
            staffSorts.push(staffs[i].sort)
        }
        for (let i = 0; i < admins.length; i++) {
            adminAccounts.push(admins[i].account)
            adminNames.push(admins[i].userName)
        }
        for (let i = 0; i < superAdmins.length; i++) {
            superAdminAccounts.push(superAdmins[i].account);
            superAdminNames.push(superAdmins[i]);
        }

        ctx.body = {
            code: '001',
            staffAccounts,
            staffNames,
            staffSorts,
            adminAccounts,
            adminNames,
            superAdminAccounts,
            superAdminNames
        }
    },
    checkAllStaffs: async ctx => {
        const staffs = await superAdminDao.checkAllStaffs()
        let accounts = []
        let userNames = []
        let sorts = []
        for (let i = 0; i < staffs.length; i++) {
            accounts.push(staffs[i].account)
            userNames.push(staffs[i].userName)
            sorts.push(staffs[i].sort)
        }
        ctx.body = {
            code: '001',
            accounts,
            userNames,
            sorts
        }
    },
    checkAllAdmins: async ctx => {//TODO 有问题
        const staffs = await superAdminDao.checkAllAdmins()
        let accounts = []
        let userNames = []
        let projects = []
        let projectNames = []
        for (let i = 0; i < staffs.length; i++) {
            accounts.push(staffs[i].account)
            userNames.push(staffs[i].userName)
            const charges = await superAdminDao.checkTheCharge(staffs[i].account)
            for (let j = 0; j < charges.length; j++) {
                projects.push(charges[j].project)
                const theProject = await itemDao.getTheProjectName(charges[j].project)
                projectNames.push(theProject[0].name)
            }
        }
        ctx.body = {
            code: '001',
            accounts,
            userNames,
            // projects,
            // projectNames
        }
    },
    changeTheStaffSort: async ctx => {
        let {account, sort} = ctx.request.body;
        const theUser = await userDao.checkMyName(account)
        if (theUser.length === 0) {
            ctx.body = {
                code: '000',
                msg: '您操作的职员不可修改类型'
            }
            return
        }
        if(!await superAdminDao.transferTask(account)){
            ctx.body = {
                code:'000',
                msg:'该员工所执行的任务无替代人员，不可更改人员属性'
            }
            return
        }
        await superAdminDao.changeTheStaffSort(account, sort)
        ctx.body = {
            code: '001',
            msg: '操作成功'
        }
    },
    arrangeProjectPrincipal: async ctx => {
        let {account, project} = ctx.request.body;
        await superAdminDao.arrangeProjectPrincipal(account, project)
        ctx.body = {
            code: '001',
            msg: '操作成功'
        }
    },
    checkAllProjects: async ctx => {
        const charges = await superAdminDao.checkAllProjects()
        let projects = []
        let projectNames = []
        let accounts = []
        let userNames = []
        let dones = []
        for(let i =0;i<charges.length;i++){
            const theProject = await itemDao.getTheProjectName(charges[i].project)
            const theAdmin = await superAdminDao.getAdminName(charges[i].account)
            projectNames.push(theProject[0].name)
            projects.push(charges[i].project)
            accounts.push(charges[i].account)
            userNames.push(theAdmin[0].userName)
            const theDone = await superAdminDao.getPariticpate(charges[i].project)
            dones.push(theDone[0].done)
        }
        ctx.body = {
            code:'001',
            projects,
            projectNames,
            accounts,
            userNames,
            dones
        }
    },
    deleteUser:async ctx=>{
        let {account} = ctx.request.body;
        const staffs = await superAdminDao.checkInAdmin(account)
        const admins = await superAdminDao.checkInAdmin(account)
        if(staffs.length !== 0){
            if(! await superAdminDao.transferTask(account)){
                ctx.body = {
                    code:'000',
                    msg:'该员工所执行的任务无替代人员，暂时不可删除'
                }
            }else{
                await superAdminDao.deleteStaff(account)
                ctx.body = {
                    code:'001',
                    msg:'删除成功'
                }
            }
        }else if(admins.length !== 0){
            if(! await  superAdminDao.transferProject){
                ctx.body = {
                    code:'000',
                    msg:'本公司已无替补项目管理员，暂不可执行删除操作'
                }
            }else{
                ctx.body = {
                    code:'001',
                    msg:'删除成功'
                }
            }
        }else{
            ctx.body = {
                code:'000',
                msg:'该人员为超级管理员，不可删除'
            }
        }
    }
}
