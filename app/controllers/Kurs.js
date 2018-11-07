const request = require('request');
const cheerio = require('cheerio');

const ERate = require('../models/ERate');
const MataUang = require('../models/MataUang');
const BankNotes = require('../models/BankNotes');
const TTCounter = require('../models/TTCounter');


const conv_month= function(month){
    if (month == "Jan") {
        return "01";
    }
    if (month == "Feb") {
        return "02";
    }
    if (month == "Mar") {
        return "03";
    }
    if (month == "Apr") {
        return "04";
    }
    if (month == "May") {
        return "05";
    }
    if (month == "Jun") {
        return "06";
    }
    if (month == "Jul") {
        return "07";
    }
    if (month == "Aug") {
        return "08";
    }
    if (month == "Sep") {
        return "09";
    }
    if (month == "Oct") {
        return "10";
    }
    if (month == "Nov") {
        return "11";
    }
    if (month == "Dec") {
        return "12";
    }
}

const conv_date= function(datetime){
    let dt=datetime.split(' / ');
    let date=dt[0].split(' ');
    date=date[2]+"-"+conv_month(date[1])+"-"+date[0];
    let time=dt[1].split(' ')[0]+":"+"00";
    return date+" "+time;

}

const conv_date_1 = function (datetime) {
    let dt = new Date(datetime);
    return dt.getFullYear() + "-" + (((dt.getMonth() + 1) < 10) ? "0" + (dt.getMonth() + 1) : (dt.getMonth() + 1)) + "-" + ((dt.getDate() < 10) ? "0" + dt.getDate() : dt.getDate());
}

const conv_date_2 = function (datetime) {
    let dt = new Date(datetime);
    return conv_date_1(datetime) + " " + ((dt.getHours() < 10) ? "0" + dt.getHours() : dt.getHours()) + ":" + ((dt.getMinutes() < 10) ? "0" + dt.getMinutes() : dt.getMinutes()) + ":" + ((dt.getSeconds() < 10) ? "0" + dt.getSeconds() : dt.getSeconds());
}



module.exports = function (app) {
    app.get('/api/indexing', function (req, res) {
        request('https://www.bca.co.id/id/Individu/Sarana/Kurs-dan-Suku-Bunga/Kurs-dan-Kalkulator', (error, response, html) => {
            if (!error && response.statusCode == 200) {
                let $ = cheerio.load(html);

                let e_rate_row = 1;
                let tt_counter_row = 2;
                let bank_notes_row = 3;

                let date_update = {
                    e_rate: conv_date($('.kurs-e-rate table thead tr th')[e_rate_row].children[0].next.next.data),
                    tt_counter: conv_date($('.kurs-e-rate table thead tr th')[tt_counter_row].children[0].next.next.data),
                    bank_notes: conv_date($('.kurs-e-rate table thead tr th')[bank_notes_row].children[0].next.next.data)
                }

                let datakurs = $('.kurs-e-rate table tbody').html().split('</tr>');

                let kurs = [];
                for (var i = 0; i < datakurs.length; i++) {

                    var row = datakurs[i].split("</td>");

                    var mata_uang = row[0].replace("\n                    <tr>\n                        <td align=\"center\" style=\"background-color: white\">", "");

                    var e_rata_jual = (row[1] + "").replace("\n                            <td style=\"background-color: white\">", "").replace(".", "").replace(",", ".");

                    var e_rate_beli = (row[2] + "").replace("\n                            <td style=\"background-color: white\">", "").replace(".", "").replace(",", ".");

                    var tt_counter_jual = (row[3] + "").replace("\n                                                    <td style=\"background-color: white\">", "").replace(".", "").replace(",", ".");

                    var tt_counter_beli = (row[4] + "").replace("\n                            <td style=\"background-color: white\">", "").replace(".", "").replace(",", ".");

                    var bank_notes_jual = (row[5] + "").replace("\n                                                    <td style=\"background-color: white\">", "").replace(".", "").replace(",", ".");

                    var bank_notes_beli = (row[6] + "").replace("\n                            <td style=\"background-color: white\">", "").replace(".", "").replace(",", ".");

                    if (e_rata_jual != "undefined" && e_rate_beli != "undefined") {
                        kurs.push({
                            mata_uang: mata_uang,
                            e_rate_jual: e_rata_jual,
                            e_rate_beli: e_rate_beli,
                            tt_counter_jual: tt_counter_jual,
                            tt_counter_beli: tt_counter_beli,
                            bank_notes_jual: bank_notes_jual,
                            bank_notes_beli: bank_notes_beli
                        });
                    }

                }

                let last_update={};
                BankNotes.lastUpdate((err, result)=>{
                    if(err){
                        return res.status(404).json({
                            errors: err
                        });
                    }
                    last_update.bank_notes = ((result.length != 0) ? result[0].last_update : null);

                    ERate.lastUpdate((err, result)=>{
                        if (err) {
                            return res.status(404).json({
                                errors: err
                            });
                        }
                        last_update.e_rate = ((result.length != 0) ? result[0].last_update : null);

                        TTCounter.lastUpdate((err, result) => {
                            if (err) {
                                return res.status(404).json({
                                    errors: err
                                });
                            }
                            last_update.tt_counter = ((result.length!=0)?result[0].last_update:null);

                            for(var key in last_update){
                                if (last_update[key] != null) {
                                    last_update[key] = conv_date_2(last_update[key]);
                                }
                            }

                            BankNotes.indexing(kurs, last_update, date_update, (err,result)=>{
                                if(err){
                                    return res.status(404).json({
                                        errors: err
                                    });
                                }
                                ERate.indexing(kurs, last_update, date_update, (err, result) => {
                                    if (err) {
                                        return res.status(404).json({
                                            errors: err
                                        });
                                    }
                                    TTCounter.indexing(kurs, last_update, date_update, (err, result) => {
                                        if (err) {
                                            return res.status(404).json({
                                                errors: err
                                            });
                                        }
                                        return res.status(200).json({
                                            success: true
                                        });
                                    });
                                });
                            });
                        });
                    });
                });


            }
            else {
                return res.status(404).json({
                    success: false
                });
            }
        });
    });
    app.delete('/api/kurs/:date', function(req, res){
        let date=(req.params.date+"").split('-');
        let error=0;
        if (date[0] == null) {
            error++;
        }
        if (date[1] == null) {
            error++;
        }
        if (date[2] == null) {
            error++;
        }
        if(error!=0){
            return res.status(404).json({
                success: false,
                errors:[
                    {
                        date: "date format not matched"
                    }
                ]
            });
        }
        else{
            ERate.delete(date[0]+"-"+date[1]+"-"+date[2], (err, result)=>{
                if(err){
                    return res.status(404).json({
                        success: false,
                        errors: err
                    });
                }
                else{
                    return res.status(200).json({
                        success: true
                    });
                }
            });
        }
    });
    app.get('/api/kurs', function(req, res){
        let errTotal=0;
        let errors={};
        if (req.query.startdate == null) {
            errors.startdate= ["startdate is required!"];
            errTotal++;
        }
        else{
            var __startdate=req.query.startdate.split('-');
            if (__startdate[0] == null || __startdate[1] == null || __startdate[2] == null){
                errors.startdate= ["startdate format should be YYYY-mm-dd"];
                errTotal++;
            }
            else {
                if (isNaN(__startdate[0]) || isNaN(__startdate[1]) || isNaN(__startdate[2])) {
                    errors.startdate = ["startdate format did not match!"];
                    errTotal++;
                }
            }
        }
        if (req.query.enddate == null) {
            errors.enddate= ["enddate is required!"];
            errTotal++;
        }
        else {
            var __enddate = req.query.enddate.split('-');
            if (__enddate[0] == null || __enddate[1] == null || __enddate[2] == null) {
                errors.enddate= ["enddate format should be YYYY-mm-dd"];
                errTotal++;
            }
            else {
                if (isNaN(__enddate[0]) || isNaN(__enddate[1]) || isNaN(__enddate[2])) {
                    errors.enddate = ["enddate format did not match!"];
                    errTotal++;
                }
            }
        }

        if (errTotal != 0) {
            return res.status(404).json({
                errors: errors
            });
        }
        else{
            let start = req.query.startdate;
            let end = req.query.enddate;
            MataUang.getList((err, result)=>{
                if(err){
                    return res.status(404).json({
                        success: false,
                        errors: {MataUang:err}
                    });
                }
                let matauang=result;
                BankNotes.between(start, end, (err, result)=>{
                    if(err){
                        return res.status(404).json({
                            success: false,
                            errors: {BankNotes:err}
                        });
                    }
                    let banknotes=result;

                    ERate.between(start, end, (err, result)=>{
                        if(err){
                            return res.status(404).json({
                                success: false,
                                errors: {ERate:err}
                            });
                        }
                        else{
                            let erate=result;

                            TTCounter.between(start, end, (err, result)=>{
                                if(err){
                                    return res.status(200).json({
                                        success: false,
                                        errors: {TTCounter:err}
                                    });
                                }
                                let ttcounter=result;
                                for(var i=0;i<matauang.length;i++){
                                    matauang[i].symbol = matauang[i].mata_uang;
                                    for (var j = 0; j < banknotes.length; j++) {
                                        if (matauang[i].mata_uang == banknotes[j].mata_uang) {
                                            banknotes[j].date = conv_date_1(banknotes[j].last_update);
                                            banknotes[j].symbol = banknotes[j].mata_uang;
                                            delete banknotes[j].last_update;
                                            delete banknotes[j].mata_uang;
                                            if(matauang[i].bank_notes==null){
                                                matauang[i].bank_notes = [banknotes[j]]
                                            }
                                            else{
                                                matauang[i].bank_notes.push(banknotes[j]);
                                            }
                                        }
                                    }
                                    for (var j = 0; j < erate.length; j++) {
                                        if (matauang[i].mata_uang == erate[j].mata_uang) {
                                            erate[j].date = conv_date_1(erate[j].last_update);
                                            erate[j].symbol = erate[j].mata_uang;
                                            delete erate[j].last_update;
                                            delete erate[j].mata_uang;
                                            if (matauang[i].e_rate == null) {
                                                matauang[i].e_rate = [erate[j]]
                                            }
                                            else {
                                                matauang[i].e_rate.push(erate[j]);
                                            }
                                        }
                                    }
                                    for (var j = 0; j < ttcounter.length; j++) {
                                        if (matauang[i].mata_uang == ttcounter[j].mata_uang) {
                                            ttcounter[j].date = conv_date_1(ttcounter[j].last_update);
                                            ttcounter[j].symbol = ttcounter[j].mata_uang;
                                            delete ttcounter[j].last_update;
                                            delete ttcounter[j].mata_uang;
                                            if (matauang[i].tt_counter == null) {
                                                matauang[i].tt_counter = [ttcounter[j]]
                                            }
                                            else {
                                                matauang[i].tt_counter.push(ttcounter[j]);
                                            }
                                        }
                                    }
                                    
                                    delete matauang[i].mata_uang;
                                    
                                }
                                


                                return res.status(200).json({
                                    success: true,
                                    data: matauang
                                });

                            });
                        }
                    });
                    
                });

                
            });
        }
    });
    app.get('/api/kurs/:symbol', function(req, res){
        let errTotal = 0;
        let errors = [];
        if (req.query.startdate == null) {
            errors.startdate= ["startdate is required!"];
            errTotal++;
        }
        else {
            var __startdate = req.query.startdate.split('-');
            if (__startdate[0] == null || __startdate[1] == null || __startdate[2] == null) {
                errors.startdate= ["startdate format should be YYYY-mm-dd"];
                errTotal++;
            }
            else {
                if (isNaN(__startdate[0]) || isNaN(__startdate[1]) || isNaN(__startdate[2])) {
                    errors.startdate = ["startdate format did not match!"];
                    errTotal++;
                }
            }
        }
        if (req.query.enddate == null) {
            errors.enddate= ["enddate is required!"];
            errTotal++;
        }
        else {
            var __enddate = req.query.enddate.split('-');
            if (__enddate[0] == null || __enddate[1] == null || __enddate[2] == null) {
                errors.enddate= ["enddate format should be YYYY-mm-dd"];
                errTotal++;
            }
            else {
                if (isNaN(__enddate[0]) || isNaN(__enddate[1]) || isNaN(__enddate[2])) {
                    errors.enddate = ["enddate format did not match!"];
                    errTotal++;
                }
            }
        }

        if (errTotal != 0) {
            return res.status(404).json({
                errors: errors
            });
        }
        else {
            let start = req.query.startdate;
            let end = req.query.enddate;
            let symbol = req.params.symbol;
            BankNotes.getBySymbol(symbol, start, end, (err, result)=>{
                if(err){
                    return res.status(404).json({
                        success: false,
                        errors: {bank_notes:err}
                    });
                }
                let banknotes=result;
                ERate.getBySymbol(symbol, start, end, (err, result)=>{
                    if (err) {
                        return res.status(404).json({
                            success: false,
                            errors: {e_rate:err}
                        });
                    }
                    let erate=result;
                    TTCounter.getBySymbol(symbol, start, end, (err, result)=>{
                        if (err) {
                            return res.status(404).json({
                                success: false,
                                errors: {tt_counter:err}
                            });
                        }
                        let ttcounter = result;
                        let fetched = {
                            bank_notes: banknotes,
                            e_rate: erate,
                            tt_counter: ttcounter
                        };

                        for(var key in fetched){
                            for(var i=0; i<fetched[key].length;i++){
                                fetched[key][i].symbol = fetched[key][i].mata_uang;
                                fetched[key][i].date = conv_date_1(fetched[key][i].last_update);
                                delete fetched[key][i].mata_uang;
                                delete fetched[key][i].last_update; 
                            }
                        }
                        return res.status(200).json({
                            success: true,
                            data:fetched
                        });
                    });
                });
            });
        }
    });
    app.post('/api/kurs', function(req, res){
        let errTotal=0;
        let errors={};
        if (req.body.symbol == null) {
            errors.symbol= ["symbol is required!"];
            errTotal++;
        }
        if (req.body.e_rate == null) {
            errors.e_rate= ["e_rate is required!"];
            errTotal++;
        }
        else{
            errors.e_rate={};
            if (req.body.e_rate.jual == null) {
                errors.e_rate.jual= ["jual is required!"];
                errTotal++;
            }
            if (req.body.e_rate.beli == null) {
                errors.e_rate.beli = ["beli is required!"];
                errTotal++;
            }
        }
        if (req.body.tt_counter == null) {
            errors.tt_counter= ["tt_counter is required!"];
            errTotal++;
        }
        else {
            errors.tt_counter = {};
            if (req.body.tt_counter.jual == null) {
                errors.tt_counter.jual = ["jual is required!"];
                errTotal++;
            }
            if (req.body.tt_counter.beli == null) {
                errors.tt_counter.beli = ["beli is required!"];
                errTotal++;
            }
        }
        if (req.body.bank_notes == null) {
            errors.bank_notes= ["bank_notes is required!"];
            errTotal++;
        }
        else {
            errors.bank_notes = {};
            if (req.body.bank_notes.jual == null) {
                errors.bank_notes.jual = ["jual is required!"];
                errTotal++;
            }
            if (req.body.bank_notes.beli == null) {
                errors.bank_notes.beli = ["beli is required!"];
                errTotal++;
            }
        }
        if(req.body.date==null){
            errors.date = ["date is required!"];
            errTotal++;
        }
        else {
            let dt = req.body.date.split("-");
            if (dt[0] == null || dt[1] == null || dt[2] == null) {
                errors.date = ["date format did not match!"];
                errTotal++;
            }
            else {
                if (isNaN(dt[0]) || isNaN(dt[1]) || isNaN(dt[2])) {
                    errors.date = ["date format did not match!"];
                    errTotal++;
                }
            }
        }

        if(errTotal!=0){
            return res.status(404).json({errors:errors});
        }
        else{
            ERate.insert(req.body, (err, result)=>{
                if(err){
                    return res.status(404).json({ errors: err });
                }
                BankNotes.insert(req.body, (err, result)=>{
                    if (err) {
                        return res.status(404).json({ errors: err });
                    }
                    TTCounter.insert(req.body, (err, result)=>{
                        if (err) {
                            return res.status(404).json({ errors: err });
                        }
                        return res.status(200).json({
                            success:true,
                            data: req.body
                        });
                    });
                });
                
            });
        }
        
    });
    app.put('/api/kurs', function (req, res) {
        let errTotal = 0;
        let errors = {};
        if (req.body.symbol == null) {
            errors.symbol = ["symbol is required!"];
            errTotal++;
        }
        if (req.body.e_rate == null) {
            errors.e_rate = ["e_rate is required!"];
            errTotal++;
        }
        else {
            errors.e_rate = {};
            if (req.body.e_rate.jual == null) {
                errors.e_rate.jual = ["jual is required!"];
                errTotal++;
            }
            if (req.body.e_rate.beli == null) {
                errors.e_rate.beli = ["beli is required!"];
                errTotal++;
            }
        }
        if (req.body.tt_counter == null) {
            errors.tt_counter = ["tt_counter is required!"];
            errTotal++;
        }
        else {
            errors.tt_counter = {};
            if (req.body.tt_counter.jual == null) {
                errors.tt_counter.jual = ["jual is required!"];
                errTotal++;
            }
            if (req.body.tt_counter.beli == null) {
                errors.tt_counter.beli = ["beli is required!"];
                errTotal++;
            }
        }
        if (req.body.bank_notes == null) {
            errors.bank_notes = ["bank_notes is required!"];
            errTotal++;
        }
        else {
            errors.bank_notes = {};
            if (req.body.bank_notes.jual == null) {
                errors.bank_notes.jual = ["jual is required!"];
                errTotal++;
            }
            if (req.body.bank_notes.beli == null) {
                errors.bank_notes.beli = ["beli is required!"];
                errTotal++;
            }
        }
        if (req.body.date == null) {
            errors.date = ["date is required!"];
            errTotal++;
        }
        else{
            let dt= req.body.date.split("-");
            if (dt[0] == null || dt[1] == null || dt[2] == null){
                errors.date = ["date format did not match!"];
                errTotal++;
            }
            else{
                if (isNaN(dt[0]) || isNaN(dt[1]) || isNaN(dt[2])){
                    errors.date = ["date format did not match!"];
                    errTotal++;
                }
            }
        }

        if (errTotal != 0) {
            return res.status(404).json({ errors: errors });
        }
        else {
            let exist={}
            ERate.getBySymbolDate(req.body, (err, result) => {
                if (err) {
                    return res.status(404).json({ errors: err });
                }
                exist.e_rate=result;
                BankNotes.getBySymbolDate(req.body, (err, result) => {
                    if (err) {
                        return res.status(404).json({ errors: err });
                    }
                    exist.bank_notes = result;
                    TTCounter.getBySymbolDate(req.body, (err, result) => {
                        if (err) {
                            return res.status(404).json({ errors: err });
                        }
                        exist.tt_counter = result;
                        let e=0;
                        let eString={};
                        for(var key in exist){
                            if(exist[key].length==0){
                                eString[key] = `${key} did not exist`;
                                e++;
                            }
                        }
                        if (e != 0) {
                            return res.status(404).json({ errors: eString });
                        }
                        else{
                            ERate.update(req.body, (err, result) => {
                                if (err) {
                                    return res.status(404).json({ errors: err });
                                }
                                BankNotes.update(req.body, (err, result) => {
                                    if (err) {
                                        return res.status(404).json({ errors: err });
                                    }
                                    TTCounter.update(req.body, (err, result) => {
                                        if (err) {
                                            return res.status(404).json({ errors: err });
                                        }
                                        return res.status(200).json({ 
                                            success: true,
                                            data: req.body 
                                        });
                                    });
                                });

                            });
                        }
                    });
                });
            });
        }
    });
}