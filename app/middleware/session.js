/*
 * @Description: session配置
 */
let store = {
  storage: {},
  set (key, session) {
    console.log(key)
    console.log(session)
    for(var cur in this.storage){
      if(this.storage[cur].user.account === session.user.account){
        delete this.storage[cur];
      }
    }
    this.storage[key] = session;
  },
  get (key) {
    return this.storage[key];
  },
  destroy (key) {
    delete this.storage[key];
  }
}
let CONFIG = {
  key: 'koa:session',
  maxAge: 86400000,
  autoCommit: true,
  overwrite: true,
  httpOnly: false,
  signed: true,
  rolling: false,
  renew: false,
  sameSite: 'none',
  store
}

module.exports = CONFIG;
