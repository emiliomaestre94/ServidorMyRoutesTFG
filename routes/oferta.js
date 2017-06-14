var express = require('express');
var router = express.Router();
var db = require('../helpers/database')();
var comprobacionjwt= require ('../helpers/comprobacionjwt');

var htmlerror= require ('../emails/htmlerror');
var nodemailer = require('nodemailer');
const nodemailerDkim = require('nodemailer-dkim');

//DEVUELVE OFERTAS DE Producto
router.get('/ofertasProducto',comprobacionjwt,function(req,res){
	db.getConnection(function(err, connection) {
        if (err) throw err;
		var data = {
			"Ofertas":"",
			"Registros":""
		};
		var Id_tienda = connection.escape(req.query.id_tienda); //Variable que recoje el id de la tienda de la URI ofertas?idTienda={num}
		var Id_producto_tienda = connection.escape(req.query.idProductoTienda); //Variable que recoje el id del producto de la URI ofertas?idProductoTienda={num}
		var Id_oferta_producto = connection.escape(req.query.id_oferta_producto);
		var Pagina = connection.escape(req.query.pagina);
		var Registros = connection.escape(req.query.registros);
		var aux=0;
		var consulta="SELECT * FROM oferta_producto JOIN producto_tienda ON Id_producto_tienda_oferta_producto = Id_producto_tienda JOIN producto ON Id_producto_tienda = Id_producto JOIN tienda ON Id_tienda=Id_tienda_oferta_producto";
        var update= "UPDATE oferta_producto SET Numero_visualizaciones_oferta_producto=Numero_visualizaciones_oferta_producto+1 ";
		if(Id_tienda != 'NULL' || Id_producto_tienda != 'NULL' || Id_oferta_producto != 'NULL'){
			consulta+= " WHERE ";
			update+= " WHERE ";
			if(Id_tienda != 'NULL'){
				if(aux==1){
					update+=" AND ";
					consulta+=" AND ";
					aux--;
				}
				update += "Id_tienda_oferta_producto = "+Id_tienda;
				consulta += "Id_tienda_oferta_producto = "+Id_tienda;
				aux++;
			}
			if(Id_producto_tienda != 'NULL'){
				if(aux==1){
					update+=" AND ";
					consulta+=" AND ";
					aux--;
				}
				consulta += "Id_producto_tienda_oferta_producto = "+Id_producto_tienda;
				update += "Id_producto_tienda_oferta_producto = "+Id_producto_tienda;
				aux++;
			}
			if(Id_oferta_producto != 'NULL'){
				if(aux==1){
					update+=" AND ";
					consulta+=" AND ";
					aux--;
				}
				consulta += "Id_oferta_producto = "+Id_oferta_producto;
				update += "Id_oferta_producto = "+Id_oferta_producto;
				aux++;
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
		consulta += ";";
		console.log("Consulta:");
		console.log(consulta);
		console.log(update);
		connection.query(preconsulta+consulta+update,function(err, rows, fields){
			if(err){
				console.log("Error en la query...");
				htmlerror(err); 					return res.status(400).json({ error: err });
			}else{
				console.log("Query OK");
				if(rows[1].length != 0){
					console.log("Devuelvo las ofertas de producto");
					data["Registros"]= rows[0].length;
					data["Ofertas"] = rows[1];
					return res.status(200).json(data);
				}else{
					data["Ofertas"] = 'No hay Ofertas';
					console.log("No hay Ofertas...");
					return res.status(204).json(data);	
				}
			}
		});
    connection.release();
	});
});

//DEVUELVE OFERTAS DE UN USUARIO
router.get('/ofertasUsuario',comprobacionjwt,function(req,res){
	db.getConnection(function(err, connection) {
        if (err) throw err;
		var data = {
			"Ofertas":"",
			"Registros":""
		};
		var Id_usuario = connection.escape(req.query.id_usuario); //Variable que recoje el id del usuario de la URI ofertas?idUsuario={num}
		var Id_tienda = connection.escape(req.query.id_tienda); //Variable que recoje el id de la tienda de la URI ofertas?idTienda={num}
		var Id_producto_tienda = connection.escape(req.query.idProductoTienda); //Variable que recoje el id del producto de la URI ofertas?idProductoTienda={num}
		var Id_oferta_usuario = connection.escape(req.query.id_oferta_usuario);
		var Pagina = connection.escape(req.query.pagina);
		var Registros = connection.escape(req.query.registros);
		var aux=0;
		var consulta="SELECT * FROM oferta_usuario JOIN usuario_ofertados ON Id_oferta_usuario=Id_oferta_usuario_usuarios_ofertados JOIN usuario_tienda ON Id_usuario_tienda=Id_usuario_usuarios_ofertados JOIN usuario ON Id_usuario=Id_usuario_usuario_tienda JOIN producto_tienda ON Id_producto_tienda=Id_producto_tienda_oferta_usuario JOIN producto ON Id_producto_tienda=Id_producto JOIN tienda ON Id_tienda = Id_tienda_producto_tienda";
		var update = "UPDATE oferta_usuario SET Numero_visualizaciones_oferta_usuario = Numero_visualizaciones_oferta_usuario+1 ";
        if(Id_usuario != 'NULL' || Id_tienda != 'NULL' || Id_producto_tienda != 'NULL' || Id_oferta_usuario != 'NULL'){
			consulta+= " WHERE ";
			update+= " WHERE ";
			if(Id_usuario != 'NULL'){
				if(aux==1){
					consulta+=" AND ";
					update+=" AND ";
					aux--;
				}
				consulta += "Id_usuario = "+Id_usuario;
				update += "Id_usuario = "+Id_usuario;
				aux++;
			}
			if(Id_tienda != 'NULL'){
				if(aux==1){
					consulta+=" AND ";
					update+=" AND ";
					aux--;
				}
				consulta += "Id_tienda = "+Id_tienda;
				update += "Id_tienda = "+Id_tienda;
				aux++;
			}
			if(Id_producto_tienda != 'NULL'){
				if(aux==1){
					consulta+=" AND ";
					update+=" AND ";
					aux--;
				}
				consulta += "Id_producto_tienda = "+Id_producto_tienda;
				update += "Id_producto_tienda = "+Id_producto_tienda;
				aux++;
			}
			if(Id_oferta_usuario != 'NULL'){
				if(aux==1){
					consulta+=" AND ";
					update+=" AND ";
					aux--;
				}
				consulta += "Id_oferta_usuario = "+Id_oferta_usuario;
				update += "Id_oferta_usuario = "+Id_oferta_usuario;
				aux++;
			}
		}
		consulta+="AND Eliminado_oferta_usuario='0'";
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
				console.log("Error en la query...");
				htmlerror(err); 					return res.status(400).json({ error: err });
			}else{
				console.log("Query OK");
				if(rows[1].length != 0){
					console.log("Devuelvo las ofertas del usuario");
					data["Registros"]= rows[0].length;
					data["Ofertas"] = rows[1];
					return res.status(200).json(data);
				}else{
					data["Ofertas"] = 'No hay Ofertas';
					console.log("No hay Ofertas...");
					return res.status(204).json(data);	
				}
			}
		});
    connection.release();
	});
});

router.get('/ofertasUsuarioInfo',comprobacionjwt,function(req,res){
	db.getConnection(function(err, connection) {
        if (err) throw err;
		var data = {
			"Ofertas":"",
			"Registros":""
		};
		var Id_usuario = connection.escape(req.query.id_usuario); //Variable que recoje el id del usuario de la URI ofertas?idUsuario={num}
		var Id_tienda = connection.escape(req.query.id_tienda); //Variable que recoje el id de la tienda de la URI ofertas?idTienda={num}
		var Id_producto_tienda = connection.escape(req.query.idProductoTienda); //Variable que recoje el id del producto de la URI ofertas?idProductoTienda={num}
		var Id_oferta_usuario = connection.escape(req.query.id_oferta_usuario);
		var Pagina = connection.escape(req.query.pagina);
		var Registros = connection.escape(req.query.registros);
		var FechaIni = connection.escape(req.query.fechaIni);
		var FechaFin = connection.escape(req.query.fechaFin);
		var aux=0;
		var consulta="SELECT * FROM oferta_usuario JOIN producto_tienda ON Id_producto_tienda=Id_producto_tienda_oferta_usuario JOIN tienda ON Id_tienda = Id_tienda_producto_tienda JOIN producto ON Id_producto=id_producto_producto_tienda";
        if(Id_tienda != 'NULL' || FechaIni!= 'NULL' || FechaFin != 'NULL' || Id_oferta_usuario != 'NULL' ){
			consulta+= " WHERE ";
			if(Id_tienda != 'NULL'){
				if(aux==1){
					consulta+=" AND ";
					aux--;
				}
				consulta += "Id_tienda = "+Id_tienda;
				aux++;
			}
			if(Id_oferta_usuario != 'NULL'){
				if (aux==1) {
					consulta  += " AND ";
					aux--;	
				}
				consulta  += "Id_oferta_usuario="+Id_oferta_usuario;
				aux++;
			}			
			if(FechaIni != 'NULL'){
				if (aux==1) {
					consulta  += " AND ";
					aux--;	
				}
				consulta  += "Fecha_inicio_oferta_usuario>="+FechaIni;
				aux++;
			}
			if(FechaFin != 'NULL'){
				if (aux==1) {
					consulta  += " AND ";
					aux--;	
				}
				consulta  += "Fecha_fin_oferta_usuario<="+FechaFin;
				aux++;
			}
			
		}
		consulta+="AND Eliminado_oferta_usuario='0'";
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
				console.log("Error en la query...");
				htmlerror(err); 					return res.status(400).json({ error: err });
			}else{
				console.log("Query OK");
				if(rows[1].length != 0){
					console.log("Devuelvo las ofertas del usuario");
					data["Registros"]= rows[0].length;
					data["Ofertas"] = rows[1];
					return res.status(200).json(data);
				}else{
					data["Ofertas"] = 'No hay Ofertas';
					console.log("No hay Ofertas...");
					return res.status(204).json(data);	
				}
			}
		});
    connection.release();
	});
});

router.get('/ofertasUsuarioInfoDebug',comprobacionjwt,function(req,res){
	db.getConnection(function(err, connection) {
        if (err) throw err;
		var data = {
			"Ofertas":"",
			"Registros":""
		};
		var Id_usuario = connection.escape(req.query.id_usuario); //Variable que recoje el id del usuario de la URI ofertas?idUsuario={num}
		var Id_tienda = connection.escape(req.query.id_tienda); //Variable que recoje el id de la tienda de la URI ofertas?idTienda={num}
		var Id_producto_tienda = connection.escape(req.query.idProductoTienda); //Variable que recoje el id del producto de la URI ofertas?idProductoTienda={num}
		var Id_oferta_usuario = connection.escape(req.query.id_oferta_usuario);
		var Pagina = connection.escape(req.query.pagina);
		var Registros = connection.escape(req.query.registros);
		var aux=0;
		var consulta="SELECT * FROM oferta_usuario JOIN producto_tienda ON Id_producto_tienda=Id_producto_tienda_oferta_usuario JOIN tienda ON Id_tienda = Id_tienda_producto_tienda JOIN producto ON Id_producto=id_producto_producto_tienda";
        if(Id_tienda != 'NULL'){
			consulta+= " WHERE ";
			if(Id_tienda != 'NULL'){
				if(aux==1){
					consulta+=" AND ";
					aux--;
				}
				consulta += "Id_tienda = "+Id_tienda;
				aux++;
			}
		}
		//consulta+="AND Eliminado_oferta_usuario='0'";
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
				console.log("Error en la query...");
				htmlerror(err); 					return res.status(400).json({ error: err });
			}else{
				console.log("Query OK");
				if(rows[1].length != 0){
					console.log("Devuelvo las ofertas del usuario");
					data["Registros"]= rows[0].length;
					data["Ofertas"] = rows[1];
					return res.status(200).json(data);
				}else{
					data["Ofertas"] = 'No hay Ofertas';
					console.log("No hay Ofertas...");
					return res.status(204).json(data);	
				}
			}
		});
    connection.release();
	});
});

//POST de ofertas de usuario
router.post('/ofertasUsuario',comprobacionjwt,function(req,res){
	db.getConnection(function(err, connection) {
        if (err) throw err;
 		var FechaIni = connection.escape(req.body.fechaini);
		var FechaFin = connection.escape(req.body.fechafin);
		var P_oferta = connection.escape(req.body.p_oferta);
		var Usuarios = req.body.usuarios;
		var Id_tienda = connection.escape(req.body.id_tienda);
		var Id_producto_tienda = connection.escape(req.body.id_producto_tienda);
		var Foto = connection.escape(req.body.foto);
		var Descripcion = connection.escape(req.body.Descripcion);
		var Estado = connection.escape(req.body.estado);
		var Eliminado = connection.escape(req.body.eliminado);
		var data = {
			"Ofertas":""
		};
		var consulta = "INSERT INTO oferta_usuario (";
		var i=0;
		if(FechaIni != 'NULL'){
			consulta  += "Fecha_inicio_oferta_usuario";
			i++;
		}
		if(FechaFin != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Fecha_fin_oferta_usuario";
			i++;
		}
		if(P_oferta != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "P_oferta_oferta_usuario";
			i++;
		}
		if(Id_tienda != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Id_tienda_oferta_usuario";
			i++;
		}
		if(Id_producto_tienda != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Id_producto_tienda_oferta_usuario";
			i++;
		}
		if(Foto != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Foto_oferta_usuario";
			i++;
		}
		if(Descripcion != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Descripcion_oferta_usuario";
			i++;
		}
		consulta+=", Estado_oferta_usuario , Eliminado_oferta_usuario) VALUES (";
		var i=0;
		if(FechaIni != 'NULL'){
			if (i==1) {
				consulta  += " , ";
				i--;	
			}
			consulta  += FechaIni;
			i++;
		}
		if(FechaFin != 'NULL'){
			if (i==1) {
				consulta  += " , ";
				i--;	
			}
			consulta  += FechaFin;
			i++;
		}
		if(P_oferta != 'NULL'){
			if (i==1) {
				consulta  += " , ";
				i--;	
			}
			consulta  += P_oferta;
			i++;
		}
		if(Id_tienda != 'NULL'){
			if (i==1) {
				consulta  += " , ";
				i--;	
			}
			consulta  += Id_tienda;
			i++;
		}
		if(Id_producto_tienda != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += Id_producto_tienda;
			i++;
		}
		if(Foto != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += Foto;
			i++;
		}
		if(Descripcion != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += Descripcion;
			i++;
		}
		consulta+=",'1','0')";
		console.log(consulta);
        connection.query(consulta,function(err, rows, fields){
            if(err){
				console.log("Error en la query...");
				htmlerror(err); 					return res.status(400).json({ error: err });
			}else{
				var id = rows.insertId;
				var consulta2 = "INSERT INTO usuario_ofertados (Id_usuario_usuarios_ofertados, Id_oferta_usuario_usuarios_ofertados, Estado_usuario_ofertados, Eliminado_usuario_ofertados) VALUES ";
				for (var index = 0; index < Usuarios.length; index++) {
					if (index==0) {
						consulta2+= "('"+Usuarios[index]+"', '"+id+"', '1', '0')";	
					}else if(index==Usuarios.length-1){
						consulta2+= ", ('"+Usuarios[index]+"', '"+id+"', '1', '0');";
					}else{
						consulta2+= ", ('"+Usuarios[index]+"', '"+id+"', '1', '0') ";
					}
				}
				console.log(consulta2);
				connection.query(consulta2,function(err, rows, fields){
					if(err){
						console.log("Error en la query...");
						htmlerror(err); 					return res.status(400).json({ error: err });
					}else{
						console.log("Usuarios ofertados insertados correctamente");
						data["Ofertas"] = "Usuarios ofertados insertados correctamente";
						return res.status(200).json(data);
					}
				});   
			}
        });       
    connection.release();
	});
});

//POST de ofertas de usuario
router.post('/ofertaProducto',comprobacionjwt,function(req,res){
	db.getConnection(function(err, connection) {
        if (err) throw err;
 		var FechaIni = connection.escape(req.body.fechaini);
		var FechaFin = connection.escape(req.body.fechafin);
		var P_oferta = connection.escape(req.body.p_oferta);
		var Id_tienda = connection.escape(req.body.id_tienda);
		var Id_producto_tienda = connection.escape(req.body.id_producto_tienda);
		var Foto = connection.escape(req.body.foto);
		var Descripcion = connection.escape(req.body.Descripcion);
		var Estado = connection.escape(req.body.estado);
		var Eliminado = connection.escape(req.body.eliminado);
		var data = {
			"Ofertas":""
		};
		var consulta = "INSERT INTO oferta_producto (";
		var i=0;
		if(FechaIni != 'NULL'){
			consulta  += "Fecha_inicio_oferta_producto";
			i++;
		}
		if(FechaFin != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Fecha_fin_oferta_producto";
			i++;
		}
		if(P_oferta != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "P_oferta_oferta_producto";
			i++;
		}
		if(Id_tienda != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Id_tienda_oferta_producto";
			i++;
		}
		if(Id_producto_tienda != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Id_producto_tienda_oferta_producto";
			i++;
		}
		if(Foto != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Foto_oferta_producto";
			i++;
		}
		if(Descripcion != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Descripcion_oferta_producto";
			i++;
		}
		consulta+=", Estado_oferta_producto , Eliminado_oferta_producto) VALUES (";
		var i=0;
		if(FechaIni != 'NULL'){
			if (i==1) {
				consulta  += " , ";
				i--;	
			}
			consulta  += FechaIni;
			i++;
		}
		if(FechaFin != 'NULL'){
			if (i==1) {
				consulta  += " , ";
				i--;	
			}
			consulta  += FechaFin;
			i++;
		}
		if(P_oferta != 'NULL'){
			if (i==1) {
				consulta  += " , ";
				i--;	
			}
			consulta  += P_oferta;
			i++;
		}
		if(Id_tienda != 'NULL'){
			if (i==1) {
				consulta  += " , ";
				i--;	
			}
			consulta  += Id_tienda;
			i++;
		}
		if(Id_producto_tienda != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += Id_producto_tienda;
			i++;
		}
		if(Foto != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += Foto;
			i++;
		}
		if(Descripcion != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += Descripcion;
			i++;
		}
		consulta+=",'1','0')";
		console.log(consulta);
        connection.query(consulta,function(err, rows, fields){
            if(err){
				console.log("Error en la query...");
				htmlerror(err); 					return res.status(400).json({ error: err });
			}else{
				console.log("Oferta insertada correctamente");
				data["Ofertas"] = "Oferta insertada correctamente";
				return res.status(200).json(data);  
			}
        });       
    connection.release();
	});
});

//Funcion que actuliza el estado de los productos
router.put('/ofertaUsuario',comprobacionjwt,function(req,res){
	db.getConnection(function(err, connection) {
		var data = {
			"Ofertas":"",
			"Registros":""
		};	
		if (err) throw err;	
		var altausuario = req.body.altausuario;
		var bajausuario = req.body.bajausuario;
		var P_oferta = connection.escape(req.body.p_oferta);
		var Fechaini = connection.escape(req.body.fechaini);
		var Fechafin = connection.escape(req.body.fechafin);
		var Id_producto = connection.escape(req.body.id_producto);
		var Id_tienda = connection.escape(req.body.id_tienda);
		var Foto = connection.escape(req.body.foto);
		var Descripcion = connection.escape(req.body.descripcion);
		var id = connection.escape(req.body.id);
		var consulta="";
		if (P_oferta != 'NULL' || Fechaini != 'NULL' || Fechafin != 'NULL' || Id_producto != 'NULL' || Id_tienda != 'NULL' || Foto != 'NULL' || Descripcion != 'NULL') {
			consulta += "UPDATE oferta_usuario SET ";
			var aux=0;
			if (P_oferta != 'NULL') {
				if (aux!=0) {
					consulta += " , ";
					aux--;
				}
				consulta += "P_oferta_oferta_usuario="+P_oferta;
				aux++;

			}
			if (Fechaini != 'NULL') {
				if (aux!=0) {
					consulta += " , ";
					aux--;
				}
				consulta += "Fecha_inicio_oferta_usuario="+Fechaini;
				aux++;
			}
			if (Fechafin != 'NULL') {
				if (aux!=0) {
					consulta += " , ";
					aux--;
				}
				consulta += "Fecha_fin_oferta_usuario="+Fechafin;
				aux++;
			}
			if (Id_producto != 'NULL') {
				if (aux!=0) {
					consulta += " , ";
					aux--;
				}
				consulta += "Id_producto_tienda_oferta_usuario="+Id_producto;
				aux++;
			}
			if (Id_tienda != 'NULL') {
				if (aux!=0) {
					consulta += " , ";
					aux--;
				}
				consulta += "Id_tienda_oferta_usuario="+Id_tienda;
				aux++;
			}
			if (Foto != 'NULL') {
				if (aux!=0) {
					consulta += " , ";
					aux--;
				}
				consulta += "Foto_oferta_usuario="+Foto;
				aux++;
			}
			if (Descripcion != 'NULL') {
				if (aux!=0) {
					consulta += " , ";
					aux--;
				}
				consulta += "Descripcion_oferta_usuario="+Descripcion;
				aux++;
			}
			consulta += " WHERE Id_oferta_usuario="+id+";";
		}
		/*
		for(var i=0;i<bajausuario.length;i++){
			consulta += "UPDATE usuario_ofertados SET Eliminado_usuario_ofertados = '1' WHERE Id_usuario_usuarios_ofertados="+bajausuario[i].Id_usuario_tienda+";";
			console.log(consulta);				
		}
		var consulta2 = "INSERT INTO usuario_ofertados (Id_usuario_usuarios_ofertados, Id_oferta_usuario_usuarios_ofertados, Estado_usuarios_ofertados, Eliminado_usuarios_ofertados) VALUES ";
		for (var index = 0; index < altausuarios.length; index++) {
			if (index==0) {
				consulta2+= "('"+altausuarios[index]+"', "+id+", '1', '0')";	
			}else if(index==Usuarios.length-1){
				consulta2+= ", ('"+altausuarios[index]+"', "+id+", '1', '0');";
			}else{
				consulta2+= ", ('"+altausuarios[index]+"', "+id+", '1', '0') ";
			}
		}
		*/
		connection.query(consulta,function(err, rows, fields){
			if(err){
				console.log("Error en la query...");
				htmlerror(err); 					return res.status(400).json({ error: err });
			}else{
				console.log("Oferta actualizada correctamente");
				data["Ofertas"] = "Ofertas actualizadas correctamente";
				return res.status(200).json(data);  
			}
		});	
		connection.release();
			
	});
});
//Funcion que actuliza el estado de los productos
router.put('/ofertaProducto',comprobacionjwt,function(req,res){

	db.getConnection(function(err, connection) {
		if (err) throw err;
		var data = {
			"Ofertas":"",
			"Registros":""
		};	
		var altausuario = req.body.altausuario;
		var bajausuario = req.body.bajausuario;
		var P_oferta = connection.escape(req.body.p_oferta);
		var Fechaini = connection.escape(req.body.fechaini);
		var Fechafin = connection.escape(req.body.fechafin);
		var Id_producto = connection.escape(req.body.id_producto);
		var Id_tienda = connection.escape(req.body.id_tienda);
		var Foto = connection.escape(req.body.foto);
		var Descripcion = connection.escape(req.body.descripcion);
		var Estado = connection.escape(req.body.estado);
		var Eliminado = connection.escape(req.body.eliminado);
		var id = connection.escape(req.body.id);
		var NumeroUsos = connection.escape(req.body.numero_usos);
		var consulta="";
		if (P_oferta != 'NULL' || Fechaini != 'NULL' || Fechafin != 'NULL' || Id_producto != 'NULL' || Id_tienda != 'NULL' || Foto != 'NULL' || Descripcion != 'NULL' || Estado != 'NULL' || Eliminado != 'NULL' || NumeroUsos != 'NULL') {
			consulta += "UPDATE oferta_producto SET ";
			var aux=0;
			if (P_oferta != 'NULL') {
				if (aux!=0) {
					consulta += " , ";
					aux--;
				}
				consulta += "P_oferta_oferta_producto="+P_oferta;
				aux++;

			}
			if (Fechaini != 'NULL') {
				if (aux!=0) {
					consulta += " , ";
					aux--;
				}
				consulta += "Fecha_inicio_oferta_producto="+Fechaini;
				aux++;
			}
			if (Fechafin != 'NULL') {
				if (aux!=0) {
					consulta += " , ";
					aux--;
				}
				consulta += "Fecha_fin_oferta_producto="+Fechafin;
				aux++;
			}
			if (Id_producto != 'NULL') {
				if (aux!=0) {
					consulta += " , ";
					aux--;
				}
				consulta += "Id_producto_tienda_oferta_producto="+Id_producto;
				aux++;
			}
			if (Id_tienda != 'NULL') {
				if (aux!=0) {
					consulta += " , ";
					aux--;
				}
				consulta += "Id_tienda_oferta_producto="+Id_tienda;
				aux++;
			}
			if (Foto != 'NULL') {
				if (aux!=0) {
					consulta += " , ";
					aux--;
				}
				consulta += "Foto_oferta_producto="+Foto;
				aux++;
			}
			if (Descripcion != 'NULL') {
				if (aux!=0) {
					consulta += " , ";
					aux--;
				}
				consulta += "Descripcion_oferta_producto="+Descripcion;
				aux++;
			}
			if (NumeroUsos != 'NULL') {
				if (aux!=0) {
					consulta += " , ";
					aux--;
				}
				consulta += "Limite_uso_oferta_producto="+NumeroUsos;
				aux++;
			}
			if (Estado != 'NULL') {
				if (aux!=0) {
					consulta += " , ";
					aux--;
				}
				consulta += "Estado_oferta_producto="+Estado;
				aux++;
			}
			if (Eliminado != 'NULL') {
				if (aux!=0) {
					consulta += " , ";
					aux--;
				}
				consulta += "Eliminado_oferta_producto="+Eliminado;
				aux++;
			}
			consulta += " WHERE Id_oferta_producto="+id+";";
		}
		console.log(consulta);
		connection.query(consulta,function(err, rows, fields){
			if(err){
				console.log("Error en la query...");
				htmlerror(err); 					return res.status(400).json({ error: err });
			}else{
				console.log("Oferta actualizada correctamente");
				data["Ofertas"] = "Ofertas actualizadas correctamente";
				return res.status(200).json(data);  
			}
		});	
		connection.release();
			
	});
});


//Borra un array de ofertas de Usuario
router.put('/deleteOfertasUsuario',comprobacionjwt,function(req,res){
	//UPDATE `oferta_usuario` SET `Eliminado_oferta_usuario` = '1' WHERE `Id_oferta_usuario` = 1
	db.getConnection(function(err, connection) {
		if (err) throw err;	
		var ofertas = req.body.ofertas;
		console.log("Entra en el put de deleteOfertasUsuario");
	error=false;
	for(var i=0;i<ofertas.length;i++){
			var consulta = "UPDATE oferta_usuario SET Eliminado_oferta_usuario = '1' WHERE Id_oferta_usuario="+ofertas[i];
			console.log(consulta);
			connection.query(consulta,function(err, rows, fields){
				if(err){
					error=true;
					//htmlerror(err); 					return res.status(400).json({ error: err });
					i=ofertas.length;
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

//Borra un array de ofertas de Usuario
router.put('/recuperarOfertasUsuario',comprobacionjwt,function(req,res){
	//UPDATE `oferta_usuario` SET `Eliminado_oferta_usuario` = '1' WHERE `Id_oferta_usuario` = 1
	db.getConnection(function(err, connection) {
		if (err) throw err;	
		var ofertas = req.body.ofertas;
		console.log("Entra en el put de recuperarOfertasUsuario");
	error=false;
	for(var i=0;i<ofertas.length;i++){
			var consulta = "UPDATE oferta_usuario SET Eliminado_oferta_usuario = '0' WHERE Id_oferta_usuario="+ofertas[i];
			console.log(consulta);
			connection.query(consulta,function(err, rows, fields){
				if(err){
					error=true;
					//htmlerror(err); 					return res.status(400).json({ error: err });
					i=ofertas.length;
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