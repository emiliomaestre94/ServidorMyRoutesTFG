var mysql = require('mysql');
var db=null;

module.exports = function () {
   if(!db) {    
        db = mysql.createPool({
                host     : "us-cdbr-iron-east-04.cleardb.net",
                user     : "b3f3fb41577c3b",
                password : "8d4e1afd",
                database : "heroku_3ac2f6300e00435",
                connectionLimit: 10,
                supportBigNumbers: true,
                multipleStatements: true
       });  
   }
   return db;
};