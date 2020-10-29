/*
 * @Description: 全局错误处理中间件
 */
module.exports = async (ctx, next) => {
  try {
    await next();
  } catch (error) {
    console.log(error);
    ctx.body = {
      code: '500',
      msg: '您的操作不合法'
    }
  }
}
