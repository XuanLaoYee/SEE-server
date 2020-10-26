const Koa = require('koa');
const KoaStatic = require('koa-static');
const KoaBody = require('koa-body');
const Session = require('koa-session');
const https = require('https');
const http = require('http');
const fs = require('fs');
var enforceHttps = require('koa-sslify').default;
const ItemDao = require('./app/models/Dao/ItemsDao')

function setRegular(targetTime){
    var timeInterval,nowTime,nowSeconds,targetSeconds

    nowTime = new Date()
    // 计算当前时间的秒数

    nowSeconds = nowTime.getHours() * 3600 + nowTime.getMinutes() * 60 + nowTime.getSeconds()

    let theSplit = targetTime.split(":")
    let Hour = Number(theSplit[0])
    let Minute = Number(theSplit[1])
    let Second = Number(theSplit[2])

    // 计算目标时间对应的秒数
    targetSeconds =  Hour * 3600 + Minute * 60 + Second

    //  判断是否已超过今日目标小时，若超过，时间间隔设置为距离明天目标小时的距离
    timeInterval = targetSeconds > nowSeconds ? targetSeconds - nowSeconds: targetSeconds + 24 * 3600 - nowSeconds
    setTimeout(getProductFileList,timeInterval * 1000)
}

function now() {
    nowTime = new Date()
    // 计算当前时间的秒数
    return nowTime.getTime();
}

function getProductFileList(){
    ItemDao.recyleTaskByTime(now())//你自己的数据处理函数
    setTimeout(getProductFileList,24*3600 * 1000)//之后每天调用一次
}

setRegular("20:05:00");
setRegular("20:05:05");
setRegular("20:05:07");
setRegular("20:05:09");
setRegular("20:05:30");
// setRegular("20:02:00");
// setRegular("20:02:00");
// setRegular("20:02:00");
// setRegular("20:02:00");
// setRegular("20:02:00");
// setRegular("20:02:00");
// setRegular("20:02:00");




let { Port, staticDir } = require('./config');

let app = new Koa();

// app.use(enforceHttps());
//强制转换为https协议
//允许跨域
const corsOptions = {
    //To allow requests from client
    origin: [
        "http://localhost:9527",
    ],
    credentials: true, //是否允许发送Cookie
    // allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], //设置所允许的HTTP请求方法
    // allowHeaders: ['Content-Type', 'Authorization', 'Accept'], //设置服务器支持的所有头信息字段
    // exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'] //设置获取其他自定义字段
};
const cors = require('koa2-cors');
app.use(cors(corsOptions));

// 处理异常
const error = require('./app/middleware/error');
app.use(error);

// 为静态资源请求重写url
const rewriteUrl = require('./app/middleware/rewriteUrl');
app.use(rewriteUrl);
// 使用koa-static处理静态资源
app.use(KoaStatic(staticDir));

// session
const CONFIG = require('./app/middleware/session');
app.keys = ['session app keys'];
app.use(Session(CONFIG, app));

// 判断是否登录
const isLogin = require('./app/middleware/isLogin');
app.use(isLogin);

app.use(async (ctx, next) => {
    ctx.state.user = ctx.session.user;
    await next();
});

// 处理请求体数据
const koaBodyConfig = require('./app/middleware/koaBodyConfig');
app.use(KoaBody(koaBodyConfig));


// 使用路由中间件
const Routers = require('./app/routers');
app.use(Routers.routes()).use(Routers.allowedMethods())

const KoaLogger = require('koa-logger')
const logger = KoaLogger();
app.use(logger);


var options = {
    key: fs.readFileSync('./4670790_localhost.mofon.top.key'),
    cert: fs.readFileSync('./4670790_localhost.mofon.top.pem')
};

https.createServer(options,app.callback()).listen(Port,()=>{
    console.log(`https服务器在${ Port }端口启动`)
});
// https.createServer(options,app.callback()).listen(Port+1,() =>{
//     console.log(`https服务器在${ Port+1 }端口启动`)
// });




