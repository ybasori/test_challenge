const db = require('../config/database').database;

module.exports = {
    between: function (start, end, cb) {
        db.query(`SELECT * FROM bank_notes WHERE last_update BETWEEN '${start} 23:59:00' AND '${end} 23:59:00' ORDER BY last_update DESC`, cb);
    },
    getBySymbol: function(symbol, start, end, cb){
        db.query(`SELECT * FROM bank_notes WHERE mata_uang = '${symbol}' AND last_update BETWEEN '${start}' AND '${end}' ORDER BY last_update DESC`, cb);
    },
    insert: function (data, cb) {
        let date = data.date.split("-");
        let sql = `INSERT INTO bank_notes (mata_uang, jual, beli, last_update) SELECT * FROM (SELECT '${data.symbol}', '${data.bank_notes.jual}' AS jual, '${data.bank_notes.beli}' AS beli, '${data.date} 00:00:00') AS tmp WHERE NOT EXISTS ( SELECT mata_uang, YEAR(last_update), MONTH(last_update), DAY(last_update) FROM bank_notes WHERE mata_uang = '${data.symbol}' AND YEAR(last_update)='${date[0]}' AND MONTH(last_update)='${date[1]}' AND DAY(last_update)='${date[2]}' ) LIMIT 1;`;
        db.query(sql, cb);
    },
    lastUpdate: function(cb){
        db.query("SELECT last_update FROM bank_notes GROUP BY last_update ORDER BY last_update DESC LIMIT 1", cb);
    },
    indexing: function(data, last_update, new_update, cb){
        let value_bank_notes = "";
        for (var i = 0; i < data.length; i++) {
            if (i != 0) {
                value_bank_notes = value_bank_notes + ",";
            }
            value_bank_notes = value_bank_notes + " ('" + data[i].mata_uang + "','" + data[i].bank_notes_jual + "','" + data[i].bank_notes_beli + "','" + new_update.bank_notes + "')";
        }
        let sql = "INSERT INTO bank_notes (mata_uang, jual, beli, last_update) VALUES" + value_bank_notes;
        if ((new Date(new_update.bank_notes).getTime()) > ((new Date(last_update.bank_notes)).getTime())){
            db.query(sql, cb);
        }
        else{
            cb(false, true);
        }
    },
    update: function (data, cb) {
        let date = data.date.split("-");
        db.query(`UPDATE bank_notes SET jual='${data.bank_notes.jual}', beli='${data.bank_notes.beli}' WHERE mata_uang='${data.symbol}' AND YEAR(last_update)='${date[0]}' AND MONTH(last_update)='${date[1]}' AND DAY(last_update)='${date[2]}'`, cb);
    },
    getBySymbolDate: function (data, cb) {
        let date = data.date.split("-");
        db.query(`SELECT * FROM bank_notes WHERE mata_uang='${data.symbol}' AND YEAR(last_update)='${date[0]}' AND MONTH(last_update)='${date[1]}' AND DAY(last_update)='${date[2]}'`, cb);
    }
}