/*
 * @Description: 全局登录拦截器
 */
module.exports = async (ctx, next) => {
  if (ctx.url.startsWith('/api/')) {
    if (!ctx.session.user) {
      ctx.body = {
        code: '401',
        msg: '用户没有登录，请登录后再操作'
      }
      return;
    }
  }
  await next();
}
