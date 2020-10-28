const adminDao = require("../models/Dao/adminDao")
const ItemDao = require("../models/Dao/ItemsDao")
const userDao = require("../models/Dao/userDao")


function isCycle(sources, targets) { //判断DAG是否成环,成环是false
    for(let i=0;i<sources.length;i++){
        if(targets[i] === null){
            sources.splice(i,1)
            targets.splice(i,1)
            i=0;
        }
    }
    let edges = []
    for (var i = 0; i < sources.length; i++) {
        var temp = {};
        temp['source'] = sources[i];//待定
        temp['target'] = targets[i];
        edges.push(temp);
    }
    const nodes = [];
    const list = {}; // 邻接表
    const queue = []; // 入度为0的节点集合
    const indegree = {};
    edges.forEach(e => {
        const {source, target} = e;
        if (!nodes.includes(source)) {
            nodes.push(source);
        }
        if (!nodes.includes(target)) {
            nodes.push(target);
        }
        addEdge(source, target);
    });
    const V = nodes.length;

    nodes.forEach(node => {
        if (!indegree[node]) indegree[node] = 0;
        if (!list[node]) list[node] = [];
    });

    function addEdge(source, target) {
        if (!list[source]) list[source] = [];
        if (!indegree[target]) indegree[target] = 0;
        list[source].push(target);
        indegree[target] += 1;
    }

    function sort() {
        Object.keys(indegree).forEach(id => {
            if (indegree[id] === 0) {
                queue.push(id);
            }
        });
        let count = 0;
        while (queue.length) {
            ++count;
            const currentNode = queue.pop();
            const nodeTargets = list[currentNode];
            for (let i = 0; i < nodeTargets.length; i++) {
                const target = nodeTargets[i];
                indegree[target] -= 1;
                if (indegree[target] === 0) {
                    queue.push(target);
                }
            }
        }
        // false 没有输出全部顶点，有向图中有回路
        return !(count < V);
    }

    return sort();
}

module.exports = {
    startProject: async ctx => {
        let {nums, projectName,adminAccount} = ctx.request.body;
        let userKind = ctx.session.user.userKind
        if (userKind !== "superAdmin") {
            ctx.body = {
                code: '403',
                msg: '您无权操作'
            }
            return
        }
        projectId = await adminDao.startNewProject(nums, projectName,adminAccount)
        ctx.body = {
            code: '001',
            projectId,
            msg: '项目新建完成,项目号为' + projectId
        }
    },
    stopProject: async ctx => {
        let {project} = ctx.request.body;
        await adminDao.terminationProject(project)
        ctx.body = {
            code: '001',
            msg: '您已终止项目' + project
        }
    },
    restartProject: async ctx => {
        let {project} = ctx.request.body;
        await adminDao.restartProject(project);
        ctx.body = {
            code: '001',
            msg: '项目重启成功'
        }
    },
    createProject: async ctx => {
        let {projectName, sorts, accounts, sources, targets, adminAccount} = ctx.request.body;
        let userKind = ctx.session.user.userKind
        if (userKind !== "superAdmin") {
            ctx.body = {
                code: '403',
                msg: '您无权操作'
            }
            return
        }
        var oldSources = sources.concat()
        var oldTargets = targets.concat()
        if (!isCycle(oldSources, oldTargets)) {
            ctx.body = {
                code: '000',
                msg: '您的分配的任务顺序产生闭环，无法创建'
            }
            return
        }
        await adminDao.createProject(projectName, sorts, accounts, sources, targets,adminAccount);
        ctx.body = {
            code: '001',
            msg: '创建成功'
        }
    },
    findParticipateProject: async ctx => {
        let account = ctx.session.user.account
        const participates = await adminDao.findAllMyProject(account)
        let userKind = ctx.session.user.userKind
        if (userKind !== "admin" && userKind !== "superAdmin") {
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
        if (participates.length !== 0) {
            let tempProject = participates[0].project;
            projects.push(tempProject)
            // dones.push(participates[0].done)
            const tempParticipates = await adminDao.findTheProjectDone(tempProject);
            dones.push(tempParticipates[0].done)
            const projectName = await ItemDao.getTheProjectName(tempProject)
            projectNames.push(projectName[0].name);
            accountArray = []
            accountArray.push(participates[0].account)

            for (var i = 1; i < participates.length; i++) {
                if (participates[i].project !== tempProject) {
                    accounts.push(accountArray);
                    accountArray = [];
                    accountArray.push(participates[i].account)
                    tempProject = participates[i].project;
                    projects.push(tempProject);
                    const tempParticipates = await adminDao.findTheProjectDone(tempProject);
                    dones.push(tempParticipates[0].done)
                    const projectName = await ItemDao.getTheProjectName(tempProject)
                    projectNames.push(projectName[0].name);
                } else {
                    accountArray.push(participates[i].account)
                }
            }
            accounts.push(accountArray);
        }
        ctx.body = {
            code: '001',
            accounts,
            projects,
            projectNames,
            dones
        }
    },
    changeOrders: async ctx => {
        let userKind = ctx.session.user.userKind
        if (userKind !== "admin" && userKind !== "superAdmin") {
            ctx.body = {
                code: '403',
                msg: '您无权操作'
            }
            return
        }
        let {sources, targets} = ctx.request.body;
        console.log(sources)
        console.log(targets)
        let oldSources = []
        let oldTargets = []
        const tasks = await adminDao.findAllEdgeByOne(sources[0])
        for(let i = 0;i<tasks.length;i++){
            const theTasks = await adminDao.getTheSequence(tasks[i].id)
            for(let j = 0;j<theTasks.length;j++){
                oldSources.push(tasks[i].id)
                oldTargets.push(theTasks[j].nextTask)
            }
        }

        for(let i = 0;i<oldSources.length;i++){
            if(oldSources[i] === sources[0]){
                oldSources.splice(i,1)
                oldTargets.splice(i,1)
                i = 0;
            }
        }
        for(let i =0;i<targets.length;i++){
            oldSources.push(sources[0])
            oldTargets.push(targets[i])
        }

        if(!isCycle(oldSources,oldTargets)){
            ctx.body = {
                code: '000',
                msg: '您的分配的任务顺序产生闭环，无法修改顺序'
            }
            return
        }
        await adminDao.changeOrders(sources, targets)
        ctx.body = {
            code: '001',
            msg: '修改成功'
        }
    },
    changePerformPerson: async ctx => {
        let {id, account} = ctx.request.body;
        let userKind = ctx.session.user.userKind
        if (userKind !== "admin" && userKind !== "superAdmin") {
            ctx.body = {
                code: '403',
                msg: '您无权操作'
            }
            return
        }
        await adminDao.changePerformPerson(id, account)
        ctx.body = {
            code: '001',
            msg: '指定成功'
        }
    },
    checkAllProjects: async ctx => {
        let userKind = ctx.session.user.userKind
        if (userKind !== "admin" && userKind !== "superAdmin") {
            ctx.body = {
                code: '403',
                msg: '您无权操作'
            }
            return
        }
        let {project} = ctx.request.body;
        const theProjects = await adminDao.checkTheTaskByProject(project)
        let sources = []
        let sourcesSorts = []
        let targetSorts = []
        let sourcesDones = []
        let targetsDones = []
        let targets = []

        for (var i = 0; i < theProjects.length; i++) {
            const oneSequence = await adminDao.getTheSequence(theProjects[i].id);
            // console.log(oneSequence)
            let sourcesDone = await ItemDao.getIsDone(oneSequence[0].thisTask);
            sourcesDones.push(sourcesDone);
            let sourcesSort = await ItemDao.getTheSort(oneSequence[0].thisTask);
            sources.push(oneSequence[0].thisTask)
            sourcesSorts.push(sourcesSort)

            let thetargetsDones = []
            let thetargetsSorts = []
            let thetargets = []
            for(let j=0;j<oneSequence.length;j++){
                if(oneSequence[j].nextTask === null){
                    break
                }else {
                    let targetsDone = await ItemDao.getIsDone(oneSequence[j].nextTask);
                    let targetsSort = await ItemDao.getTheSort(oneSequence[j].nextTask);
                    thetargets.push(oneSequence[j].nextTask)
                    thetargetsSorts.push(targetsSort)
                    thetargetsDones.push(targetsDone)
                }
            }
            targetSorts.push(thetargetsSorts);
            targetsDones.push(thetargetsDones);
            targets.push(thetargets);
        }
        let accounts = []
        let userNames = []
        for(let i=0;i<sources.length;i++){
            const theAccount = await adminDao.findAccountByTask(sources[i])
            accounts.push(theAccount[0].account)
            const theName = await userDao.checkMyName(theAccount[0].account)
            userNames.push(theName[0].userName)
        }


        const projectName = await ItemDao.getTheProjectName(theProjects[0].project)
        let theProjectName = projectName[0].name
        ctx.body = {
            code: '001',
            sources,
            targets,
            accounts,
            userNames,
            sourcesSorts,
            targetSorts,
            sourcesDones,
            targetsDones,
            theProjectName,
        }
    },
    checkStaffA: async ctx => {
        var accounts = []
        var userNames = []
        const users = await userDao.checkStaffA();
        for (var i = 0; i < users.length; i++) {
            accounts.push(users[i].account)
            userNames.push(users[i].userName)
        }
        ctx.body = {
            code: '001',
            accounts,
            userNames
        }
    },
    checkStaffB: async ctx => {
        var accounts = []
        var userNames = []
        const users = await userDao.checkStaffB();
        for (var i = 0; i < users.length; i++) {
            accounts.push(users[i].account)
            userNames.push(users[i].userName)
        }
        ctx.body = {
            code: '001',
            accounts,
            userNames
        }
    },
    checkStaffC: async ctx => {
        var accounts = []
        var userNames = []
        const users = await userDao.checkStaffC();
        for (var i = 0; i < users.length; i++) {
            accounts.push(users[i].account)
            userNames.push(users[i].userName)
        }
        ctx.body = {
            code: '001',
            accounts,
            userNames
        }
    },
    checkAllStaff: async ctx => {
        const users = await userDao.checkAllStaff();
        var accounts = []
        var sorts = []
        var userNames = []
        for (var i = 0; i < users.length; i++) {
            accounts.push(users[i].account)
            sorts.push(users[i].sort)
            userNames.push(users[i].userName)
        }
        ctx.body = {
            code: '001',
            accounts,
            userNames,
            sorts
        }
    },
    checkSchedule:async ctx=>{
        let {project} = ctx.request.body;
        const schedule = await ItemDao.checkSchedule(project)
        ctx.body = {
            code:'001',
            schedule
        }
    }
}
