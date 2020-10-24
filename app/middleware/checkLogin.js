/*
    验证登录状态
 */

module.exports = function (ctx,user_id) {
    if(user_id !== ctx.session.user.user_id){
        ctx.body = {
            code:'401',
            msg:'用户未登录'
        }
        return false;
    }
    return true;
}