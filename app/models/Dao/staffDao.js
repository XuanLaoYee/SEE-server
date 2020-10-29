const db = require("./db")

function timestamps2string(v){
    var now = new Date(v)
    var yy = now.getFullYear();      //年
    var mm = now.getMonth() + 1;     //月
    var dd = now.getDate();          //日
    var hh = now.getHours();         //时
    var ii = now.getMinutes();       //分
    var ss = now.getSeconds();       //秒
    var clock = yy + "-";
    if(mm < 10) clock += "0";
    clock += mm + "-";
    if(dd < 10) clock += "0";
    clock += dd + " ";
    if(hh < 10) clock += "0";
    clock += hh + ":";
    if (ii < 10) clock += '0';
    clock += ii + ":";
    if (ss < 10) clock += '0';
    clock += ss;
    return clock;
}

function now() {
    nowTime = new Date()
    // 计算当前时间的秒数
    return nowTime.getTime();
}

module.exports = {
    login:async (account,password)=>{
        const sql = 'select * from staff where account = ? and password = ?'
        return await db.query(sql,[account,password])
    },
    finishTheTask: async (id) => {
        const sql = 'update task set done = 1 where id = ?';
        await db.query(sql, id)
        const sql1 = 'select * from task where id = ?';
        const theTask = await db.query(sql1,id);
        const project = theTask[0].project;
        const sql2 = 'select * from task where project = ? and done = 0'
        const leftTask = await db.query(sql2,project);
        if(leftTask.length === 0){
            const sql3 = 'update participate set done = 1 where project = ?'
            await db.query(sql3,project)
        }
    },
    transforTheTask: async (id, account, deadline) => {
        const msg1 = 'insert into messagebox values (?,?,?,2)'
        const sql = 'select * from perform where id = ? and transfer = 0'
        const oldStaff = await db.query(sql,[id])
        console.log(oldStaff)
        if(deadline !== null && deadline !=='null' && deadline !== undefined && deadline !== 0){
            const theTime = timestamps2string(deadline)
            await db.query(msg1,["您好,我已将我的"+id.toString()+"号子任务移交给您,请您在"+theTime+"之前完成,谢谢",account,oldStaff[0].account])
            setTimeGuider(deadline)
        }else{
            await db.query(msg1,["您好,我已将我的"+id.toString()+"号子任务移交给您,谢谢",account,oldStaff[0].account])
        }
        const sql1 = 'update perform set executor = ? where id = ? and transfer = 0'
        const sql2 = 'update perform set deadline =? where id = ? and transfer = 0'
        const sql3 = 'update perform set transfer = 1 where id = ? and transfer = 0'
        await db.query(sql1, [account, id])
        await db.query(sql2, [deadline, id])
        await db.query(sql3,[id])



        async function recyleTaskByTime(time){
            // console.log(time);
            const sql = 'select * from perform where deadline <= ? and transfer = 1';
            const performs = await db.query(sql, time);
            const msg = 'insert into messagebox values (?,?,null,0)'
            const msg1 = 'insert into messagebox values (?,?,null,0)'
            for (let i = 0; i < performs.length; i++) {
                await db.query(msg, ["您的"+(performs[i].id).toString()+"号任务执行时间已超时,执行权被自动回收", performs[i].executor])
                await db.query(msg1, ["您委托的"+(performs[i].id).toString()+"号任务在规定时间内未完成,执行权被自动回收", performs[i].account])
                const sql2 = 'update perform set executor = ? where id = ?';
                await db.query(sql2, [performs[i].account, performs[i].id])
                const sql3 = 'update perform set transfer = 0 where id = ?'
                await db.query(sql3,performs[i].id)
                const sql4 = 'update perform set deadline = null where id = ?'
                await db.query(sql4,performs[i].id)
            }
        }
        function getProductFileList() {
            recyleTaskByTime(now() + 5000)//你自己的数据处理函数，加个5s的预取
            // setTimeout(getProductFileList, 24 * 3600 * 1000)//之后每天调用一次
        }
        function setTimeGuider(targetTime){
            nowTime = new Date()
            nowSeconds = nowTime.getTime();
            timeInterval = targetTime > nowSeconds ? (targetTime - nowSeconds) / 1000 : 0
            setTimeout(getProductFileList, timeInterval)
        }


    },
    findOngoingTask: async (account, id) => {
        const sql = 'select * from perform where id = ? and account = ? and transfer = 1'
        return await db.query(sql, [id, account])
    },
    findTask: async (account) => {
        const sql = 'select * from perform where account=? ';
        return await db.query(sql, account)
    },
    recycleTask: async (id,account) => {
        const sql1 = 'select * from perform where transfer = 1 and id = ?'
        const theExecutor = await db.query(sql1,[id])
        const sql = 'update perform set executor = ? where id = ?'
        const sql2 = 'update perform set transfer = 0 where executor = ? and account = ? and id = ?'
        await db.query(sql,[account,id])
        await db.query(sql2,[account,account,id])
        const msg = 'insert into messagebox values (?,?,?,2)'
        await db.query(msg,["交由您的"+id.toString()+"号任务已被我收回",theExecutor[0].executor,account,])
    },
    allMyTask: async (account) => {
        const sql = 'select * from perform where account = ? or executor = ?';
        return await db.query(sql,[account,account])
    },
    findParticipateProject:async (account) => {
        const sql = 'select * from participate where account = ?'
        return await db.query(sql,account)
    },
    checkIsMyAndCanDo: async (id,account) =>{
        const sql = 'select * from perform where id = ? and(( account = ? and transfer = 0) or (executor = ? and transfer = 1))';
        const tasks = await db.query(sql,[id,account,account])
        if(tasks.length === 0){
            return null
        }
        const sql1 = 'select * from task where id = ? and done = 0';
        return await db.query(sql1, id)
    },
    checkIsMyProject:async (account,project) =>{
        const sql = 'select * from participate where project = ? and account = ?  ';
        return await db.query(sql, [project, account]);
    },
    checkProjectProgress: async (project)=>{
        const sql = 'select * from task where project = ?'
        return await db.query(sql,project);
    },
    checkMyTaskInProject : async (project,account) =>{
        const sql = 'select * from task where project = ?'
        const tasks = await db.query(sql,project);
        var ids = []
        for(var i=0;i<tasks.length;i++){
            const sql1 = 'select * from perform where id = ? and account = ?';
            const theTask = await db.query(sql1,[tasks[i].id,account])
            if(theTask.length!==0){
                ids.push(theTask[0].id)
            }
        }
        return ids
    },
    checkTheTask:async (id)=>{
        const sql = 'select * from task where id = ?'
        return await db.query(sql,id)
    },
    isCanDoThisTask:async (id,account)=>{
        const sql = 'select * from perform where id = ? and (account = ? or executor = ?) ';
        const theTask = await db.query(sql,[id,account,account])
        if(theTask.length !== 0){
            let theTaskId = theTask[0].id;
            // const sql1 = 'select * from task where project = ?';
            // const tasks = await db.query(sql1,theTask[0].project)
            const sql2 = 'select * from sequence where nextTask = ?'
            const theProTasks = await db.query(sql2,[theTaskId])
            if(theProTasks.length===0){
                return true;
            }else{
                for(var i=0;i<theProTasks.length;i++){
                    const sql3 = 'select * from task where id = ? and done = 1';
                    const tempTask = await db.query(sql3,theProTasks[i].thisTask)
                    if(tempTask.length === 0){
                        return false;
                    }
                }
                return true;
            }
        }
        return false;
    },
    checkTheProjectNameById:async (id)=>{
        const sql = 'select * from task where id = ?'
        const tasks = await db.query(sql,id)
        const sql1 = 'select * from projectname where project = ?'
        const theProject = await db.query(sql1,tasks[0].project);
        return theProject[0].name;
    }
}
