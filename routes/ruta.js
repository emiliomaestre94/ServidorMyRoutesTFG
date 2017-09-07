var express = require('express');
var router = express.Router();
var db = require('../helpers/database')();
var comprobacionjwt= require ('../helpers/comprobacionjwt');


//Rutas de un usuario ()
router.get('/',comprobacionjwt,function(req,res){	
	db.getConnection(function(err, connection) {
		if (err) throw err;
		var data = {
			"Rutas":"",
		};
		var Id = connection.escape(req.query.id); //Variable que recoje el id de los Rutas de la URI Rutas?Id={num}
		var Id_usuario = connection.escape(req.query.id_usuario); //Variable que indica que pagina de facturas estamos que se mostraran de 10 en 10
		var consulta="SELECT * FROM ruta where Id_usuario_ruta="+Id+";";

		connection.query(consulta,function(err, rows, fields){
			if(err){
				console.log(err);
				htmlerror(err); 					
                return res.status(400).json({ error: err });
			}else{
				if(rows[0]){
					console.log("Devuelvo las rutas");
					data["Rutas"] = rows;
					return res.status(200).json(data);;	
				}else{
					console.log("no hay rutas");
					data["Rutas"] = 'No hay rutas';
					return res.status(204).json(data);
				}
			}
		});
	connection.release();
	});
});


//Creamos ruta con sus cosillas
router.post('/',function(req,res){
	db.getConnection(function(err, connection) {
		if (err) throw err;

		var Lugar_ruta = connection.escape(req.body.lugar);
		var Distancia_recorrida_ruta = connection.escape(req.body.distancia);
		var Finalizada_ruta = connection.escape(req.body.finalizada);
		var Id_usuario_ruta = connection.escape(req.body.idusu);
		var Tipo_ruta = connection.escape(req.body.tipo);
		console.log(Tipo_ruta);
		var data = {
			"Rutas":""
		};
		var consulta = "INSERT INTO ruta (";
		var i=0;

		if(Lugar_ruta != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Lugar_ruta";
			i++;
		}
		if(Distancia_recorrida_ruta != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Distancia_recorrida_ruta";
			i++;
		}

		if(Finalizada_ruta != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Finalizada_ruta";
			i++;
		}
		if(Id_usuario_ruta != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Id_usuario_ruta";
			i++;
		}

		consulta=consulta+") VALUES (";
		var i=0;

		if(Lugar_ruta != 'NULL'){
			if (i==1) {
				consulta  += " , ";
				i--;	
			}
			consulta  += Lugar_ruta;
			i++;
		}
		if(Distancia_recorrida_ruta != 'NULL'){
			if (i==1) {
				consulta  += " , ";
				i--;	
			}
			consulta  += Distancia_recorrida_ruta;
			i++;
		}

		if(Finalizada_ruta != 'NULL'){
			if (i==1) {
				consulta  += " , ";
				i--;	
			}
			consulta  += Finalizada_ruta;
			i++;
		}
		if(Id_usuario_ruta != 'NULL'){
			if (i==1) {
				consulta  += " , ";
				i--;	
			}
			consulta  += Id_usuario_ruta;
			i++;
		}

		consulta+=");";


		console.log(consulta);
		connection.query(consulta,function(err, rows, fields){
			if(err){
				console.log(err);
				htmlerror(err); //					
				return res.status(400).json({ error: err });
			}else{ //Todo bien, creamos los lugares
				var consulta2;
				var idRuta=rows.insertId;
				if(req.body.tipo=="Panoramicas"){
					consulta2 = "INSERT INTO lugares_ruta (Id_lugar_lugares_ruta, Id_ruta_lugares_ruta) VALUES ('2' ,"+rows.insertId+");";
					consulta2 += "INSERT INTO lugares_ruta (Id_lugar_lugares_ruta, Id_ruta_lugares_ruta) VALUES ('3' ,"+rows.insertId+");";
					consulta2 += "INSERT INTO lugares_ruta (Id_lugar_lugares_ruta, Id_ruta_lugares_ruta) VALUES ('4' ,"+rows.insertId+");";
					consulta2 += "INSERT INTO lugares_ruta (Id_lugar_lugares_ruta, Id_ruta_lugares_ruta) VALUES ('6' ,"+rows.insertId+");";
				}
				else if(req.body.tipo=="Naturaleza"){
					consulta2 = "INSERT INTO lugares_ruta (Id_lugar_lugares_ruta, Id_ruta_lugares_ruta) VALUES ('2' ,"+rows.insertId+");";
					consulta2 += "INSERT INTO lugares_ruta (Id_lugar_lugares_ruta, Id_ruta_lugares_ruta) VALUES ('3' ,"+rows.insertId+");";
					consulta2 += "INSERT INTO lugares_ruta (Id_lugar_lugares_ruta, Id_ruta_lugares_ruta) VALUES ('4' ,"+rows.insertId+");";
				}

				else if(req.body.tipo=="Cultura"){
					consulta2 = "INSERT INTO lugares_ruta (Id_lugar_lugares_ruta, Id_ruta_lugares_ruta) VALUES ('6',"+rows.insertId+");";
					consulta2 += "INSERT INTO lugares_ruta (Id_lugar_lugares_ruta, Id_ruta_lugares_ruta) VALUES ('7',"+rows.insertId+");";
					consulta2 += "INSERT INTO lugares_ruta (Id_lugar_lugares_ruta, Id_ruta_lugares_ruta) VALUES ('8',"+rows.insertId+");";
					consulta2 += "INSERT INTO lugares_ruta (Id_lugar_lugares_ruta, Id_ruta_lugares_ruta) VALUES ('9',"+rows.insertId+");";
				} 
				console.log(consulta2);

				console.log("Consulta2 es" +consulta2);
				connection.query(consulta2,function(err, rows2, fields){
					if(err){
						console.log(err);
						htmlerror(err);
						return res.status(400).json({ error: err });
					}else{
						data["Rutas"] = "Datos de rutas creados correctamente!";
						console.log("IdRuta es" + idRuta);
						return res.status(200).json({data: data,idRuta: idRuta});
					}
				});
			}
		});
	connection.release();
	});
});



//Rutas de un usuario
router.get('/',comprobacionjwt,function(req,res){	
	db.getConnection(function(err, connection) {
		if (err) throw err;
		var data = {
			"Rutas":"",
		};
		var Id = connection.escape(req.query.id); //Variable que recoje el id de los Rutas de la URI Rutas?Id={num}
		var Id_usuario = connection.escape(req.query.id_usuario); //Variable que indica que pagina de facturas estamos que se mostraran de 10 en 10
		var consulta="SELECT * FROM ruta where Id_usuario_ruta="+Id+";";

		connection.query(consulta,function(err, rows, fields){
			if(err){
				console.log(err);
				htmlerror(err); 					
                return res.status(400).json({ error: err });
			}else{
				if(rows[0]){
					console.log("Devuelvo las rutas");
					data["Rutas"] = rows;
					return res.status(200).json(data);;	
				}else{
					console.log("no hay rutas");
					data["Rutas"] = 'No hay rutas';
					return res.status(204).json(data);
				}
			}
		});
	connection.release();
	});
});

//Lugares de una Ruta
router.get('/detalle',comprobacionjwt,function(req,res){	
	db.getConnection(function(err, connection) {
		if (err) throw err;
		var data = {
			"Rutas":"",
		};
		var Id = connection.escape(req.query.id); //Variable que recoje el id de los Rutas de la URI Rutas?Id={num}
		var consulta="SELECT * FROM lugar INNER JOIN lugares_ruta ON lugares_ruta.Id_lugar_lugares_ruta=lugar.Id_lugar AND lugares_ruta.Id_ruta_lugares_ruta="+Id+";";
		console.log("La consulta es "+consulta);
		connection.query(consulta,function(err, rows, fields){
			if(err){
				console.log(err);
				htmlerror(err); 					
                return res.status(400).json({ error: err });
			}else{
				if(rows[0]){
					console.log("Devuelvo las rutas");
					data["Rutas"] = rows;
					return res.status(200).json(data);;	
				}else{
					console.log("no hay rutas");
					data["Rutas"] = 'No hay rutas';
					return res.status(204).json(data);
				}
			}
		});
	connection.release();
	});
});


//Detalles de un lugar 
router.get('/lugardetalle',comprobacionjwt,function(req,res){	
	db.getConnection(function(err, connection) {
		if (err) throw err;
		var data = {
			"Rutas":"",
		};
		var Id = connection.escape(req.query.id); //Variable que recoje el id de los Rutas de la URI Rutas?Id={num}
		var consulta="SELECT * FROM lugar WHERE Id_lugar="+Id+";";
		console.log("La consulta es "+consulta);
		connection.query(consulta,function(err, rows, fields){
			if(err){
				console.log(err);
				htmlerror(err); 					
                return res.status(400).json({ error: err });
			}else{
				if(rows[0]){
					console.log("Devuelvo las rutas");
					data["Rutas"] = rows;
					return res.status(200).json(data);;	
				}else{
					console.log("no hay rutas");
					data["Rutas"] = 'No hay rutas';
					return res.status(204).json(data);
				}
			}
		});
	connection.release();
	});
});


module.exports = router; 