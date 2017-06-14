var express = require('express');
var router = express.Router();
var db = require('../helpers/database')();
var comprobacionjwt= require ('../helpers/comprobacionjwt');
var htmlerror= require ('../emails/htmlerror');
var nodemailer = require('nodemailer');
const nodemailerDkim = require('nodemailer-dkim');
router.get('/',comprobacionjwt,function(req,res){
	db.getConnection(function(err, connection) {
        var data = {
            "Errores":1,
            "Comunidades":""
        };
        var Id = connection.escape(req.query.id); //Variable que recoje el id de las comunidades de la URI comunidades?id={num}
        var Nombre = connection.escape(req.query.nombre); //Variable que recoje el nombre de la comunidadad de la URI comunidades?nombre={string}
        var consulta="SELECT * FROM comunidad";      
        if(Nombre!= 'NULL' || Id!='NULL'){
            var i=0;
            consulta += " WHERE ";
            if(Nombre!= 'NULL'){
                console.log("Nombre:"+Nombre);
                if (i==1) {
                    consulta  += " AND ";
                    i--;	
                }
                consulta  += "Nombre_comunidad LIKE '%"+Nombre.replace(/'/g, "")+"%'";
                i++;
            }
            if(Id!= 'NULL'){
                console.log("Id:"+Id);
                if (i==1) {
                    consulta  += " AND ";
                    i--;	
                }
                consulta  += "Id_comunidad="+Id;
                i++;
            }
        }
        console.log(consulta);
        connection.query(consulta,function(err, rows, fields){
            if(err){
				console.log("Error en la query...");
				res.status(400).json({ error: err });
			}else{
				console.log("Query OK");
				if(rows.length != 0){
					console.log("Devuelvo la comunidad");
					data["Errores"] = 0;
                    data["Comunidades"] = rows;
                    res.json(data);
				}else{
					console.log("No se corresponde con ninguna comunidad...");
					data["Comunidades"] = 'No se corresponde con ninguna comunidad';
                    res.json(data);
				}
			}
        });
    connection.release();
	});
});
module.exports = router;