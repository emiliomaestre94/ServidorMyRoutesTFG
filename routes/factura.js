var express = require('express');
var router = express.Router();
var db = require('../helpers/database')();
var comprobacionjwt= require ('../helpers/comprobacionjwt');
var htmlerror= require ('../emails/htmlerror');
var nodemailer = require('nodemailer');
const nodemailerDkim = require('nodemailer-dkim');

//Get facturas(muestra todas las facturas)
router.get('/',comprobacionjwt,function(req,res){
	db.getConnection(function(err, connection) {
        if (err) throw err;
   		var data = {
			"Factura":"",
			"Lineas":"",
			"Registros":""
		};
		var id = connection.escape(req.query.id); //Variable que recoje el id de la factura de la URI factura?id={num}
		var Id_tienda = connection.escape(req.query.id_tienda); //Variable que recoje el nombre de la tienda de la que quiere mostrar las facturas de la URI factura?nombretienda={num}
		var MinTotal = connection.escape(req.query.mintotal); //Variable que recoje el  minimo del total de la factura de la URI factura?total={num}
		var MaxTotal = connection.escape(req.query.maxtotal); //Variable que recoje el maximo del total de la factura de la URI factura?total={num}
		var FechaIni = connection.escape(req.query.fechaini); //Variable que recoje el inicio del periodo de la factura que se quiere mostrar de la URI factura?total={num}
		var FechaFin = connection.escape(req.query.fechafin); //Variable que recoje el fin del periodo de la factura que se quiere mostrar de la URI factura?total={num}
		var OrdeFecha = connection.escape(req.query.ordefecha);//Variable que indica sobre que parametro ordenar las facturas en la URI factura?ordefecha=true
		var OrdeTotal = connection.escape(req.query.ordetotal); //Variable que indica sobre que parametro ordenar las facturas en la URI factura?ordetotal=true
		var Pagina = connection.escape(req.query.pagina); //Variable que indica que pagina de facturas estamos que se mostraran de x en Y
		var Registros = connection.escape(req.query.registros);
		if(id != 'NULL'){ //Si en la URI existe se crea la consulta de busqueda por id y se muestran todos los detalles de la factura
			var infoTienda = "SELECT * FROM factura JOIN factura_usuario ON Id_factura=Id_factura_factura_usuario JOIN usuario_tienda ON Id_usuario_tienda=Id_usuario_tienda_factura_usuario JOIN usuario ON Id_usuario= Id_usuario_usuario_tienda JOIN tienda ON Id_tienda = Id_tienda_factura WHERE Id_factura ="+id;
			var consulta="SELECT * FROM linea_factura JOIN producto_tienda ON Id_producto_tienda = Id_producto_tienda_linea_factura JOIN producto ON Id_producto_producto_tienda=Id_producto WHERE Id_factura_linea_factura="+id;
			var preconsulta = consulta+";";
			console.log("preconsulta:");
			console.log(preconsulta);
			console.log("infoTienda:");
			console.log(infoTienda);
			if(Pagina!='NULL'){
				if (Registros != 'NULL') {
					var nregis =parseInt(Registros.replace(/'/g, ""));
				}else{
					var nregis = 10;
				}
				var pags=parseInt(Pagina.replace(/'/g, ""))*nregis;
				console.log("Voy a mostrar solo las "+nregis+" siguientes filas empezando en la: "+pags);
				consulta += " LIMIT "+nregis+" OFFSET "+pags;
			}
			consulta +=";";
			console.log("consulta:");
			console.log(consulta);
			//Consulta multiple
			connection.query(preconsulta+consulta+infoTienda, function(err, rows, fields){
				if(err){
					console.log("Error en la query...");
					htmlerror(err);
					return res.status(400).json({ error: err });
				}else{
					console.log("Query OK");
					if(rows[2].length != 0){
						console.log("Devuelvo las facturas");
						data["Registros"]=rows[0].length;
						data["Factura"] = rows[2];
						data["Lineas"] = rows[1];
						return res.status(200).json(data);
					}else{
						data["Factura"] = 'No hay facturas';
						console.log("No hay facturas...");
						return res.status(204).json(data);	
					}
				}
			});
		}else{ //Si no muestra todas las facturas
			var consulta = "SELECT * FROM factura JOIN factura_usuario ON Id_factura=Id_factura_factura_usuario JOIN usuario_tienda ON Id_usuario_tienda=Id_usuario_tienda_factura_usuario JOIN usuario ON Id_usuario= Id_usuario_usuario_tienda JOIN tienda ON Id_tienda = Id_tienda_factura";
			var i=0;
			if(MinTotal != 'NULL' || MaxTotal != 'NULL' || FechaIni != 'NULL' ||FechaFin != 'NULL' || Id_tienda != 'NULL'){
				consulta += " WHERE ";
				if(MaxTotal != 'NULL'){
					if (i==1) { 
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Total_factura<="+MaxTotal;
					i++;
				}
				if(MinTotal != 'NULL'){
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Total_factura>="+MinTotal;
					i++;
				}
				if(FechaIni != 'NULL'){
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Fecha_factura>="+FechaIni;
					i++;
				}
				if(FechaFin != 'NULL'){
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Fecha_factura<="+FechaFin;
					i++;
				}
				if(Id_tienda != 'NULL'){
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Id_tienda_factura ="+Id_tienda;
					i++;
				}
			}
			if(OrdeFecha != 'NULL' || OrdeTotal != 'NULL'){
				var orden =0;
				consulta  += " ORDER BY ";
				if(OrdeFecha != 'NULL'){
					if(orden!=0){
						consulta  += " , ";
						orden=orden-1;
					}
					orden=orden+1;
					if (OrdeFecha=="'1'") {
						consulta  += "Fecha_factura ASC";
					}
					if (OrdeFecha=="'0'") {
						consulta  += "Fecha_factura DESC";	
					}
				}
				if(OrdeTotal != 'NULL'){
					if(orden!=0){
						consulta  += " , ";
						orden=orden-1;
					}
					orden=orden+1;
					if (OrdeTotal=="'1'") {
						consulta  += "Fecha_factura ASC";
					}
					if (OrdeTotal=="'0'") {
						consulta  += "Fecha_factura DESC";	
					}
				}
			}
			consulta+="AND Eliminado_factura='0'";
			var preconsulta=consulta+";";
			console.log("preconsulta:");
			console.log(preconsulta);
			if(Pagina!='NULL'){
				if (Registros != 'NULL') {
					var nregis =parseInt(Registros.replace(/'/g, ""));
				}else{
					var nregis = 10;
				}
				var pags=parseInt(Pagina.replace(/'/g, ""))*nregis;
				console.log("Voy a mostrar solo las "+nregis+" siguientes filas empezando en la: "+pags);
				consulta += " LIMIT "+nregis+" OFFSET "+pags;
			}
			console.log("Consulta:");
			console.log(consulta);
			var data = {
				"Facturas":"",
				"Registros":""
			};
			connection.query(preconsulta+consulta, function(err, rows, fields){
				if(err){
					console.log("Error en la query...");
					htmlerror(err);
					return res.status(400).json({ error: err });
				}else{
					console.log("Query OK");
					if(rows[1].length != 0){
						console.log("Devuelvo las facturas");
						data["Registros"] = rows[0].length;
						data["Facturas"] = rows[1];
						return res.status(200).json(data);
					}else{
						data["Facturas"] = 'No hay facturas';
						console.log("No hay facturas...");
						return res.status(204).json(data);	
					}
				}
			});
		}     
    	connection.release();
	});
});

//Get facturas Debug (muestra todas las facturas)
router.get('/debug',comprobacionjwt,function(req,res){
	db.getConnection(function(err, connection) {
        if (err) throw err;
   		var data = {
			"Factura":"",
			"Lineas":"",
			"Registros":""
		};
		var id = connection.escape(req.query.id); //Variable que recoje el id de la factura de la URI factura?id={num}
		var Id_tienda = connection.escape(req.query.id_tienda); //Variable que recoje el nombre de la tienda de la que quiere mostrar las facturas de la URI factura?nombretienda={num}
		var MinTotal = connection.escape(req.query.mintotal); //Variable que recoje el  minimo del total de la factura de la URI factura?total={num}
		var MaxTotal = connection.escape(req.query.maxtotal); //Variable que recoje el maximo del total de la factura de la URI factura?total={num}
		var FechaIni = connection.escape(req.query.fechaini); //Variable que recoje el inicio del periodo de la factura que se quiere mostrar de la URI factura?total={num}
		var FechaFin = connection.escape(req.query.fechafin); //Variable que recoje el fin del periodo de la factura que se quiere mostrar de la URI factura?total={num}
		var OrdeFecha = connection.escape(req.query.ordefecha);//Variable que indica sobre que parametro ordenar las facturas en la URI factura?ordefecha=true
		var OrdeTotal = connection.escape(req.query.ordetotal); //Variable que indica sobre que parametro ordenar las facturas en la URI factura?ordetotal=true
		var Pagina = connection.escape(req.query.pagina); //Variable que indica que pagina de facturas estamos que se mostraran de x en Y
		var Registros = connection.escape(req.query.registros);
		if(id != 'NULL'){ //Si en la URI existe se crea la consulta de busqueda por id y se muestran todos los detalles de la factura
			var infoTienda = "SELECT * FROM factura JOIN factura_usuario ON Id_factura=Id_factura_factura_usuario JOIN usuario_tienda ON Id_usuario_tienda=Id_usuario_tienda_factura_usuario JOIN usuario ON Id_usuario= Id_usuario_usuario_tienda JOIN tienda ON Id_tienda = Id_tienda_factura WHERE Id_factura ="+id;
			var consulta="SELECT * FROM linea_factura JOIN producto_tienda ON Id_producto_tienda = Id_producto_tienda_linea_factura JOIN producto ON Id_producto_producto_tienda=Id_producto WHERE Id_factura_linea_factura="+id;
			var preconsulta = consulta+";";
			console.log("preconsulta:");
			console.log(preconsulta);
			console.log("infoTienda:");
			console.log(infoTienda);
			if(Pagina!='NULL'){
				if (Registros != 'NULL') {
					var nregis =parseInt(Registros.replace(/'/g, ""));
				}else{
					var nregis = 10;
				}
				var pags=parseInt(Pagina.replace(/'/g, ""))*nregis;
				console.log("Voy a mostrar solo las "+nregis+" siguientes filas empezando en la: "+pags);
				consulta += " LIMIT "+nregis+" OFFSET "+pags;
			}
			consulta +=";";
			console.log("consulta:");
			console.log(consulta);
			//Consulta multiple
			connection.query(preconsulta+consulta+infoTienda, function(err, rows, fields){
				if(err){
					console.log("Error en la query...");
					htmlerror(err);
					return res.status(400).json({ error: err });
				}else{
					console.log("Query OK");
					if(rows[2].length != 0){
						console.log("Devuelvo las facturas");
						data["Registros"]=rows[0].length;
						data["Factura"] = rows[2];
						data["Lineas"] = rows[1];
						return res.status(200).json(data);
					}else{
						data["Factura"] = 'No hay facturas';
						console.log("No hay facturas...");
						return res.status(204).json(data);	
					}
				}
			});
		}else{ //Si no muestra todas las facturas
			var consulta = "SELECT * FROM factura JOIN factura_usuario ON Id_factura=Id_factura_factura_usuario JOIN usuario_tienda ON Id_usuario_tienda=Id_usuario_tienda_factura_usuario JOIN usuario ON Id_usuario= Id_usuario_usuario_tienda JOIN tienda ON Id_tienda = Id_tienda_factura";
			var i=0;
			if(MinTotal != 'NULL' || MaxTotal != 'NULL' || FechaIni != 'NULL' ||FechaFin != 'NULL' || Id_tienda != 'NULL'){
				consulta += " WHERE ";
				if(MaxTotal != 'NULL'){
					if (i==1) { 
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Total_factura<="+MaxTotal;
					i++;
				}
				if(MinTotal != 'NULL'){
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Total_factura>="+MinTotal;
					i++;
				}
				if(FechaIni != 'NULL'){
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Fecha_factura>="+FechaIni;
					i++;
				}
				if(FechaFin != 'NULL'){
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Fecha_factura<="+FechaFin;
					i++;
				}
				if(Id_tienda != 'NULL'){
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Id_tienda_factura ="+Id_tienda;
					i++;
				}
			}
			if(OrdeFecha != 'NULL' || OrdeTotal != 'NULL'){
				var orden =0;
				consulta  += " ORDER BY ";
				if(OrdeFecha != 'NULL'){
					if(orden!=0){
						consulta  += " , ";
						orden=orden-1;
					}
					orden=orden+1;
					if (OrdeFecha=="'1'") {
						consulta  += "Fecha_factura ASC";
					}
					if (OrdeFecha=="'0'") {
						consulta  += "Fecha_factura DESC";	
					}
				}
				if(OrdeTotal != 'NULL'){
					if(orden!=0){
						consulta  += " , ";
						orden=orden-1;
					}
					orden=orden+1;
					if (OrdeTotal=="'1'") {
						consulta  += "Fecha_factura ASC";
					}
					if (OrdeTotal=="'0'") {
						consulta  += "Fecha_factura DESC";	
					}
				}
			}
			var preconsulta=consulta+";";
			console.log("preconsulta:");
			console.log(preconsulta);
			if(Pagina!='NULL'){
				if (Registros != 'NULL') {
					var nregis =parseInt(Registros.replace(/'/g, ""));
				}else{
					var nregis = 10;
				}
				var pags=parseInt(Pagina.replace(/'/g, ""))*nregis;
				console.log("Voy a mostrar solo las "+nregis+" siguientes filas empezando en la: "+pags);
				consulta += " LIMIT "+nregis+" OFFSET "+pags;
			}
			console.log("Consulta:");
			console.log(consulta);
			var data = {
				"Facturas":"",
				"Registros":""
			};
			connection.query(preconsulta+consulta, function(err, rows, fields){
				if(err){
					console.log("Error en la query...");
					htmlerror(err);
					return res.status(400).json({ error: err });
				}else{
					console.log("Query OK");
					if(rows[1].length != 0){
						console.log("Devuelvo las facturas");
						data["Registros"] = rows[0].length;
						data["Facturas"] = rows[1];
						return res.status(200).json(data);
					}else{
						data["Facturas"] = 'No hay facturas';
						console.log("No hay facturas...");
						return res.status(204).json(data);	
					}
				}
			});
		}     
    	connection.release();
	});
});


//Funcion GET de facturas (Muestra las facturas de un usuario)
router.get('/usuario',comprobacionjwt,function(req,res){
	db.getConnection(function(err, connection) {
        if (err) throw err;
   		var data = {
			"Factura":"",
			"Registros":""
		};
	 	var Id = connection.escape(req.query.id);
		var Nombretienda = connection.escape(req.query.nombretienda); //Variable que recoje el nombre de la tienda de la que quiere mostrar las facturas de la URI factura?nombretienda={num}
		var MinTotal = connection.escape(req.query.mintotal); //Variable que recoje el  minimo del total de la factura de la URI factura?total={num}
		var MaxTotal = connection.escape(req.query.maxtotal); //Variable que recoje el maximo del total de la factura de la URI factura?total={num}
		var FechaIni = connection.escape(req.query.fechaini); //Variable que recoje el inicio del periodo de la factura que se quiere mostrar de la URI factura?total={num}
		var FechaFin = connection.escape(req.query.fechafin); //Variable que recoje el fin del periodo de la factura que se quiere mostrar de la URI factura?total={num}
		var OrdeNombre = connection.escape(req.query.ordenombre); //Variable que indica sobre que parametro ordenar las facturas en la URI factura?ordenombre=true
		var OrdeFecha = connection.escape(req.query.ordefecha);//Variable que indica sobre que parametro ordenar las facturas en la URI factura?ordefecha=true
		var OrdeTotal = connection.escape(req.query.ordetotal); //Variable que indica sobre que parametro ordenar las facturas en la URI factura?ordetotal=true
		var Pagina = connection.escape(req.query.pagina); //Variable que indica que pagina de facturas estamos que se mostraran de 10 en 10
		var Id_tienda = connection.escape(req.query.id_tienda); //Variable que recoje el nombre de la tienda de la que quiere mostrar las facturas de la URI factura?nombretienda={num}
		var Registros = connection.escape(req.query.registros);
		var consulta="SELECT * FROM factura JOIN factura_usuario ON Id_factura = Id_factura_factura_usuario JOIN usuario_tienda ON Id_usuario_tienda = Id_usuario_tienda_factura_usuario JOIN usuario ON Id_usuario_usuario_tienda = Id_usuario JOIN tienda ON Id_tienda_usuario_tienda = Id_tienda WHERE Id_usuario = "+Id;
		var i=1;
		if(MinTotal != 'NULL' || MaxTotal != 'NULL' || FechaIni != 'NULL' ||FechaFin != 'NULL' || Nombretienda != 'NULL' || Id_tienda != 'NULL' ){
			if(MaxTotal != 'NULL'){
				if (i==1) {
					consulta  += " AND ";
					i--;	
				}
				consulta  += "Total_factura<="+MaxTotal;
				i++;
			}
			if(MinTotal != 'NULL'){
				if (i==1) {
					consulta  += " AND ";
					i--;	
				}
				consulta  += "Total_factura>="+MinTotal;
				i++;
			}
			if(FechaIni != 'NULL'){
				if (i==1) {
					consulta  += " AND ";
					i--;	
				}
				consulta  += "Fecha_factura>="+FechaIni;
				i++;
			}
			if(FechaFin != 'NULL'){
				if (i==1) {
					consulta  += " AND ";
					i--;	
				}
				consulta  += "Fecha_factura<="+FechaFin;
				i++;
			}
			if(Nombretienda != 'NULL'){
				if (i==1) {
					consulta  += " AND ";
					i--;	
				}
				consulta  += "Nombre_tienda LIKE '%"+Nombretienda.replace(/'/g, "")+"%'";
				i++;
			}
			if(Id_tienda != 'NULL'){
				if (i==1) {
					consulta  += " AND ";
					i--;	
				}
				consulta  += "Id_tienda="+Id_tienda;
				i++;
			}
			
		}
		if(OrdeFecha != 'NULL' || OrdeTotal != 'NULL' || OrdeNombre != 'NULL'){
			var orden =0;
			consulta  += " ORDER BY ";
			if(OrdeFecha != 'NULL'){
				if(orden!=0){
					consulta  += " , ";
					orden=orden-1;
				}
				orden=orden+1;
				if (OrdeFecha=="'1'") {
					consulta  += "Fecha_factura ASC";
				}
				if (OrdeFecha=="'0'") {
					consulta  += "Fecha_factura DESC";	
				}
			}
			if(OrdeTotal != 'NULL'){
				if(orden!=0){
					consulta  += " , ";
					orden=orden-1;
				}
				orden=orden+1;
				if (OrdeTotal=="'1'") {
					consulta  += "Total_factura ASC";
				}
				if (OrdeTotal=="'0'") {
					consulta  += "Total_factura DESC";	
				}
			}
			if(OrdeNombre != 'NULL'){
				if(orden!=0){
					consulta  += " , ";
					orden=orden-1;
				}
				orden=orden+1;
				if (OrdeNombre=="'1'") {
					consulta  += "  Nombre_tienda ASC";
				}
				if (OrdeNombre=="'0'") {
					consulta  += "  Nombre_tienda DESC";	
				}
			}
		}
		var preconsulta = consulta+";";
		console.log("Preconsulta:");
		console.log(preconsulta);
		if(Pagina!='NULL'){
			if (Registros != 'NULL') {
				var nregis =parseInt(Registros.replace(/'/g, ""));
			}else{
				var nregis = 10;
			}
			var pags=parseInt(Pagina.replace(/'/g, ""))*nregis;
			console.log("Voy a mostrar solo las "+nregis+" siguientes filas empezando en la: "+pags);
			consulta += " LIMIT "+nregis+" OFFSET "+pags;
		}		
		console.log("Consulta:");
		console.log(consulta);
		connection.query(preconsulta+consulta,function(err, rows, fields){
			if(err){
				console.log(err);
				htmlerror(err);
				return res.status(400).json({ error: err });
			}else{
				if(rows[1].length != 0){
					data["Registros"] = rows[0].length;
					data["Factura"] = rows[1];
					return res.status(200).json(data);
				}else{
					console.log('No hay facturas');
					data["Factura"] = 'No hay facturas';
					return res.status(204).json(data);
				}
			}
		});	
    	connection.release();
	});
});

//Funcion que genera el POST de Facturas
router.post('/',comprobacionjwt,function(req,res){
	db.getConnection(function(err, connection) {
        if (err) throw err;
 		var Id_tienda = connection.escape(req.body.id_tienda);
		var Fecha_factura = connection.escape(req.body.fecha);
		var Total_factura = connection.escape(req.body.total);
		var Pagada = connection.escape(req.body.pagada);
		var Id_usuario_tienda = connection.escape(req.body.id_usuario_tienda);
		var Linea = req.body.linea;
		var data = {
			"Facturas":""
		};
		var consulta = "INSERT INTO factura (";
		var i=0;
		if(Id_tienda != 'NULL'){
			consulta  += "Id_tienda_factura";
			i++;
		}
		if(Fecha_factura != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Fecha_factura";
			i++;
		}
		if(Total_factura != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Total_factura";
			i++;
		}
		if(Pagada != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Pagada";
			i++;
		}
		
		consulta=consulta+", Estado_factura , Eliminado_factura) VALUES (";
		var i=0;
		if(Id_tienda != 'NULL'){
			consulta  += Id_tienda;
			i++;
		}
		if(Fecha_factura != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += Fecha_factura;
			i++;
		}
		if(Total_factura != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += Total_factura;
			i++;
		}
		if(Pagada != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += Pagada;
			i++;
		}
		consulta+=",'1','0');UPDATE tienda SET Numero_facturas_tienda=Numero_facturas_tienda+1, Numero_facturas_hora_tienda=Numero_facturas_hora_tienda+1, Numero_facturas_dia_tienda=Numero_facturas_dia_tienda+1, Numero_facturas_semana_tienda=Numero_facturas_semana_tienda+1, Numero_facturas_mes_tienda=Numero_facturas_mes_tienda+1, Total_ventas_tienda=Total_ventas_tienda+"+Total_factura+", Total_ventas_hora_tienda=Total_ventas_hora_tienda+"+Total_factura+", Total_ventas_dia_tienda=Total_ventas_dia_tienda+"+Total_factura+", Total_ventas_semana_tienda=Total_ventas_semana_tienda+"+Total_factura+", Total_ventas_mes_tienda=Total_ventas_mes_tienda+"+Total_factura+" WHERE Id_tienda="+Id_tienda+";";
		console.log(consulta);
		connection.query(consulta,function(err, rows, fields){
			if(err){
				console.log(err);
				htmlerror(err);
				return res.status(400).json({ error: err });
			}else{
				console.log(Linea);
				if (Linea!= undefined) {
					var consulta2="INSERT INTO factura_usuario (Id_factura_factura_usuario, Id_usuario_tienda_factura_usuario) VALUES ("+rows[0].insertId+", "+Id_usuario_tienda+");";
					for (var index = 0; index < Linea.length; index++) {
						consulta2 += "INSERT INTO linea_factura (Id_factura_linea_factura, Cantidad_linea_factura, Id_producto_tienda_linea_factura, Id_oferta_usuario_linea_factura, Id_oferta_producto_linea_factura, Total_linea_factura, Estado_linea_factura, Eliminado_linea_factura) VALUES('"+rows[0].insertId+"' , '"+Linea[index].Cantidad_linea_factura+"' , '"+Linea[index].Id_producto_tienda_linea_factura+"' , "+Linea[index].Id_oferta_usuario_linea_factura+" , "+Linea[index].Id_oferta_producto_linea_factura+" , '"+Linea[index].Total_linea_factura+"' , '"+Linea[index].Estado_linea_factura+"' , '"+Linea[index].Eliminado_linea_factura+"');";
					}
					console.log(consulta2);
					connection.query(consulta2,function(err, rows2, fields){
						if(err){
							console.log(err);
							htmlerror(err);
							return res.status(400).json({ error: err });
						}else{
							data["Facturas"] = "Datos de factura y lineas insertados correctamente!";
							return res.status(200).json(data);
						}
					});
				} else {
					data["Facturas"] = "Datos de factura insertados correctamente!";
					return res.status(200).json(data);
				}
			}
		});  		
    connection.release();
	});
});

//Funcion que genera el PUT (Update) de Facturas
router.put('/',comprobacionjwt,function(req,res){
	db.getConnection(function(err, connection) {
        if (err) throw err;
 		var ID =connection.escape(req.body.id_factura);  
		var Id_tienda = connection.escape(req.body.id_tienda);
		var Fecha_factura = connection.escape(req.body.fecha);
		var Total = connection.escape(req.body.total);
		var Pagada = connection.escape(req.body.pagada);
		var data = {
			"Facturas":""
		};
		if(ID != 'NULL'){
			var consulta = "UPDATE factura SET ";
			var i=0;
			if(Id_tienda != 'NULL'){
				consulta  += "Id_tienda="+Id_tienda;
				i++;
			}
			if(Fecha_factura != 'NULL'){
				if (i==1) {
					consulta  += ", ";
					i--;	
				}
				consulta  += "Fecha_factura="+Fecha_factura;
				i++;
			}
			if(Total != 'NULL'){
				if (i==1) {
					consulta  += ", ";
					i--;	
				}
				consulta  += "Total_factura="+Total;
				i++;
			}
			if(Pagada != 'NULL'){
				if (i==1) {
					consulta  += ", ";
					i--;	
				}
				consulta  += "Pagada="+Pagada;
				i++;
			}
			consulta = consulta + " WHERE Id_factura="+ID;
		}
		console.log(consulta);
		connection.query(consulta,function(err, rows, fields){
			if(err){
				console.log(err);
				htmlerror(err);
				return res.status(400).json({ error: err });
			}else{
				data["Facturas"] = "Actualizado correctamente!";
				return res.status(200).json(data);
			}
		});  		
    connection.release();
	});
});

//Borra un array de facturas de Usuario
router.put('/deleteFacturas',comprobacionjwt,function(req,res){
	//UPDATE `oferta_usuario` SET `Eliminado_oferta_usuario` = '1' WHERE `Id_oferta_usuario` = 1
	db.getConnection(function(err, connection) {
		if (err) throw err;	
		var facturas = req.body.facturas;
		console.log("Entra en el put de deleteFacturasUsuario");
	error=false;
	for(var i=0;i<facturas.length;i++){
			var consulta = "UPDATE factura SET Eliminado_factura = '1' WHERE Id_factura="+facturas[i];
			console.log(consulta);
			connection.query(consulta,function(err, rows, fields){
				if(err){
					error=true;
					//htmlerror(err);return res.status(400).json({ error: err });
					i=facturas.length;
				}
			});	
		}
		connection.release();
		if(error==false)
			return res.status(200).json("Actualizado correctamente");
		else
			htmlerror(err);
			return res.status(400).json("Error en la peticion a la BD");	
	});
});
module.exports = router;