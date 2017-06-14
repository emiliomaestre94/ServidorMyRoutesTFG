/*var mysql = require('mysql');
var db=null;

module.exports = function () {
    if(!db) {    
         db = mysql.createPool({
                 host     : 'localhost',
                 user     : 'root',
                 password : 'root',
                 database : 'heroku_3ac2f6300e00435',
                 port: '3306',
		         socketPath: '/Applications/MAMP/tmp/mysql/mysql.sock',
                 connectionLimit: 10,
                 supportBigNumbers: true,
                 multipleStatements: true
        });
    }
    return db;
};
*/
var mysql = require('mysql');
var db=null;

module.exports = function () {
   if(!db) {     
        db = mysql.createPool({
                host     : process.env.DB_HOST,
                user     : process.env.DB_USER,
                password : process.env.DB_PASSWORD,
                database : process.env.DB_DATABASE,
                connectionLimit: 10,
                supportBigNumbers: true,
                multipleStatements: true
       });  
   }
   return db;
};