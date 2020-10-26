const db = require('./db')

function isInArray(arr, value) {
    for (var i = 0; i < arr.length; i++) {
        if (value === arr[i]) {
            return true;
        }
    }
    return false;
}

function now() {
    nowTime = new Date()
    // 计算当前时间的秒数
    return nowTime.getTime();
}


function startRecyle() {
    const sql = 'select * from perform where transfer = 1';
    const tasks = db.query(sql)
    console.log(tasks[0].deadline)
    for (var i = 0; i < tasks.length; i++) {
        setTimeGuider(tasks[i].deadline)
    }
}


module.exports = {
    insertSubTask: async (sort, project) => {
        const sql = 'insert into task values(null ,?,?,0) '
        return await db.query(sql, [sort, project]);
    },
    insertPerform: async (account, id, executor) => {
        const sql = 'insert into perform values(?,?,?,null,0)';
        await db.query(sql, [account, id, executor]);
        const sql1 = 'select project from task where id = ?';
        const projectId = await db.query(sql1, id);
        const sql2 = 'select * from participate where account = ? and project = ?';
        const participate = await db.query(sql2, [account, projectId[0].project]);
        if (participate.size() !== 0) {
            const sql3 = 'insert into participate value (?,?,0)';
            await db.query(sql3, [account, projectId[0].project]);
        }
    },
    findTaskByProject: async (project) => {
        const sql = 'select * from task where project = ?'
        return await db.query(sql, project)
    },
    getTheProjectName: async (project) => {
        const sql = 'select * from projectname where project = ?'
        return await db.query(sql, project)
    },
    getIsDone: async (id) => {
        const sql = 'select * from task where id = ?'
        const theTask = await db.query(sql, id)
        return theTask[0].done;
    },
    getTheSort: async (id) => {
        const sql = 'select * from task where id = ?'
        const theTask = await db.query(sql, id);
        return theTask[0].sort;
    },
    recyleTaskByTime: async (time) => {
        // console.log(time);
        const sql = 'select * from perform where deadline <= ? and transfer = 1';
        const performs = await db.query(sql, time);
        const msg = 'insert into messagebox values (?,?,null,0)'
        const msg1 = 'insert into messagebox values (?,?,null,0)'
        for (let i = 0; i < performs.length; i++) {
            await db.query(msg, ["您的"+(performs[i].id).toString()+"号任务执行时间已超时,执行权被自动回收", performs[i].executor])
            await db.query(msg1, ["您委托的"+(performs[i].id).toString()+"号任务在规定时间内未完成,执行权被自动回收", performs[i].account])
            const sql2 = 'update perform set executor = ? and transfer = 0 where id = ?';
            await db.query(sql2, [performs[i].account, performs[i].id])
        }
    },
    startRecyle:() => {
        const sql = 'select * from perform where transfer = 1';
        db.query(sql).then(tasks=>{

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
            for (var i = 0; i < tasks.length; i++) {
                setTimeGuider(tasks[i].deadline)
            }
        })
            .catch(err =>{
                // .catch 返回报错信息
                console.log(err)
            })
    },

}
