const staffDao = require('../models/Dao/staffDao')
const adminDao = require('../models/Dao/adminDao')
const userDao = require('../models/Dao/userDao')
const ItemDao = require('../models/Dao/ItemsDao')

module.exports = {
    Login:async ctx => {
        let {account,password} = ctx.request.body;
        let user = await staffDao.login(account,password)
        if(user.length !== 0){
            User = {
                account:account,
                userKind:'staff'
            };
            ctx.session.user = User;
            ctx.body = {
                code:'001',
                account:account,
                userKind:'staff',
                msg:'登录成功'
            };
        }else{
            let user = await adminDao.Login(account,password)
            if(user.length!==0){
                User = {
                    account:account,
                    userKind:'admin',
                };
                ctx.session.user = User;
                ctx.body = {
                    code:'001',
                    account:account,
                    userKind:'admin',
                    msg:'登录成功'
                };
            }else{
                ctx.body = {
                    code:'000',
                    msg:'登录失败，请检查帐号或密码是否输入正确'
                }
            }
        }
    },
    doWork:async ctx => {
        let{id} = ctx.request.body;
        let account = ctx.session.user.account
        let theTask = await staffDao.checkIsMyAndCanDo(id,account)
        if(theTask===null){
            ctx.body = {
                code:'000',
                msg:'该任务不可做，可能是因为已经被完成或者您没有权限'
            }
            return
        }
        //TODO  写到word里
        await staffDao.finishTheTask(id)
        ctx.body = {
            code:'001',
            msg:'完成'
        }
    },
    checkMyProject: async ctx=>{
        let account = ctx.session.user.account
        const participate = await staffDao.findParticipateProject(account)
        var projects = []
        var projectNames = []
        var dones = []
        for(var i =0 ;i<participate.length;i++){
            projects.push(participate[i].project);
            const name = await ItemDao.getTheProjectName(participate[i].project);
            projectNames.push(name[0].name);
            dones.push(participate[i].done);
        }
        ctx.body = {
            code:'001',
            projects,
            projectNames,
            dones
        }
    },
    checkProjectProgress:async ctx =>{
        let{project} = ctx.request.body;
        let account = ctx.session.user.account
        const theProject = await staffDao.checkIsMyProject(account,project)
        if(projects.length === 0){
            ctx.body = {
                code:'000',
                msg:'这不是您参与的项目，您无权查看'
            }
            return
        }
        const projects = await staffDao.checkMyTaskInProject(project,account);
        var tasks = []
        var dones = []
        var canDos = []
        for(var i=0;i<projects.length;i++){
            tasks.push(projects[i].id)
            const theTask = await checkTheTask(projects[i].id)
            dones.push(theTask[0].done)
            if(await staffDao.isCanDoThisTask(projects[i].id,account)){
                canDos.push(1)
            }else{
                canDos.push(0)
            }
        }
        ctx.body = {
            code:'001',
            tasks,
            canDos,
            dones
        }
    },
    transferTask:async ctx =>{
        let{otherAccount,id,deadline} = ctx.request.body;
        let account = ctx.session.user.account;
        let theTask = await staffDao.checkIsMyAndCanDo(id,account)
        if(theTask===null){
            ctx.body = {
                code:'000',
                msg:'该任务不可转让，可能是因为已经被完成或者您没有权限'
            }
            return
        }
        await staffDao.transforTheTask(id,otherAccount,deadline)
        ctx.body = {
            code:'001'
        }
    },
    recycleTask:async ctx => {
        let account = ctx.session.user.account;
        let{id} = ctx.request.body;
        let theTask = await staffDao.recycleTask(id,account)
        ctx.body = {
            code:'001'
        }
    },
    allMyTask:async ctx=> {
        let account = ctx.session.user.account;
        let tasks = await staffDao.allMyTask(account);
        let ids = []
        let executors = []
        let deadlines = []
        let transfers = []
        for(var i=0;i<tasks.length;i++){
            ids.push(tasks[i].id)
            executors.push(tasks[i].executor)
            deadlines.push(tasks[i].deadline)
            transfers.push(tasks[i].transfer)
        }
        ctx.body = {
            code:'001',
            ids,
            executors,
            deadlines,
            transfers
        }
    },
    checkSameStaff:async ctx => {
        let account = ctx.session.user.account;
        const sort = await userDao.checkMySort(account)
        var accounts = []
        if(sort === "A"){
            const users = await userDao.checkStaffA();
            for(var i = 0;i<users.length;i++){
                accounts.push(users[i].account)
            }
        }else if(sort === "B"){
            const users = await userDao.checkStaffB();
            for(var i = 0;i<users.length;i++){
                accounts.push(users[i].account)
            }
        }else if(sort === "C"){
            const users = await userDao.checkStaffC();
            for(var i = 0;i<users.length;i++){
                accounts.push(users[i].account)
            }
        }
        ctx.body = {
            code:'001',
            accounts
        }
    },


}
