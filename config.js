const path = require('path');

module.exports = {
    Port: 30000,
    staticDir: path.resolve('./public'),
    dbConfig: {
        connectionLimit: 10,
        host: 'localhost',
        user: 'root',
        password: 'Xuan123#',
        database: 'company'
    }
}