const db = require('../config/database').database;

module.exports = {
    getList: function (cb) {
        db.query("SELECT * FROM mata_uang", cb);
    }
}