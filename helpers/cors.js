
var whitelist = [
'http://localhost:3000',
'http://localhost:4200',
'http://localhost:5000'

]; 
var corsOptions = {
    origin: function(origin, callback){
        var originIsWhitelisted = whitelist.indexOf(origin) !== -1;
        callback(null, originIsWhitelisted);
    },
    credentials: true
};


module.exports = corsOptions;

