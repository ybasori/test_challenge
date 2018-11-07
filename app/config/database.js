
const mysql = require('mysql');

module.exports = {
    database: mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: '',
        database: 'test_challenge'
    })
}