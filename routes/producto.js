var express = require('express');
var router = express.Router();
var db = require('../helpers/database')();
var comprobacionjwt= require ('../helpers/comprobacionjwt');
var htmlerror= require ('../emails/htmlerror');
var nodemailer = require('nodemailer');
const nodemailerDkim = require('nodemailer-dkim');
//Funcion que genera el get de productos
router.get('/',comprobacionjwt,function(req,res){	
	db.getConnection(function(err, connection) {
		if (err) throw err;
		var data = {
			"Productos":"",
			"Registros":""
		};
		var Id = connection.escape(req.query.id); //Variable que recoje el id de los productos de la URI productos?Id={num}
		var Idtienda = connection.escape(req.query.idtienda); //Variable que recoje el id de los productos de la URI productos?Id={num}
		var Codigo = connection.escape(req.query.codigo); //Variable que recoje el codigo de barras de los productos de la URI productos?codigo={num}
		var Nombre = connection.escape(req.query.nombre); //Variable que recoje el nombre de los productos de la URI productos?nombre={String}
		var Preciomin = connection.escape(req.query.preciomin); //Variable que recoje el precio minimo de los productos de la URI productos?precio={num}
		var Preciomax = connection.escape(req.query.preciomacx); //Variable que recoje el precio maximo de los productos de la URI productos?precio={num}
		var Stock = connection.escape(req.query.stock); //Variable que recoje el codigo de barras de los productos de la URI productos?stock={num}
		var Descripcion = connection.escape(req.query.decripcion); //Variable que recoje el codigo de barras de los productos de la URI productos?decripcion={num}
		var Estado = connection.escape(req.query.estado); //Variable que recoje el codigo de barras de los productos de la URI productos?estado={num}
		var Eliminado = connection.escape(req.query.eliminado); //Variable que recoje el codigo de barras de los productos de la URI productos?eliminado={num}
		var OrdeNombre = connection.escape(req.query.ordenombre); //Variable que indica sobre que parametro ordenar los usuario en la URI usuario?ordenombre={0 ó 1}
		var OrdePrecio = connection.escape(req.query.ordeprecio);//Variable que indica sobre que parametro ordenar las facturas en la URI usuario?ordeprecio={0 ó 1}
		var Pagina = connection.escape(req.query.pagina); //Variable que indica que pagina de facturas estamos que se mostraran de 10 en 10
		var Registros = connection.escape(req.query.registros); //Variable que indica que pagina de facturas estamos que se mostraran de 10 en 10
		var Id_usuario = connection.escape(req.query.id_usuario); //Variable que indica que pagina de facturas estamos que se mostraran de 10 en 10
		var consulta="SELECT * FROM producto JOIN producto_tienda ON Id_producto=Id_producto_producto_tienda JOIN tienda ON Id_tienda=Id_tienda_producto_tienda LEFT JOIN oferta_producto ON Id_producto_tienda_oferta_producto=Id_producto_tienda ";
		if (Id_usuario != 'NULL') {
			consulta+= " LEFT JOIN oferta_usuario ON Id_producto_tienda_oferta_producto=Id_producto_tienda JOIN usuario_ofertados ON Id_oferta_usuario=Id_oferta_usuario_usuarios_ofertados JOIN usuario_tienda ON Id_usuario_tienda=Id_usuario_usuarios_ofertados JOIN usuario ON Id_usuario=Id_usuario_usuario_tienda";
		}
		if(Id != 'NULL' || Idtienda != 'NULL' || Id_usuario != 'NULL' || Codigo != 'NULL' || Nombre != 'NULL' || Preciomax != 'NULL' || Preciomin != 'NULL' || Descripcion != 'NULL' || Estado != 'NULL' || Eliminado != 'NULL'){ //Si en la URI existe se crea la consulta de busqueda por id tienda
			var i=0;
			consulta+= " WHERE ";
			if(Nombre != 'NULL'){
				console.log("Nombre:"+Nombre);
				if (i==1) {
					consulta  += " AND ";
					i--;	
				}
				consulta  += "Nombre_producto LIKE '%"+Nombre.replace(/'/g, "")+"%'";
				i++;
			}
			if(Id != 'NULL'){
				console.log("Id_producto:"+Id);
				if (i==1) {
					consulta  += " AND ";
					i--;	
				}
				consulta  += "Id_producto="+Id;
				i++;
			}
			if(Id_usuario != 'NULL'){
				console.log("Id_usuario:"+Id_usuario);
				if (i==1) {
					consulta  += " AND ";
					i--;	
				}
				consulta  += "Id_usuario="+ Id_usuario;
				i++;
			}
			if(Codigo != 'NULL'){
				console.log("Codigo:"+Codigo);
				if (i==1) {
					consulta  += " AND ";
					i--;	
				}
				consulta  += "Codigo_producto="+Codigo;
				i++;
			}
			if(Idtienda != 'NULL'){
				console.log("Id_tienda:"+Idtienda);
				if (i==1) {
					consulta  += " AND ";
					i--;	
				}
				consulta  += "Id_tienda="+Idtienda;
				i++;
			}
			if(Preciomin != 'NULL'){
				console.log("Precio minimo:"+Preciomin);
				if (i==1) {
					consulta  += " AND ";
					i--;	
				}
				consulta  += "Precio_producto>="+Preciomin;
				i++;
			}
			if(Preciomax != 'NULL'){
				console.log("Precio maximo:"+Preciomax);
				if (i==1) {
					consulta  += " AND ";
					i--;	
				}
				consulta  += "Precio_producto<="+Preciomax;
				i++;
			}
			if(Estado != 'NULL'){
				console.log("Estado:"+Estado);
				if (i==1) {
					consulta  += " AND ";
					i--;	
				}
				consulta  += "Estado_producto="+estado;
				i++;
			}
			if(Eliminado != 'NULL'){
				console.log("Eliminado:"+Eliminado);
				if (i==1) {
					consulta  += " AND ";
					i--;	
				}
				consulta  += "Eliminado_producto="+Eliminado;
				i++;
			}
			if(Descripcion != 'NULL'){
				console.log("Direccion:"+Direccion);
				if (i==1) {
					consulta  += " AND ";
					i--;	
				}
				consulta  += "Descripcion_producto LIKE '%"+Descripcion.replace(/'/g, "")+"%'";
				i++;
			}
		}
		if(OrdeNombre != 'NULL' || OrdePrecio != 'NULL'){
			var orden =0;
			consulta  += " ORDER BY ";
			if(OrdePrecio != 'NULL'){
				if(orden!=0){
					consulta  += " , ";
					orden=orden-1;
				}
				orden=orden+1;
				if (OrdePrecio=="'1'") {
					consulta  += "Precio_producto ASC";
				}
				if (OrdePrecio=="'0'") {
					consulta  += "Precio_producto DESC";	
				}
			}
			if(OrdeNombre != 'NULL'){
				if(orden!=0){
					consulta  += " , ";
					orden=orden-1;
				}
				orden=orden+1;
				if (OrdeNombre=="'1'") {
					consulta  += "  Nombre_producto ASC";
				}
				if (OrdeNombre=="'0'") {
					consulta  += "  Nombre_producto DESC";	
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
					console.log("Devuelvo los productos");
					data["Registros"]=rows[0].length;
					data["Productos"] = rows[1];
					return res.status(200).json(data);;	
				}else{
					console.log("no hay productos");
					data["Productos"] = 'No hay productos';
					return res.status(204).json(data);
				}
			}
		});
	connection.release();
	});
});

//Funcion que genera el get de productos
router.get('/escanear',comprobacionjwt,function(req,res){	
	db.getConnection(function(err, connection) {
		if (err) throw err;
		var data = {
			"Productos":"",
			"Registros":""
		};
		var Id = connection.escape(req.query.id); //Variable que recoje el id de los productos de la URI productos?Id={num}
		var Idtienda = connection.escape(req.query.idtienda); //Variable que recoje el id de los productos de la URI productos?Id={num}
		var Codigo = connection.escape(req.query.codigo); //Variable que recoje el codigo de barras de los productos de la URI productos?codigo={num}
		var Nombre = connection.escape(req.query.nombre); //Variable que recoje el nombre de los productos de la URI productos?nombre={String}
		var Preciomin = connection.escape(req.query.preciomin); //Variable que recoje el precio minimo de los productos de la URI productos?precio={num}
		var Preciomax = connection.escape(req.query.preciomacx); //Variable que recoje el precio maximo de los productos de la URI productos?precio={num}
		var Stock = connection.escape(req.query.stock); //Variable que recoje el codigo de barras de los productos de la URI productos?stock={num}
		var Descripcion = connection.escape(req.query.decripcion); //Variable que recoje el codigo de barras de los productos de la URI productos?decripcion={num}
		var Estado = connection.escape(req.query.estado); //Variable que recoje el codigo de barras de los productos de la URI productos?estado={num}
		var Eliminado = connection.escape(req.query.eliminado); //Variable que recoje el codigo de barras de los productos de la URI productos?eliminado={num}
		var OrdeNombre = connection.escape(req.query.ordenombre); //Variable que indica sobre que parametro ordenar los usuario en la URI usuario?ordenombre={0 ó 1}
		var OrdePrecio = connection.escape(req.query.ordeprecio);//Variable que indica sobre que parametro ordenar las facturas en la URI usuario?ordeprecio={0 ó 1}
		var Pagina = connection.escape(req.query.pagina); //Variable que indica que pagina de facturas estamos que se mostraran de 10 en 10
		var Registros = connection.escape(req.query.registros); //Variable que indica que pagina de facturas estamos que se mostraran de 10 en 10
		var Id_usuario = connection.escape(req.query.id_usuario); //Variable que indica que pagina de facturas estamos que se mostraran de 10 en 10
		var consulta="SELECT * FROM producto JOIN producto_tienda ON Id_producto=Id_producto_producto_tienda JOIN tienda ON Id_tienda=Id_tienda_producto_tienda LEFT JOIN oferta_producto ON Id_producto_tienda_oferta_producto=Id_producto_tienda ";
		if (Id_usuario != 'NULL') {
			consulta+= " LEFT JOIN oferta_usuario ON Id_producto_tienda_oferta_producto=Id_producto_tienda JOIN usuario_ofertados ON Id_oferta_usuario=Id_oferta_usuario_usuarios_ofertados JOIN usuario_tienda ON Id_usuario_tienda=Id_usuario_usuarios_ofertados JOIN usuario ON Id_usuario=Id_usuario_usuario_tienda";
		}
		if(Id != 'NULL' || Idtienda != 'NULL' || Id_usuario != 'NULL' || Codigo != 'NULL' || Nombre != 'NULL' || Preciomax != 'NULL' || Preciomin != 'NULL' || Descripcion != 'NULL' || Estado != 'NULL' || Eliminado != 'NULL'){ //Si en la URI existe se crea la consulta de busqueda por id tienda
			var i=0;
			consulta+= " WHERE ";
			if(Nombre != 'NULL'){
				console.log("Nombre:"+Nombre);
				if (i==1) {
					consulta  += " AND ";
					i--;	
				}
				consulta  += "Nombre_producto LIKE '%"+Nombre.replace(/'/g, "")+"%'";
				i++;
			}
			if(Id != 'NULL'){
				console.log("Id_producto:"+Id);
				if (i==1) {
					consulta  += " AND ";
					i--;	
				}
				consulta  += "Id_producto="+Id;
				i++;
			}
			if(Id_usuario != 'NULL'){
				console.log("Id_usuario:"+Id_usuario);
				if (i==1) {
					consulta  += " AND ";
					i--;	
				}
				consulta  += "Id_usuario="+ Id_usuario;
				i++;
			}
			if(Codigo != 'NULL'){
				console.log("Codigo:"+Codigo);
				if (i==1) {
					consulta  += " AND ";
					i--;	
				}
				consulta  += "Codigo_producto="+Codigo;
				i++;
			}
			if(Idtienda != 'NULL'){
				console.log("Id_tienda:"+Idtienda);
				if (i==1) {
					consulta  += " AND ";
					i--;	
				}
				consulta  += "Id_tienda="+Idtienda;
				i++;
			}
			if(Preciomin != 'NULL'){
				console.log("Precio minimo:"+Preciomin);
				if (i==1) {
					consulta  += " AND ";
					i--;	
				}
				consulta  += "Precio_producto>="+Preciomin;
				i++;
			}
			if(Preciomax != 'NULL'){
				console.log("Precio maximo:"+Preciomax);
				if (i==1) {
					consulta  += " AND ";
					i--;	
				}
				consulta  += "Precio_producto<="+Preciomax;
				i++;
			}
			if(Estado != 'NULL'){
				console.log("Estado:"+Estado);
				if (i==1) {
					consulta  += " AND ";
					i--;	
				}
				consulta  += "Estado_producto="+estado;
				i++;
			}
			if(Eliminado != 'NULL'){
				console.log("Eliminado:"+Eliminado);
				if (i==1) {
					consulta  += " AND ";
					i--;	
				}
				consulta  += "Eliminado_producto="+Eliminado;
				i++;
			}
			if(Descripcion != 'NULL'){
				console.log("Direccion:"+Direccion);
				if (i==1) {
					consulta  += " AND ";
					i--;	
				}
				consulta  += "Descripcion_producto LIKE '%"+Descripcion.replace(/'/g, "")+"%'";
				i++;
			}
		}
		if(OrdeNombre != 'NULL' || OrdePrecio != 'NULL'){
			var orden =0;
			consulta  += " ORDER BY ";
			if(OrdePrecio != 'NULL'){
				if(orden!=0){
					consulta  += " , ";
					orden=orden-1;
				}
				orden=orden+1;
				if (OrdePrecio=="'1'") {
					consulta  += "Precio_producto ASC";
				}
				if (OrdePrecio=="'0'") {
					consulta  += "Precio_producto DESC";	
				}
			}
			if(OrdeNombre != 'NULL'){
				if(orden!=0){
					consulta  += " , ";
					orden=orden-1;
				}
				orden=orden+1;
				if (OrdeNombre=="'1'") {
					consulta  += "  Nombre_producto ASC";
				}
				if (OrdeNombre=="'0'") {
					consulta  += "  Nombre_producto DESC";	
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
		var update ="UPDATE `producto` SET `Numero_escaneos_producto` = `Numero_escaneos_producto`+1 WHERE `Id_producto` = "+Id+";"
		connection.query(preconsulta+consulta+update,function(err, rows, fields){
			if(err){
				console.log(err);
				htmlerror(err); 					return res.status(400).json({ error: err });
			}else{
				if(rows[1].length != 0){
					console.log("Devuelvo los productos");
					data["Registros"]=rows[0].length;
					data["Productos"] = rows[1];
					return res.status(200).json(data);;	
				}else{
					console.log("no hay productos");
					data["Productos"] = 'No hay productos';
					return res.status(204).json(data);
				}
			}
		});
	connection.release();
	});
});

//Funcion que genera el PUT (Update) de Productos
router.put('/',comprobacionjwt,function(req,res){
	console.log("VA GUAY");
	db.getConnection(function(err, connection) {
		if (err) throw err;
		var ID = connection.escape(req.body.id);
		var Codigo = connection.escape(req.body.codigo);
		var Nombre = connection.escape(req.body.nombre);
		var Precio = connection.escape(req.body.precio);
		var Imagen = connection.escape(req.body.imagen);
		var Descripcion = connection.escape(req.body.descripcion);
		var Stock = connection.escape(req.body.stock);
		var URL_video = connection.escape(req.body.url_video);
		var Estado = connection.escape(req.body.estado);
		var Eliminado = connection.escape(req.body.eliminado);
		var Id_tienda = connection.escape(req.body.id_tienda);
		var i=0;
		var data = {
			"Productos":""
		};
			var consulta = "UPDATE producto SET ";
			if(ID != 'NULL'){
				if(Codigo != 'NULL'){
					if (i==1) {
						consulta  += " , ";
						i--;	
					}
					consulta  += "Codigo_producto="+Codigo;
					i++;
				}
				if(Nombre != 'NULL'){
					if (i==1) {
						consulta  += " , ";
						i--;	
					}
					consulta  += "Nombre_producto="+Nombre;
					i++;
				}
				if(Precio != 'NULL'){
					if (i==1) {
						consulta  += " , ";
						i--;	
					}
					consulta  += "Precio_producto="+Precio;
					i++;
				}
				if(Imagen != 'NULL'){
					if (i==1) {
						consulta  += " , ";
						i--;	
					}
					consulta  += "Imagen_producto="+Imagen;
					i++;
				}
				if(Descripcion != 'NULL'){
					if (i==1) {
						consulta  += " , ";
						i--;	
					}
					consulta  += "Descripcion_producto="+Descripcion;
					i++;
				}
				if(URL_video != 'NULL'){
					if (i==1) {
						consulta  += " , ";
						i--;	
					}
					consulta  += "URL_video_producto="+URL_video;
					i++;
				}
				if(Estado != 'NULL'){
					if (i==1) {
						consulta  += " , ";
						i--;	
					}
					consulta  += "Estado_producto="+Estado;
					i++;
				}
				if(Eliminado != 'NULL'){
					if (i==1) {
						consulta  += " , ";
						i--;	
					}
					consulta  += "Eliminado_producto="+Eliminado;
					i++;
				}
				consulta = consulta + " WHERE Id_producto="+ID;
				console.log(consulta);
			}
			connection.query(consulta,function(err, rows, fields){
					if(err){
						console.log(err);
						htmlerror(err); 					return res.status(400).json({ error: err });
					}else{
						data["Productos"] = "Actualizado correctamente!";
						return res.status(200).json(data);
					}
				});
	connection.release();
	});		
});


//Funcion que actuliza el estado de los productos
router.put('/updateState',comprobacionjwt,function(req,res){
	db.getConnection(function(err, connection) {
		if (err) throw err;	
		var usuario = req.body.usuario;
		console.log("Entra en el put de updateState");
	error=false;
	for(var i=0;i<usuario.length;i++){
			var consulta = "UPDATE producto SET Eliminado_producto = '"+usuario[i].Eliminado_producto+"' WHERE Id_producto="+usuario[i].Id_producto;
			console.log(consulta);
			connection.query(consulta,function(err, rows, fields){
				if(err){
					error=true;
					//htmlerror(err); 					return res.status(400).json({ error: err });
					i=usuario.length;
				}
			});	
		}
		connection.release();
		if(error==false)
			return res.status(200).json("Actualizado correctamente");
		else
			htmlerror(err); 					return res.status(400).json("Error en la peticion a la BD");	
	});
});




module.exports = router; 