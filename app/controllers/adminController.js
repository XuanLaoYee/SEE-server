const adminDao = require("../models/Dao/adminDao")
const ItemDao = require("../models/Dao/ItemsDao")

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
        projectId = await adminDao.startNewProject(nums)
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
        for(var i=0;i<participates.length;i++){
            accounts.push(participates[i].account)
            projects.push(participates[i].project)
            const projectName = await ItemDao.getTheProjectName(participates[i].project)
            projectNames.push(projectName[0].name);
            dones.push(participates[i].done)
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
        const theProjects = await adminDao.checkAllProjects()
        ids = []
        sorts = []
        orderIds = []
        projects = []
        projectNames = []
        dones = []
        for(var i=0;i<theProjects.length;i++){
            ids.push(theProjects[i].id)
            sorts.push(theProjects[i].sort)
            orderIds.push(theProjects[i].orderid)
            projects.push(theProjects[i].project)
            const projectName = await ItemDao.getTheProjectName(theProjects[i].project)
            projectNames.push(projectName[0].name)
            dones.push(theProjects[i].done)
        }
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
        const users = await userDao.checkStaffA();
        for(var i = 0;i<users.length;i++){
            accounts.push(users[i].account)
        }
        ctx.body = {
            code:'001',
            accounts
        }
    },
    checkStaffB:async ctx=>{
        var accounts = []
        const users = await userDao.checkStaffB();
        for(var i = 0;i<users.length;i++){
            accounts.push(users[i].account)
        }
        ctx.body = {
            code:'001',
            accounts
        }
    },
    checkStaffC:async ctx=>{
        var accounts = []
        const users = await userDao.checkStaffC();
        for(var i = 0;i<users.length;i++){
            accounts.push(users[i].account)
        }
        ctx.body = {
            code:'001',
            accounts
        }
    },
    checkAllStaff:async ctx=>{
        const users = await userDao.checkAllStaff();
        var accounts = []
        for(var i = 0;i<users.length;i++){
            accounts.push(users[i].account)
        }
        ctx.body = {
            code:'001',
            accounts
        }
    }
}
