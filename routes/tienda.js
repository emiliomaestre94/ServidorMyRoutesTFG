var express = require('express');
var router = express.Router();
var db = require('../helpers/database')();
var comprobacionjwt= require ('../helpers/comprobacionjwt');
var htmlerror= require ('../emails/htmlerror');
var nodemailer = require('nodemailer');
const nodemailerDkim = require('nodemailer-dkim');
//GET de tiendas
router.get('/',comprobacionjwt,function(req,res){
	db.getConnection(function(err, connection) {
        if (err) throw err;
		var data = {
			"Tiendas":"",
			"Registros":""
		};
		var id = connection.escape(req.query.id); //Variable que recoje el id de la tienda de la URI tienda?id={num}
		var Nombre = connection.escape(req.query.nombre);
		var Direccion = connection.escape(req.query.direccion);
		var Provincia = connection.escape(req.query.provincia);
		var Localidad = connection.escape(req.query.localidad);
		var Comunidad = connection.escape(req.query.comunidad);
		var Longitud = connection.escape(req.query.longitud);
		var Latitud = connection.escape(req.query.latitud);
		var Id_Gran_Superficie = connection.escape(req.query.id_gran_superficie);
		var CIF = connection.escape(req.query.cif);
		var CP = connection.escape(req.query.cp);
		var Estado = connection.escape(req.query.estado);
		var Copia = connection.escape(req.query.copia);
		var Eliminado = connection.escape(req.query.eliminado);
		var Foto = connection.escape(req.query.foto);
		var Telefono = connection.escape(req.query.telefono);
		var Descripcion = connection.escape(req.query.descripcion);
		var Horario = connection.escape(req.query.horario);
		var Facebook = connection.escape(req.query.facebook);
		var Twitter = connection.escape(req.query.twitter);
		var OrdeNombre = connection.escape(req.query.ordenombre); //Variable que indica sobre que parametro ordenar los usuario en la URI usuario?ordenombre={0 ó 1}
		var OrdeCP = connection.escape(req.query.ordeCP);//Variable que indica sobre que parametro ordenar las facturas en la URI usuario?ordefecha={0 ó 1}
		var OrdeId = connection.escape(req.query.ordeid);//Variable que indica sobre que parametro ordenar las facturas en la URI usuario?ordefechanac={0 ó 1}
		var OrdeCom = connection.escape(req.query.ordecom); //Variable que indica sobre que parametro ordenar las facturas en la URI usuario?ordecom={0 ó 1}
		var OrdeProv = connection.escape(req.query.ordeprov); //Variable que indica sobre que parametro ordenar las facturas en la URI usuario?ordeprov={0 ó 1}
		var OrdeLoc = connection.escape(req.query.ordeloc); //Variable que indica sobre que parametro ordenar las facturas en la URI usuario?ordeloc={0 ó 1}
		var Pagina = connection.escape(req.query.pagina); //Variable que indica que pagina de facturas estamos que se mostraran de 10 en 10
		var Registros = connection.escape(req.query.registros); //Variable que indica que pagina de facturas estamos que se mostraran de 10 en 10
        console.log(id);
		if(id != 'NULL'){ //Si en la URI existe se crea la consulta de busqueda por id
			var consulta="SELECT * FROM tienda WHERE Id_Tienda="+id;
		}else{ //Si no muestra todas las tiendas
			var consulta = "SELECT * FROM tienda";
			console.log("Entro para mostrar los datos de todos los tiendas");
			var i=0;
			if(Nombre != 'NULL' || CIF != 'NULL' || Latitud != 'NULL' || Longitud != 'NULL' || CP != 'NULL' || Estado != 'NULL' || Eliminado != 'NULL' || Comunidad != 'NULL' || Provincia != 'NULL' || Localidad != 'NULL' || Id_Gran_Superficie != 'NULL' ){
				console.log("Con el parametro:");
				consulta +=" WHERE ";
				if(Nombre != 'NULL'){
					console.log("Nombre:"+Nombre);
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Nombre_tienda LIKE '%"+Nombre.replace(/'/g, "")+"%'";
					i++;
				}
				if(CIF != 'NULL'){
					console.log("CIF:"+CIF);
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "CIF_tienda="+CIF;
					i++;
				}
				if(Latitud != 'NULL'){
					console.log("Latitud:"+Latitud);
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Latitud_tienda="+Latitud;
					i++;
				}
				if(Longitud != 'NULL'){
					console.log("Longitud:"+Longitud);
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Longitud_tienda="+Longitud;
					i++;
				}
				if(Estado != 'NULL'){
					console.log("Estado:"+Estado);
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Estado_tienda="+estado;
					i++;
				}
				if(Eliminado != 'NULL'){
					console.log("Eliminado:"+Eliminado);
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Eliminado_tienda="+Eliminado;
					i++;
				}
				if(Direccion != 'NULL'){
					console.log("Direccion:"+Direccion);
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Direccion_tienda LIKE '%"+Direccion.replace(/'/g, "")+"%'";
					i++;
				}
				if(Comunidad != 'NULL'){
					console.log("Comunidad:"+Comunidad);
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Comunidad_tienda="+Comunidad;
					i++;
				}
				if(Provincia != 'NULL'){
					console.log("Provincia:"+Provincia);
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Provincia_tienda="+Comunidad;
					i++;
				}
				if(Localidad != 'NULL'){
					console.log("Localidad:"+Localidad);
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Localidad_tienda="+Comunidad;
					i++;
				}
				if(Telefono != 'NULL'){
					console.log("Telefono:"+Telefono);
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Telefono_tienda="+Telefono;
					i++;
				}
				if(CP != 'NULL'){
					console.log("CP:"+CP);
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "CP_tienda="+CP;
					i++;
				}
				if(Id_Gran_Superficie != 'NULL'){
					console.log("Id_Gran_Superficie:"+Id_Gran_Superficie);
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Id_Gran_Superficie_tienda="+Id_Gran_Superficie;
					i++;
				}
			}
		}
		if(OrdeId != 'NULL' || OrdeCP != 'NULL' || OrdeNombre != 'NULL' || OrdeCom != 'NULL' || OrdeProv != 'NULL' || OrdeLoc != 'NULL'){
			var orden =0;
			consulta  += " ORDER BY ";
			if(OrdeCP != 'NULL'){
				if(orden!=0){
					consulta  += " , ";
					orden=orden-1;
				}
				orden=orden+1;
				if (OrdeCP=="'1'") {
					consulta  += "CP_tienda ASC";
				}
				if (OrdeCP=="'0'") {
					consulta  += "CP_tienda DESC";	
				}
			}
			if(OrdeId != 'NULL'){
				if(orden!=0){
					consulta  += " , ";
					orden=orden-1;
				}
				orden=orden+1;
				if (OrdeId=="'1'") {
					consulta  += "Id_Gran_Superficie_tienda ASC";
				}
				if (OrdeId=="'0'") {
					consulta  += "Id_Gran_Superficie_tienda DESC";	
				}
			}
			if(OrdeCom != 'NULL'){
				if(orden!=0){
					consulta  += " , ";
					orden=orden-1;
				}
				orden=orden+1;
				if (OrdeCom=="'1'") {
					consulta  += "Comunidad_tienda ASC";
				}
				if (OrdeCom=="'0'") {
					consulta  += "Comunidad_tienda DESC";	
				}
			}
			if(OrdeProv != 'NULL'){
				if(orden!=0){
					consulta  += " , ";
					orden=orden-1;
				}
				orden=orden+1;
				if (OrdeProv=="'1'") {
					consulta  += "Provincia_tienda ASC";
				}
				if (OrdeProv=="'0'") {
					consulta  += "Provincia_tienda DESC";	
				}
			}
			if(OrdeLoc != 'NULL'){
				if(orden!=0){
					consulta  += " , ";
					orden=orden-1;
				}
				orden=orden+1;
				if (OrdeLoc=="'1'") {
					consulta  += "Localidad_tienda ASC";
				}
				if (OrdeLoc=="'0'") {
					consulta  += "Localidad_tienda DESC";	
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
		connection.query(preconsulta+consulta,function(err, rows, fields){
			if(err){
				console.log(err);
				htmlerror(err); 					return res.status(400).json({ error: err });
			}else{
				if(rows[1].length != 0){
					console.log("Devuelvo las tiendas");
					data["Registros"]=rows[0].length;
					data["Tiendas"] = rows[1];
					return res.status(200).json(data);;	
				}else{
					console.log("no hay tiendas");
					data["Productos"] = 'No hay tiendas';
					return res.status(204).json(data);
				}
			}
		});
	connection.release();
	});
});

//post de tiendas
router.post('/',comprobacionjwt,function(req,res){
	db.getConnection(function(err, connection) {
    if (err) throw err;
		var Nombre = connection.escape(req.body.nombre);
		var Direccion = connection.escape(req.body.direccion);
		var Provincia = connection.escape(req.body.provincia);
		var Localidad = connection.escape(req.body.localidad);
		var Comunidad = connection.escape(req.body.comunidad);
		var CP = connection.escape(req.body.cp);
		var Longitud = connection.escape(req.body.longitud);
		var Latitud = connection.escape(req.body.latitud);
		var ID_granSuperficie = connection.escape(req.body.gransuperficie);
		var CIF = connection.escape(req.body.cif);
		var Telefono = connection.escape(req.body.telefono);
		var Foto = connection.escape(req.body.foto);
		var Logo = connection.escape(req.body.logo);
		var Descripcion = connection.escape(req.body.descripcion);
		var Horario = connection.escape(req.body.horario);
		var Facebook = connection.escape(req.body.facebook);
		var Twitter = connection.escape(req.body.twitter);
		var data = {
			"Tiendas":""
		};
		var consulta = "INSERT INTO tienda (";
		var i=0;
		if(Nombre != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Nombre_tienda";
			i++;
		}
		if(Direccion != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Direccion_tienda";
			i++;
		}
		if(Provincia != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Provincia_tienda";
			i++;
		}
		if(Localidad != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Localidad_tienda";
			i++;
		}
		if(Comunidad != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Comunidad_tienda";
			i++;
		}
		if(Longitud != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Longitud_tienda";
			i++;
		}
		if(Latitud != 'NULL'){
			if (i==1) {
				consulta  += " , ";
				i--;	
			}
			consulta  += "Latitud_tienda";
			i++;
		}
		if(ID_granSuperficie != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "id_gran_superficie_tienda";
			i++;
		}
		if(CIF != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "CIF_tienda";
			i++;
		}
		if(Foto != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Foto_tienda";
			i++;
		}
		if(Logo != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Logo_tienda";
			i++;
		}
		if(Descripcion != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Descripcion_tienda";
			i++;
		}
		if(Horario != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Horario_tienda";
			i++;
		}
		if(Facebook != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Facebook_tienda";
			i++;
		}
		if(Twitter != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Twitter_tienda";
			i++;
		}
		consulta=consulta+", Estado_tienda , Eliminado_tienda) VALUES (";
		var i=0;
		if(Nombre != 'NULL'){
			consulta  += Nombre;
			i++;
		}
		if(Direccion != 'NULL'){
			if (i==1) {
				consulta  += " , ";
				i--;	
			}
			consulta  += Direccion;
			i++;
		}
		if(Provincia != 'NULL'){
			if (i==1) {
				consulta  += " , ";
				i--;	
			}
			consulta  += Provincia;
			i++;
		}
		if(Localidad != 'NULL'){
			if (i==1) {
				consulta  += " , ";
				i--;	
			}
			consulta  += Localidad;
			i++;
		}
		if(Comunidad != 'NULL'){
			if (i==1) {
				consulta  += " , ";
				i--;	
			}
			consulta  += Comunidad;
			i++;
		}
		if(Longitud != 'NULL'){
			if (i==1) {
				consulta  += " , ";
				i--;	
			}
			consulta  += Longitud;
			i++;
		}
		if(Latitud != 'NULL'){
			if (i==1) {
				consulta  += " , ";
				i--;	
			}
			consulta  += Latitud;
			i++;
		}
		if(ID_granSuperficie != 'NULL'){
			if (i==1) {
				consulta  += " , ";
				i--;	
			}
			consulta  += ID_granSuperficie;
			i++;
		}
		if(CIF != 'NULL'){
			if (i==1) {
				consulta  += " , ";
				i--;	
			}
			consulta  += CIF;
			i++;
		}
		if(Foto != 'NULL'){
			if (i==1) {
				consulta  += " , ";
				i--;	
			}
			consulta  += Foto;
			i++;
		}
		if(Logo != 'NULL'){
			if (i==1) {
				consulta  += " , ";
				i--;	
			}
			consulta  += Logo;
			i++;
		}
		if(Descripcion != 'NULL'){
			if (i==1) {
				consulta  += " , ";
				i--;	
			}
			consulta  += Descripcion;
			i++;
		}
		if(Horario != 'NULL'){
			if (i==1) {
				consulta  += " , ";
				i--;	
			}
			consulta  += Horario;
			i++;
		}
		if(Facebook != 'NULL'){
			if (i==1) {
				consulta  += " , ";
				i--;	
			}
			consulta  += Facebook;
			i++;
		}
		if(Twitter != 'NULL'){
			if (i==1) {
				consulta  += " , ";
				i--;	
			}
			consulta  += Twitter;
			i++;
		}
		consulta+=",'1','0')";
		connection.query(consulta,function(err, rows, fields){
			if(err){
				console.log(err);
				htmlerror(err); 					return res.status(400).json({ error: err });
			}else{
				data["Tiendas"] = "Datos insertados correctamente!";
				return res.status(200).json(data);
			}
		});
	connection.release();
	});
});


//put de tiendas
router.put('/',comprobacionjwt,function(req,res){
	db.getConnection(function(err, connection) {
        if (err) throw err;
    	var ID = connection.escape(req.body.id_tienda);
		var Nombre = connection.escape(req.body.nombre);
		var Direccion = connection.escape(req.body.direccion);
		var Provincia = connection.escape(req.body.provincia);
		var Localidad = connection.escape(req.body.localidad);
		var Comunidad = connection.escape(req.body.comunidad);
		var Longitud = connection.escape(req.body.longitud);
		var Latitud = connection.escape(req.body.latitud);
		var Id_Gran_Superficie = connection.escape(req.body.id_gran_superficie);
		var CIF = connection.escape(req.body.cif);
		var CP = connection.escape(req.body.cp);
		var Estado = connection.escape(req.body.estado);
		var Copia = connection.escape(req.body.copia);
		var Eliminado = connection.escape(req.body.eliminado);
		var Foto = connection.escape(req.body.foto);
		var Logo = connection.escape(req.body.logo);
		var Telefono = connection.escape(req.body.telefono);
		var Descripcion = connection.escape(req.body.descripcion);
		var Horario = connection.escape(req.body.horario);
		var Facebook = connection.escape(req.body.facebook);
		var Twitter = connection.escape(req.body.twitter);
		var data = {
			"Tiendas":""
		};
		var consulta = "UPDATE tienda SET ";
		var i = 0;
		if(ID != 'NULL'){
			if(Nombre != 'NULL'){
				consulta  += "Nombre_tienda="+Nombre;
				i++;
			}
			if(Direccion != 'NULL'){
				if (i==1) {
					consulta  += " , ";
					i--;	
				}
				consulta  += "Direccion_tienda="+Direccion;
				i++;
			}
			if(Provincia != 'NULL'){
				if (i==1) {
					consulta  += " , ";
					i--;	
				}
				consulta  += "Provincia_tienda="+Provincia;
				i++;
			}
			if(Localidad != 'NULL'){
				if (i==1) {
					consulta  += " , ";
					i--;	
				}
				consulta  += "Localidad_tienda="+Localidad;
				i++;
			}
			if(Comunidad != 'NULL'){
				if (i==1) {
					consulta  += " , ";
					i--;	
				}
				consulta  += "Comunidad_tienda="+Comunidad;
				i++;
			}
			if(Longitud != 'NULL'){
				if (i==1) {
					consulta  += " , ";
					i--;	
				}
				consulta  += "Longitud_tienda="+Longitud;
				i++;
			}
			if(Latitud != 'NULL'){
				if (i==1) {
					consulta  += " , ";
					i--;	
				}
				consulta  += "Latitud_tienda="+Latitud;
				i++;
			}
			if(Id_Gran_Superficie != 'NULL'){
				if (i==1) {
					consulta  += " , ";
					i--;	
				}
				consulta  += "Id_gran_superficie_tienda="+Id_Gran_Superficie;
				i++;
			}
			if(CIF != 'NULL'){
				if (i==1) {
					consulta  += " , ";
					i--;	
				}
				consulta  += "CIF_tienda="+CIF;
				i++;
			}
			if(Estado != 'NULL'){
				if (i==1) {
					consulta  += " , ";
					i--;	
				}
				consulta  += "Estado_tienda="+Estado;
				i++;
			}
			if(Eliminado != 'NULL'){
				if (i==1) {
					consulta  += " , ";
					i--;	
				}
				consulta  += "Eliminado_tienda="+Eliminado;
				i++;
			}
			if(Foto != 'NULL'){
				if (i==1) {
					consulta  += " , ";
					i--;	
				}
				consulta  += "Foto_tienda="+Foto;
				i++;
			}
			if(Logo != 'NULL'){
				if (i==1) {
					consulta  += " , ";
					i--;	
				}
				consulta  += "Logo_tienda="+Logo;
				i++;
			}
			if(Descripcion != 'NULL'){
				if (i==1) {
					consulta  += " , ";
					i--;	
				}
				consulta  += "Descripcion_tienda="+Descripcion;
				i++;
			}
			if(Horario != 'NULL'){
				if (i==1) {
					consulta  += " , ";
					i--;	
				}
				consulta  += "Horario_tienda="+Horario;
				i++;
			}
			if(Facebook != 'NULL'){
				if (i==1) {
					consulta  += " , ";
					i--;	
				}
				consulta  += "Facebook_tienda="+Facebook;
				i++;
			}
			if(Twitter != 'NULL'){
				if (i==1) {
					consulta  += " , ";
					i--;	
				}
				consulta  += "Twitter_tienda="+Twitter;
				i++;
			}
			consulta = consulta + " WHERE Id_Tienda="+ID;
		}
		console.log(consulta);
		connection.query(consulta,function(err, rows, fields){
				if(err){
					console.log(err);
					htmlerror(err); 					return res.status(400).json({ error: err });
				}else{
 					data["Tiendas"] = "Actualizado correctamente!";
					return res.status(200).json(data);
				}
		});
	connection.release();
	});
});


//Genera el GET de gransuperficie
router.get('/gransuperficie',comprobacionjwt,function(req,res){
	db.getConnection(function(err, connection) {
        if (err) throw err;
 		var data = {
			"GSuperficies":"",
			"Registros":""
		};
		var id = connection.escape(req.query.id); //Variable que recoje el id de la tienda de la URI tienda?id={num}
		if(id != 'NULL'){ //Si en la URI existe se crea la consulta de busqueda por id
			var consulta="SELECT * FROM gran_superficie WHERE Id_gran_superficie="+id;
		}else{ //Si no muestra todos las grandes superficies
			var consulta = "SELECT * FROM gran_superficie";
		}
		connection.query(consulta,function(err, rows, fields){
			if(err){
				console.log(err);
				htmlerror(err); 					return res.status(400).json({ error: err });
			}else{
				if(rows[1].length != 0){
					data["Registros"]= rows[0].length;
					data["GSuperficies"] = rows[1];
					return res.status(200).json(data);
				}else{
					data["GSuperficies"] = 'No hay grandes superficies';
					return res.status(204).json(data);
				}
			}
		});   
	connection.release();
	});
});


//POST de gransuperficie
router.post('/gransuperficie',comprobacionjwt,function(req,res){
	db.getConnection(function(err, connection) {
        if (err) throw err;
		var Nombre = connection.escape(req.body.nombre);
		var Imagen = connection.escape(req.body.imagen);
		var data = {
			"Tiendas":""
		};
		if (Nombre != 'NULL' && Imagen != 'NULL') {
			var consulta = "INSERT INTO gran_superficie (Nombre_gran_superficie, Imagen_gran_superficie , Estado_gran_superficie, Eliminado_gran_superficie) VALUES ("+Nombre+","+Imagen+", '1', '0')";
		}else{
			htmlerror(err); 					return res.status(400).json({ error: "Debes pasarle el nombre y la imagen de la gran superficie" });
		}
		connection.query(consulta,function(err, rows, fields){
			if(err){
				console.log(err);
				htmlerror(err); 					return res.status(400).json({ error: err });
			}else{
				data["Tiendas"] = "Datos insertados correctamente!";
				return res.status(200).json(data);
			}
		});
	connection.release();
	});
});

//PUT de gransuperficie
router.put('/gransuperficie',comprobacionjwt,function(req,res){
	db.getConnection(function(err, connection) {
        if (err) throw err;
    	var ID = connection.escape(req.body.id);
		var Nombre = connection.escape(req.body.nombre);
		var Imagen = connection.escape(req.body.imagen);
		var data = {
			"Tiendas":""
		};
		var consulta = "UPDATE gran_superficie SET ";
		if(ID != 'NULL'){
			var i = 0;
			if(Nombre != 'NULL'){
				consulta  += "Nombre_gran_superficie="+Nombre;
				i++;
			}
			if(Imagen != 'NULL'){
				if (i==1) {
					consulta  += " , ";
					i--;	
				}
				consulta  += "Imagen_gran_superficie="+Imagen;
				i++;
			}
			consulta = consulta + " WHERE Id_gran_superficie="+ID;
		}
		connection.query(consulta,function(err, rows, fields){
			if(err){
				console.log(err);
				htmlerror(err); 					return res.status(400).json({ error: err });
			}else{
				data["Tiendas"] = "Actualizado correctamente!";
				return res.status(200).json(data);
			}
		});        
	connection.release();
	});
});


//Devuelve la visualizacion de las coordenadas
router.get('/coordenadas',comprobacionjwt,function(req,res){
	db.getConnection(function(err, connection) {
        if (err) throw err;
		var data = {
			"Coordenadas":""
		};
		var id = connection.escape(req.query.id); //Variable que recoje el id de la tienda de la URI tienda?id={num}
        console.log(id);
		if(id != 'NULL'){ //Si en la URI existe se crea la consulta de busqueda por id
			var consulta="SELECT Latitud_tienda, Longitud_tienda FROM tienda WHERE Id_tienda="+id;
		}else{ //Si no muestra todas las tiendas
			var consulta = "SELECT Latitud_tienda, Longitud_tienda FROM tienda";
		}
		connection.query(consulta,function(err, rows, fields){
			if(err){
				console.log(err);
				htmlerror(err); 					return res.status(400).json({ error: err });
			}else{
				if(rows.length != 0){
					data["Coordenadas"] = rows;
					return res.status(200).json(data);	
				}else{
					data["Coordenadas"] = 'No existe la tienda';
					return res.status(204).json(data);	
				}
			}
		});
	connection.release();
	});
});

module.exports = router;