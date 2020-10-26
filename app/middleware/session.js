/*
 * @Description: session配置
 */
let store = {
  storage: {},
  set (key, session) {
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
