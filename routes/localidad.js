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
			"Localidad":""
		};
		var Id_localidad = connection.escape(req.query.id_localidad); //Variable que recoje el id de la localidad de la URI municipios?id={num}
		var Id_provincia = connection.escape(req.query.id_provincia); //Variable que recoje el id de la provincia de la URI municipios?id={num}
		var Id_comunidad = connection.escape(req.query.id_comunidad); //Variable que recoje el id de la comunidad de la URI municipios?id={num}
		var Nombre_comunidad = connection.escape(req.query.nombre_comunidad); //Variable que recoje el id de la comunidad de la URI municipios?id={num}
		var Nombre_provincia = connection.escape(req.query.nombre_provincia); //Variable que recoje el id de la comunidad de la URI municipios?id={num}
		var Nombre_localidad = connection.escape(req.query.nombre_localidad); //Variable que recoje el id de la comunidad de la URI municipios?id={num}
		var consulta = "SELECT * FROM localidad";
		if(Nombre_localidad!= 'NULL' || Id_localidad!='NULL' || Nombre_provincia!= 'NULL' || Id_provincia!='NULL' || Nombre_comunidad!= 'NULL' || Id_comunidad!='NULL'){
            var i=0;
            consulta += " WHERE ";
            if(Nombre_localidad!= 'NULL'){
                console.log("Nombre_localidad:"+Nombre_localidad);
                if (i==1) {
                    consulta  += " AND ";
                    i--;	
                }
                consulta  += "Nombre_localidad LIKE '%"+Nombre_localidad.replace(/'/g, "")+"%'";
                i++;
            }
            if(Id_localidad!= 'NULL'){
                console.log("Id_localidad:"+Id_localidad);
                if (i==1) {
                    consulta  += " AND ";
                    i--;	
                }
                consulta  += "Id_localidad="+Id_localidad;
                i++;
            }
			if(Nombre_provincia!= 'NULL'){
                console.log("Nombre_provincia:"+Nombre_provincia);
                if (i==1) {
                    consulta  += " AND ";
                    i--;	
                }
                consulta  += "Nombre_provincia_localidad LIKE '%"+Nombre_provincia.replace(/'/g, "")+"%'";
                i++;
            }
            if(Id_provincia!= 'NULL'){
                console.log("Id:"+Id_provincia);
                if (i==1) {
                    consulta  += " AND ";
                    i--;	
                }
                consulta  += "Id_provincia_localidad="+Id_provincia;
                i++;
            }
			if(Nombre_comunidad!= 'NULL'){
                console.log("Nombre:"+Nombre_comunidad);
                if (i==1) {
                    consulta  += " AND ";
                    i--;	
                }
                consulta  += "Nombre_comunidad_localidad LIKE '%"+Nombre_comunidad.replace(/'/g, "")+"%'";
                i++;
            }
            if(Id_comunidad!= 'NULL'){
                console.log("Id_comunidad:"+Id_comunidad);
                if (i==1) {
                    consulta  += " AND ";
                    i--;	
                }
                consulta  += "Id_comunidad_localidad="+Id_comunidad;
                i++;
            }
			
        }
		console.log(consulta);
		connection.query(consulta,function(err, rows, fields){
			if(err){
                console.log(err);
                htmlerror(err); 					return res.status(400).json({ error: err });
            }else{
                if(rows.length != 0){
                    data["Localidad"] = rows;
                    return res.status(200).json(data);
                }else{
                    console.log("Error al insertar la localidad...");
                    data["Localidad"] = 'Localidad no insertada';
                    htmlerror(err); 					return res.status(400).json(data);
                }
            }
		});
    connection.release();
	});
});

//Funcion que genera el POST de localidad
router.post('/',comprobacionjwt,function(req,res){
	db.getConnection(function(err, connection) {
		if (err) throw err;
		var Nombre_comunidad = connection.escape(req.body.nombre_comunidad); //Variable que recoje el nombre de la comunidad de la URI municipios?nombre_comunidad={string}
		var Nombre_provincia = connection.escape(req.body.nombre_provincia); //Variable que recoje el nombre de la provincia de la URI municipios?nombre_provincia={string}
		var Nombre_localidad = connection.escape(req.body.nombre_localidad); //Variable que recoje el nombre de la localidad de la URI municipios?nombre_localidad={string}
		console.log(req.body.nombre_comunidad);
        var data = {
			"Comunidad":"",
            "Provincia":"",
            "Localidad":""
		};
		var consulta= "SELECT Id_comunidad FROM comunidad WHERE Nombre_comunidad="+Nombre_comunidad;
		console.log(consulta);
        connection.query(consulta,function(err, rows, fields){
			if(err){
                console.log(err);
				htmlerror(err); 					return res.status(400).json({ error: err });
			}else{
                if(rows.length != 0){
					console.log("Devuelvo el id de la comunidad");
                    var com = rows[0].Id_comunidad;
                    var consulta= "SELECT Id_provincia FROM provincia WHERE Nombre_provincia="+Nombre_provincia+" AND Id_comunidad_provincia="+com;
                    console.log(consulta);
                    connection.query(consulta,function(err, rows1, fields){
                        if(err){
                            console.log(err);
                            htmlerror(err); 					return res.status(400).json({ error: err });
                        }else{
                            if(rows1.length != 0){
                                console.log("Devuelvo el id de la provincia");
                                var prov = rows1[0].Id_provincia;
                                var consulta= "SELECT * FROM localidad WHERE Nombre_localidad="+Nombre_localidad+" AND Id_comunidad_localidad="+com+" AND Id_provincia_localidad="+prov;
                                console.log(consulta);
                                connection.query(consulta,function(err, rows2, fields){
                                    if(err){
                                        console.log(err);
                                        htmlerror(err); 					return res.status(400).json({ error: err });
                                    }else{
                                        if(rows2.length != 0){
                                            console.log("Devuelvo el id de la localidad");
                                            data["Localidad"] = rows2;
                                            return res.status(200).json(data);
                                        }else{
                                            var consulta= "INSERT INTO `localidad` (`Id_localidad`, `Id_comunidad_localidad`, `Id_provincia_localidad`, `Nombre_localidad`) VALUES (NULL,"+com+", "+prov+", "+Nombre_localidad+");";
                                            console.log(consulta);
                                            connection.query(consulta,function(err, rows3, fields){
                                                if(err){
                                                    console.log(err);
                                                    htmlerror(err); 					return res.status(400).json({ error: err });
                                                }else{
                                                    if(rows3.length != 0){
                                                        console.log("Devuelvo el id de la localidad");
                                                        console.log(rows3);
                                                        console.log(rows3.insertId);
                                                        data["Localidad"] = rows3.insertId;
                                                        data["Comunidad"] = com;
                                                        data["Provincia"] = prov;
                                                        return res.status(200).json(data);
                                                    }else{
                                                        console.log("Error al insertar la localidad...");
                                                        data["Localidad"] = 'Localidad no insertada';
                                                        htmlerror(err); 					return res.status(400).json(data);
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            }else{
                                var consulta= "INSERT INTO `provincia` (`Id_provincia`, `Id_comunidad_provincia`, `Nombre_provincia`) VALUES (NULL,"+com+","+Nombre_provincia+");";
                                console.log(consulta);
                                connection.query(consulta,function(err, rows4, fields){
                                    if(err){
                                        console.log(err);
                                        htmlerror(err); 					return res.status(400).json({ error: err });
                                    }else{
                                        if(rows4.length != 0){
                                            console.log("Devuelvo el id de la provincia");
                                            console.log(rows4);
                                            var prov = rows4.insertId;
                                            var consulta= "INSERT INTO `localidad` (`Id_localidad`, `Id_comunidad_localidad`, `Id_provincia_localidad`, `Nombre_localidad`) VALUES (NULL,"+com+", "+prov+", "+Nombre_localidad+");";
                                            console.log(consulta);
                                            connection.query(consulta,function(err, rows5, fields){
                                                if(err){
                                                    console.log(err); 
                                                    htmlerror(err); 					return res.status(400).json({ error: err });
                                                }else{
                                                    if(rows5.length != 0){
                                                        console.log("Devuelvo el id de la localidad");
                                                        data["Localidad"] = rows5.insertId;
                                                        data["Comunidad"] = com;
                                                        data["Provincia"] = prov;
                                                        return res.status(200).json(data);
                                                    }else{
                                                        console.log("Error al insertar la localidad...");
                                                        data["Localidad"] = 'Localidad no insertada';
                                                        htmlerror(err); 					return res.status(400).json(data);
                                                    }
                                                }
                                            });
                                        }else{
                                            console.log("Error al insertar la provinvia...");
                                            data["Provincia"] = 'Provincia no insertada';
                                            htmlerror(err); 					return res.status(400).json(data);
                                        }
                                    }
                                });
                            }
                        }
                    });
				}else{
					console.log("No se corresponde con ninguna comunidad...");
					var consulta= "INSERT INTO `comunidad` (`Id_comunidad`, `Nombre_comunidad`) VALUES (NULL, "+Nombre_comunidad+");";
                    console.log(consulta);
                    connection.query(consulta,function(err, rows6, fields){
                        if(err){
                            console.log(err);
                            htmlerror(err); 					return res.status(400).json({ error: err });
                        }else{
                            if(rows6.length != 0){
                                console.log("Devuelvo el id de la comunidad");
                                console.log(rows6);
                                var com = rows6.insertId;
                                var consulta= "INSERT INTO `provincia` (`Id_provincia`, `Id_comunidad_provincia`, `Nombre_provincia`) VALUES (NULL,"+com+", "+Nombre_provincia+");";
                                console.log(consulta);
                                connection.query(consulta,function(err, rows7, fields){
                                    if(err){
                                        console.log(err);
                                        htmlerror(err); 					return res.status(400).json({ error: err });
                                    }else{
                                        if(rows7.length != 0){
                                            console.log("Devuelvo el id de la provincia");
                                            console.log(rows7);
                                            var prov = rows7.insertId;
                                            var consulta= "INSERT INTO `localidad` (`Id_localidad`, `Id_comunidad_localidad`, `Id_provincia_localidad`, `Nombre_localidad`) VALUES (NULL,"+com+", "+prov+", "+Nombre_localidad+");";
                                            console.log(consulta);
                                            connection.query(consulta,function(err, rows8, fields){
                                                if(err){
                                                    console.log(err);
                                                    htmlerror(err); 					return res.status(400).json({ error: err });
                                                }else{
                                                    if(rows8.length != 0){
                                                        console.log("Devuelvo el id de la localidad");
                                                        console.log(rows8);
                                                        data["Comunidad"] = com;
                                                        data["Provincia"] = prov;
                                                        data["Localidad"] = rows8.insertId;
                                                        return res.status(200).json(data);
                                                    }else{
                                                        console.log("Error al insertar la localidad...");
                                                        data["Localidad"] = 'Localidad no insertada';
                                                        htmlerror(err); 					return res.status(400).json(data);
                                                    }
                                                }
                                            });
                                        }else{
                                            console.log("Error al insertar la provinvia...");
                                            data["Provincia"] = 'Provincia no insertada';
                                            htmlerror(err); 					return res.status(400).json(data);
                                        }
                                    }
                                });
                            }else{
                                console.log("Error al insertar la comunidad...");
                                data["Comunidad"] = 'Comunidad no insertada';
                                htmlerror(err); 					return res.status(400).json(data);
                            }
                        }
                    });
				}
			}
		});
	connection.release();
	});
});
// var consulta = "INSERT INTO usuario (";
		// var i=0;
		// if(Nombre != 'NULL'){
		// 	if (i==1) {
		// 		consulta  += ", ";
		// 		i--;	
		// 	}
		// 	consulta  += "Nombre_usuario";
		// 	i++;
		// }
		// console.log("CONSULTA 1 es"+consulta);
		// consulta=consulta+") VALUES (";
		// var i=0;
		// if(Nombre != 'NULL'){
		// 	if (i==1) {
		// 		consulta  += " , ";
		// 		i--;	
		// 	}
		// 	consulta  += Nombre;
		// 	i++;
		// }
		// consulta+=")";
		// console.log(consulta);
module.exports = router;