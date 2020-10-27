/*
    验证登录状态
 */

module.exports = function (ctx,account) {
    if(account !== ctx.session.user.account){
        ctx.body = {
            code:'401',
            msg:'用户未登录'
        }
        return false;
    }
    return true;
}
