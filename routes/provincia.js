var express = require('express');
var router = express.Router();
var db = require('../helpers/database')();
var comprobacionjwt= require ('../helpers/comprobacionjwt');
var htmlerror= require ('../emails/htmlerror');
var nodemailer = require('nodemailer');
const nodemailerDkim = require('nodemailer-dkim');
router.get('/',comprobacionjwt,function(req,res){
	db.getConnection(function(err, connection) {
		if (err) throw err;	
    	var data = {
			"Errores":1,
			"Provincia":""
		};
		var Id_provincia = connection.escape(req.query.id_provincia); //Variable que recoje el id de la provincia de la URI municipios?id={num}
		var Id_comunidad = connection.escape(req.query.id_comunidad); //Variable que recoje el id de la comunidad de la URI municipios?id={num}
		var Nombre_comunidad = connection.escape(req.query.nombre_comunidad); //Variable que recoje el id de la comunidad de la URI municipios?id={num}
		var Nombre_provincia = connection.escape(req.query.nombre_provincia); //Variable que recoje el id de la comunidad de la URI municipios?id={num}
		var consulta = "SELECT * FROM provincia";
		if(Nombre_provincia != 'NULL' || Id_provincia!='NULL' || Nombre_comunidad!= 'NULL' || Id_comunidad!='NULL'){
            var i=0;
            consulta += " WHERE ";
			if(Nombre_provincia!= 'NULL'){
                console.log("Nombre_provincia:"+Nombre_provincia);
                if (i==1) {
                    consulta  += " AND ";
                    i--;	
                }
                consulta  += "Nombre_provincia LIKE '%"+Nombre_provincia.replace(/'/g, "")+"%'";
                i++;
            }
            if(Id_provincia!= 'NULL'){
                console.log("Id:"+Id_provincia);
                if (i==1) {
                    consulta  += " AND ";
                    i--;	
                }
                consulta  += "Id_provincia="+Id_provincia;
                i++;
            }
			if(Nombre_comunidad!= 'NULL'){
                console.log("Nombre:"+Nombre_comunidad);
                if (i==1) {
                    consulta  += " AND ";
                    i--;	
                }
                consulta  += "Nombre_comunidad_provincia LIKE '%"+Nombre_comunidad.replace(/'/g, "")+"%'";
                i++;
            }
            if(Id_comunidad!= 'NULL'){
                console.log("Id_comunidad:"+Id_comunidad);
                if (i==1) {
                    consulta  += " AND ";
                    i--;	
                }
                consulta  += "Id_comunidad_provincia="+Id_comunidad;
                i++;
            }
			
        }
		console.log(consulta);
		connection.query(consulta,function(err, rows, fields){
			if(err){
                htmlerror(err); 					return res.status(400).json({ error: err });
            }else{
                if(rows.length != 0){
                    data["Errores"] = 0;
                    data["Provincia"] = rows;
                    return res.status(200).json(data);	
			    }else{
                    data["Provincia"] = 'No hay provincias';
                    return res.status(205).json(data);
			    }
            }
		});
    connection.release();
	});
});


module.exports = router;