const db = require('../config/database').database;



module.exports={
    delete: function(date, cb){
        date = date.split('-');
        db.query("DELETE FROM e_rate WHERE YEAR(last_update)='" + date[0] + "' AND MONTH(last_update)='" + date[1] + "' AND DAY(last_update)='" + date[2] +"'",(err, result)=>{
            if (err) {
                cb(err, false);
            }
            else{
                db.query("DELETE FROM tt_counter WHERE YEAR(last_update)='" + date[0] + "' AND MONTH(last_update)='" + date[1] + "' AND DAY(last_update)='" + date[2] + "'", (err, result) => {
                    if(err){
                        cb(err, false);
                    }
                    else{
                        db.query("DELETE FROM bank_notes WHERE YEAR(last_update)='" + date[0] + "' AND MONTH(last_update)='" + date[1] + "' AND DAY(last_update)='" + date[2] + "'", cb);
                    }
                });
            }
        });
    },
    between: function(start, end, cb){
        db.query(`SELECT * FROM e_rate WHERE last_update BETWEEN '${start} 23:59:00' AND '${end} 23:59:00' ORDER BY last_update DESC`, cb);
    },
    getBySymbol: function (symbol, start, end, cb) {
        db.query(`SELECT * FROM e_rate WHERE mata_uang = '${symbol}' AND last_update BETWEEN '${start}' AND '${end}' ORDER BY last_update DESC`, cb);
    },
    insert: function(data, cb){
        let date=data.date.split("-");
        let sql=`INSERT INTO e_rate (mata_uang, jual, beli, last_update) SELECT * FROM (SELECT '${data.symbol}', '${data.e_rate.jual}' AS jual, '${data.e_rate.beli}' AS beli, '${data.date} 00:00:00') AS tmp WHERE NOT EXISTS ( SELECT mata_uang, YEAR(last_update), MONTH(last_update), DAY(last_update) FROM e_rate WHERE mata_uang = '${data.symbol}' AND YEAR(last_update)='${date[0]}' AND MONTH(last_update)='${date[1]}' AND DAY(last_update)='${date[2]}' ) LIMIT 1;`;
        db.query(sql, cb);
    },
    lastUpdate: function(cb){
        db.query("SELECT last_update FROM e_rate GROUP BY last_update ORDER BY last_update DESC LIMIT 1", cb);
    },
    indexing: function (data, last_update, new_update, cb) {
        let value_e_rate = "";
        for (var i = 0; i < data.length; i++) {
            if (i != 0) {
                value_e_rate = value_e_rate + ",";
            }
            value_e_rate = value_e_rate + " ('" + data[i].mata_uang + "','" + data[i].e_rate_jual + "','" + data[i].e_rate_beli + "','" + new_update.e_rate + "')";
        }
        let sql = "INSERT INTO e_rate (mata_uang, jual, beli, last_update) VALUES" + value_e_rate;
        if ((new Date(new_update.e_rate).getTime()) > ((new Date(last_update.bank_notes)).getTime())) {
            db.query(sql, cb);
        }
        else {
            cb(false, true);
        }
    },
    update: function(data, cb){
        let date = data.date.split("-");
        db.query(`UPDATE e_rate SET jual='${data.e_rate.jual}', beli='${data.e_rate.beli}' WHERE mata_uang='${data.symbol}' AND YEAR(last_update)='${date[0]}' AND MONTH(last_update)='${date[1]}' AND DAY(last_update)='${date[2]}'`, cb);
    },
    getBySymbolDate: function (data, cb) {
        let date = data.date.split("-");
        db.query(`SELECT * FROM e_rate WHERE mata_uang='${data.symbol}' AND YEAR(last_update)='${date[0]}' AND MONTH(last_update)='${date[1]}' AND DAY(last_update)='${date[2]}'`, cb);
    }
}