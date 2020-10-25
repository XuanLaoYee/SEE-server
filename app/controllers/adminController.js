const adminDao = require("../models/Dao/adminDao")
const ItemDao = require("../models/Dao/ItemsDao")
const userDao = require("../models/Dao/userDao")

module.exports = {
    startProject: async ctx => {
        let {nums,projectName} = ctx.request.body;
        let userKind = ctx.session.user.userKind
        if (userKind !== "admin") {
            ctx.body = {
                code: '403',
                msg: '您无权操作'
            }
            return
        }
        projectId = await adminDao.startNewProject(nums,projectName)
        ctx.body = {
            code: '001',
            projectId,
            msg: '项目新建完成,项目号为' + projectId
        }
    },
    stopProject: async ctx => {
        let {project} = ctx.request.body;
        let userKind = ctx.session.user.userKind
        if (userKind !== "admin") {
            ctx.body = {
                code: '403',
                msg: '您无权操作'
            }
            return
        }
        await adminDao.terminationProject(project)
        ctx.body = {
            code:'001',
            msg:'您已终止项目'+project
        }
    },
    restartProject:async ctx=>{
        let{project} = ctx.request.body;
        let userKind = ctx.session.user.userKind
        if (userKind !== "admin") {
            ctx.body = {
                code: '403',
                msg: '您无权操作'
            }
            return
        }
        await adminDao.restartProject(project);
        ctx.body = {
            code:'001',
            msg:'项目重启成功'
        }
    },
    findParticipateProject:async ctx =>{
        const participates = await adminDao.findParticipateProject()
        let userKind = ctx.session.user.userKind
        if (userKind !== "admin") {
            ctx.body = {
                code: '403',
                msg: '您无权操作'
            }
            return
        }
        accounts = []
        projects = []
        projectNames = []
        dones = []
        if(participates.length !== 0){
            let tempProject = participates[0].project;
            projects.push(participates[0].project)
            dones.push(participates[0].done)
            const projectName = await ItemDao.getTheProjectName(participates[0].project)
            projectNames.push(projectName[0].name);
            accountArray = []
            accountArray.push(participates[0].account)

            for(var i=1;i<participates.length;i++){
                if(participates[i].project !== tempProject){
                    accounts.push(accountArray);
                    accountArray = [];
                    tempProject = participates[i].project;
                    projects.push(tempProject[i].project);
                    dones.push(participates[i].done);
                    const projectName = await ItemDao.getTheProjectName(participates[i].project)
                    projectNames.push(projectName[0].name);
                }else{
                    accounts.push(participates[i].account)
                }
            }
            accounts.push(accountArray);
        }
        ctx.body = {
            code:'001',
            accounts,
            projects,
            projectNames,
            dones
        }
    },
    changeOrders:async ctx =>{
        let userKind = ctx.session.user.userKind
        if (userKind !== "admin") {
            ctx.body = {
                code: '403',
                msg: '您无权操作'
            }
            return
        }
        let{ids,orders} = ctx.request.body;
        await adminDao.changeOrders(ids,orders)
        ctx.body = {
            code:'001',
            msg:'修改成功'
        }
    },
    changePerformPerson:async ctx=>{
        let {id,account} = ctx.request.body;
        let userKind = ctx.session.user.userKind
        if (userKind !== "admin") {
            ctx.body = {
                code: '403',
                msg: '您无权操作'
            }
            return
        }
        await adminDao.changePerformPerson(id,account)
        ctx.body = {
            code:'001',
            msg:'指定成功'
        }
    },
    checkAllProjects: async ctx =>{
        let userKind = ctx.session.user.userKind
        if (userKind !== "admin") {
            ctx.body = {
                code: '403',
                msg: '您无权操作'
            }
            return
        }
        let {project} = ctx.request.body;
        const theProjects = await adminDao.checkTheTaskByProject(project)
        ids = []
        sorts = []
        orderIds = []
        projects = []
        dones = []
        for(var i=0;i<theProjects.length;i++){
            ids.push(theProjects[i].id)
            sorts.push(theProjects[i].sort)
            orderIds.push(theProjects[i].orderid)
            projects.push(theProjects[i].project)
            dones.push(theProjects[i].done)
        }
        const projectName = await ItemDao.getTheProjectName(theProjects[0].project)
        projectNames = projectName[0].name
        ctx.body = {
            code:'001',
            ids,
            sorts,
            orderIds,
            projects,
            projectNames,
            dones
        }
    },
    checkStaffA:async ctx=>{
        var accounts = []
        var userNames = []
        const users = await userDao.checkStaffA();
        for(var i = 0;i<users.length;i++){
            accounts.push(users[i].account)
            userNames.push(users[i].userName)
        }
        ctx.body = {
            code:'001',
            accounts,
            userNames
        }
    },
    checkStaffB:async ctx=>{
        var accounts = []
        var userNames = []
        const users = await userDao.checkStaffB();
        for(var i = 0;i<users.length;i++){
            accounts.push(users[i].account)
            userNames.push(users[i].userName)
        }
        ctx.body = {
            code:'001',
            accounts,
            userNames
        }
    },
    checkStaffC:async ctx=>{
        var accounts = []
        var userNames = []
        const users = await userDao.checkStaffC();
        for(var i = 0;i<users.length;i++){
            accounts.push(users[i].account)
            userNames.push(users[i].userName)
        }
        ctx.body = {
            code:'001',
            accounts,
            userNames
        }
    },
    checkAllStaff:async ctx=>{
        const users = await userDao.checkAllStaff();
        var accounts = []
        var sorts = []
        var userNames = []
        for(var i = 0;i<users.length;i++){
            accounts.push(users[i].account)
            sorts.push(users[i].sort)
            userNames.push(users[i].userName)
        }
        ctx.body = {
            code:'001',
            accounts,
            userNames,
            sorts
        }
    },

}
