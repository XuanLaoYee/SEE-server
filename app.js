const Koa = require('koa');
const KoaStatic = require('koa-static');
const KoaBody = require('koa-body');
const Session = require('koa-session');
const https = require('https');
const http = require('http');
const fs = require('fs');
var enforceHttps = require('koa-sslify').default;


let { Port, staticDir } = require('./config');

let app = new Koa();

// app.use(enforceHttps());
//强制转换为https协议
//允许跨域
const cors = require('koa2-cors');
app.use(cors());

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




