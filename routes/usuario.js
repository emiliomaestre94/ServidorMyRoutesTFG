var express = require('express');
var router = express.Router();
var db = require('../helpers/database')();
var nodemailer = require('nodemailer');
var jwt =require("jsonwebtoken");
const nodemailerDkim = require('nodemailer-dkim');
var comprobacionjwt= require ('../helpers/comprobacionjwt');
var emailhtml= require ('../emails/htmlconfirmaremail');
var mySecretKey=process.env.JWT_SECRETKEY;
/*DEVUELVE usuario si no le pasas parametro te los devuelve todos si le pasas id te devuelve los datos de ese usuario,
 y si le pasas otros parametros te devuelve todos los que tengan ese parametro filtrado*/
router.get('/',comprobacionjwt,function(req,res){
	var data = {
		"usuario":"",
		"Registros":""
	};
	db.getConnection(function(err, connection) {
		if (err) throw err;
		var Id = connection.escape(req.query.id);
		var DNI = connection.escape(req.query.dni);
		var Nombre = connection.escape(req.query.nombre);
		var Email = connection.escape(req.query.email);
		var Sexo = connection.escape(req.query.sexo);
		var Direccion = connection.escape(req.query.direccion);
		var Comunidad = connection.escape(req.query.comunidad);//La comunidad la tienes que pasar con su nombre
		var Provincia = connection.escape(req.query.provincia);//La provincia la tienes que pasar con su nombre
		var Localidad = connection.escape(req.query.Localidad);//La localidad la tienes que pasar con su nombre
		var Fechanac_min = connection.escape(req.query.fechanac_min);
		var Fechanac_max = connection.escape(req.query.fechanac_max);
		var Fecha_min = connection.escape(req.query.fecha_min);
		var Fecha_max = connection.escape(req.query.fecha_max);
		var CP = connection.escape(req.query.cp);
		var Estado = connection.escape(req.query.estado);
		var Eliminado = connection.escape(req.query.eliminado);
		var Telefono = connection.escape(req.query.telefono);
		var Rol = connection.escape(req.query.rol);
		var OrdeNombre = connection.escape(req.query.ordenombre); //Variable que indica sobre que parametro ordenar los usuario en la URI usuario?ordenombre={0 ó 1}
		var OrdeFecha = connection.escape(req.query.ordefecha);//Variable que indica sobre que parametro ordenar las facturas en la URI usuario?ordefecha={0 ó 1}
		var OrdeFechaNac = connection.escape(req.query.ordefechanac);//Variable que indica sobre que parametro ordenar las facturas en la URI usuario?ordefechanac={0 ó 1}
		var OrdeCom = connection.escape(req.query.ordecom); //Variable que indica sobre que parametro ordenar las facturas en la URI usuario?ordecom={0 ó 1}
		var OrdeProv = connection.escape(req.query.ordeprov); //Variable que indica sobre que parametro ordenar las facturas en la URI usuario?ordeprov={0 ó 1}
		var OrdeLoc = connection.escape(req.query.ordeloc); //Variable que indica sobre que parametro ordenar las facturas en la URI usuario?ordeloc={0 ó 1}
		var Pagina = connection.escape(req.query.pagina); //Variable que indica que pagina de facturas estamos que se mostraran de 10 en 10
		var Registros = connection.escape(req.query.registros); //Variable que indica que pagina de facturas estamos que se mostraran de 10 en 10
		var Id_tienda = connection.escape(req.query.id_tienda); //Variable que indica que pagina de facturas estamos que se mostraran de 10 en 10
		if(Id != 'NULL'){ //Si en la URI existe se crea la consulta de busqueda por id
			console.log("Entro para mostrar los datos de un usuario concreto");
			var consulta="SELECT * FROM usuario LEFT JOIN usuario_tienda ON Id_usuario = Id_usuario_usuario_tienda LEFT JOIN tienda ON Id_tienda=Id_tienda_usuario_tienda JOIN tipo_usuario ON Rol_usuario = Id_tipo_usuario WHERE Id_usuario="+Id;
		}else{ //Si no muestra todos los usuario
			console.log("Entro para mostrar los datos de todos los usuario");
			var consulta="SELECT * FROM usuario LEFT JOIN usuario_tienda ON Id_usuario = Id_usuario_usuario_tienda LEFT JOIN tienda ON Id_tienda=Id_tienda_usuario_tienda JOIN tipo_usuario ON Rol_usuario = Id_tipo_usuario"
			var i=0;
			if(Nombre != 'NULL' || DNI != 'NULL' || Sexo != 'NULL' || Email != 'NULL' || Estado != 'NULL' || Eliminado != 'NULL' || Direccion != 'NULL' || Comunidad != 'NULL' || Provincia != 'NULL' || Localidad != 'NULL' || Fechanac_min != 'NULL' || Fechanac_max != 'NULL' || Fecha_min != 'NULL' || Fecha_max != 'NULL' || CP != 'NULL' || Telefono != 'NULL' || Rol != 'NULL'|| Id_tienda != 'NULL' ){
				console.log("Con el parametro:");
				consulta +=" WHERE ";
				if(Nombre != 'NULL'){
					console.log("Nombre:"+Nombre);
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Nombre_usuario LIKE '%"+Nombre.replace(/'/g, "")+"%'";
					i++;
				}
				if(DNI != 'NULL'){
					console.log("DNI:"+DNI);
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "DNI_usuario="+DNI;
					i++;
				}
				if(Email != 'NULL'){
					console.log("Email:"+Email);
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Email_usuario="+Email;
					i++;
				}
				if(Sexo != 'NULL'){
					console.log("Sexo:"+Sexo);
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Sexo_usuario="+Sexo;
					i++;
				}
				if(Estado != 'NULL'){
					console.log("Estado:"+Estado);
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Estado_usuario="+estado;
					i++;
				}
				if(Eliminado != 'NULL'){
					console.log("Eliminado:"+Eliminado);
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Eliminado_usuario="+Eliminado;
					i++;
				}
				if(Direccion != 'NULL'){
					console.log("Direccion:"+Direccion);
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Direccion_usuario LIKE '%"+Direccion.replace(/'/g, "")+"%'";
					i++;
				}
				if(Comunidad != 'NULL'){
					console.log("Comunidad:"+Comunidad);
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Comunidad_usuario="+Comunidad;
					i++;
				}
				if(Provincia != 'NULL'){
					console.log("Provincia:"+Provincia);
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Provincia_usuario="+Comunidad;
					i++;
				}
				if(Localidad != 'NULL'){
					console.log("Localidad:"+Localidad);
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Localidad_usuario="+Comunidad;
					i++;
				}
				if(Telefono != 'NULL'){
					console.log("Telefono:"+Telefono);
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Telefono_usuario<="+Telefono;
					i++;
				}
				if(CP != 'NULL'){
					console.log("CP:"+CP);
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "CP_usuario="+CP;
					i++;
				}
				if(Fechanac_max != 'NULL'){
					console.log("Fechanac_max:"+Fechanac_max);
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Fecha_nac_usuario<="+Fechanac_max;
					i++;
				}
				if(Fechanac_min != 'NULL'){
					console.log("Fechanac_min:"+Fechanac_min);
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Fecha_nac_usuario>="+Fechanac_min;
					i++;
				}
				if(Fecha_max != 'NULL'){
					console.log("Fecha_max:"+Fecha_max);
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Fecha_usuario<="+Fecha_max;
					i++;
				}
				if(Fecha_min != 'NULL'){
					console.log("Fecha_min:"+Fecha_min);
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Fecha_usuario>="+Fecha_min;
					i++;
				}
				if(Rol != 'NULL'){
					console.log("Rol:"+Rol);
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Rol_usuario="+Rol;
					i++;
				}
				if(Id_tienda != 'NULL'){
					console.log("Id_tienda:"+Id_tienda);
					if (i==1) {
						consulta  += " AND ";
						i--;	
					}
					consulta  += "Id_tienda="+Id_tienda;
					i++;
				}
			}
		}
		consulta += " GROUP BY Id_usuario";
		if(OrdeFecha != 'NULL' || OrdeFechaNac != 'NULL' || OrdeNombre != 'NULL' || OrdeCom != 'NULL' || OrdeProv != 'NULL' || OrdeLoc != 'NULL'){
			var orden =0;
			consulta  += " ORDER BY ";
			if(OrdeFecha != 'NULL'){
				if(orden!=0){
					consulta  += " , ";
					orden=orden-1;
				}
				orden=orden+1;
				if (OrdeFecha=="'1'") {
					consulta  += "Fecha_usuario ASC";
				}
				if (OrdeFecha=="'0'") {
					consulta  += "Fecha_usuario DESC";	
				}
			}
			if(OrdeFechaNac != 'NULL'){
				if(orden!=0){
					consulta  += " , ";
					orden=orden-1;
				}
				orden=orden+1;
				if (OrdeFechaNac=="'1'") {
					consulta  += "Fecha_nac_usuario ASC";
				}
				if (OrdeFecha=="'0'") {
					consulta  += "Fecha_nac_usuario DESC";	
				}
			}
			if(OrdeCom != 'NULL'){
				if(orden!=0){
					consulta  += " , ";
					orden=orden-1;
				}
				orden=orden+1;
				if (OrdeCom=="'1'") {
					consulta  += "Comunidad_usuario ASC";
				}
				if (OrdeCom=="'0'") {
					consulta  += "Comunidad_usuario DESC";	
				}
			}
			if(OrdeProv != 'NULL'){
				if(orden!=0){
					consulta  += " , ";
					orden=orden-1;
				}
				orden=orden+1;
				if (OrdeProv=="'1'") {
					consulta  += "Provincia_usuario ASC";
				}
				if (OrdeProv=="'0'") {
					consulta  += "Provincia_usuario DESC";	
				}
			}
			if(OrdeLoc != 'NULL'){
				if(orden!=0){
					consulta  += " , ";
					orden=orden-1;
				}
				orden=orden+1;
				if (OrdeLoc=="'1'") {
					consulta  += "Localidad_usuario ASC";
				}
				if (OrdeLoc=="'0'") {
					consulta  += "Localidad_usuario DESC";	
				}
			}
			if(OrdeNombre != 'NULL'){
				if(orden!=0){
					consulta  += " , ";
					orden=orden-1;
				}
				orden=orden+1;
				if (OrdeNombre=="'1'") {
					consulta  += "  Nombre_usuario ASC";
				}
				if (OrdeNombre=="'0'") {
					consulta  += "  Nombre_usuario DESC";	
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
				console.log("Error en la query...");
				return res.status(400).json({ error: err });
			}else{
				console.log("Query OK");
				if(rows[1].length != 0){
					console.log("Devuelvo los usuario");
					data["Registros"]=rows[0].length;
					data["usuario"] = rows[1];
					return res.status(200).json(data);
				}else{
					data["usuario"] = 'No hay usuario';
					console.log("No hay usuario...");
					return res.status(204).json(data);	
				}
			}
		});
		connection.release();
	});
});
//Funcion que genera el POST de usuario
router.post('/',function(req,res){
	db.getConnection(function(err, connection) {


//var consulta = "SELECT Email_usuario, Nombre_usuario FROM usuario WHERE Email_usuario="+Email;


		if (err) throw err;
		var DNI = connection.escape(req.body.dni);
		var Nombre = connection.escape(req.body.nombre);
		var Email = connection.escape(req.body.email);
		var Direccion = connection.escape(req.body.direccion);
		var Comunidad = connection.escape(req.body.comunidad);
		var Provincia = connection.escape(req.body.provincia);
		var Localidad = connection.escape(req.body.localidad);
		var CP = connection.escape(req.body.cp);
		var Telefono = connection.escape(req.body.telefono);
		var Fecha = connection.escape(req.body.fecha);
		var Sexo = connection.escape(req.body.sexo);
		var Foto = connection.escape(req.body.foto);
		var Contra = connection.escape(req.body.contra);
		var Rol = connection.escape(req.body.rol);

		//PARA PRUEBAS DE DNI
		var DNI =  Math.random();
		console.log("QUE TE ACTUALICES COÑO");
		var data = {
			"usuario":""
		};
		var consulta = "INSERT INTO usuario (";
		var i=0;
		if(DNI != 'NULL'){
			consulta  += "DNI_usuario";
			i++;
		}
		if(Nombre != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Nombre_usuario";
			i++;
		}
		if(Email != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Email_usuario";
			i++;
		}
		if(Direccion != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Direccion_usuario";
			i++;
		}
		if(Comunidad != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Comunidad_usuario";
			i++;
		}
		if(Provincia != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Provincia_usuario";
			i++;
		}
		if(Localidad != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Municipio_usuario";
			i++;
		}
		if(CP != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "CP_usuario";
			i++;
		}
		if(Telefono != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Telefono_usuario";
			i++;
		}
		if(Fecha != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Fecha_nac_usuario";
			i++;
		}
		if(Sexo != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Sexo_usuario";
			i++;
		}
		if(Foto != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Foto_usuario";
			i++;
		}
		if(Contra != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Contra_usuario";
			i++;
		}
		if(Rol != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Rol_usuario";
			i++;
		}
		console.log("CONSULTA 1 es"+consulta);
		consulta=consulta+", Estado_usuario , Eliminado_usuario) VALUES (";
		var i=0;
		if(DNI != 'NULL'){
			consulta  += DNI;
			i++;
		}
		if(Nombre != 'NULL'){
			if (i==1) {
				consulta  += " , ";
				i--;	
			}
			consulta  += Nombre;
			i++;
		}
		if(Email != 'NULL'){
			if (i==1) {
				consulta  += " , ";
				i--;	
			}
			consulta  += Email;
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
		if(Comunidad != 'NULL'){
			if (i==1) {
				consulta  += " , ";
				i--;	
			}
			consulta  += Comunidad;
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
		if(CP != 'NULL'){
			if (i==1) {
				consulta  += " , ";
				i--;	
			}
			consulta  += CP;
			i++;
		}
		if(Telefono != 'NULL'){
			if (i==1) {
				consulta  += " , ";
				i--;	
			}
			consulta  += Telefono;
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
		if(Contra != 'NULL'){
			if (i==1) {
				consulta  += " , ";
				i--;	
			}
			consulta  += "md5("+Contra+")";
			i++;
		}
		if(Rol != 'NULL'){
			if (i==1) {
				consulta  += " , ";
				i--;	
			}
			consulta  += Rol;
			i++;
		}
		consulta+=",'1','0')";
		console.log(consulta);
		var consulta2= "SELECT Email_usuario, Nombre_usuario FROM usuario WHERE Email_usuario="+Email;
		connection.query(consulta2,function(err, rows, fields){
			if(err){
                console.log(err); 
                return res.status(400).json({ error: err });
            }else{
                if(rows == 0){ // Usuario NO encontrado
					connection.query(consulta,function(err, rows, fields){
						if(err){
							console.log(err);
							return res.status(400).json({ error: err });
						}else{
							data["usuario"] = "Datos insertados correctamente!";
							//enviarContrasenya(req.body.email);
							console.log("Todo ok");                                                                                                                                                                                                                                                                                                                                                                                                                                                           
							return res.status(200).json(data);
						}
					});
					//connection.release();
                }else{ //usuario encontrado
                    console.log("Usuario encontrado"); 
                    return res.status(401).json("El usuario YA existe");   
                }
            }
		});
	connection.release();


	});
});

function enviarContrasenya(email){
	console.log("Entras a enviarContrasenya");
	console.log("El email es "+email);
    var token= jwt.sign({//firmamos el token , que caduca en 24 horas
         data: email
        }, mySecretKey, { expiresIn: '24h' });
	var smtpTransport = nodemailer.createTransport("SMTP",{
		service: "gmail",
		auth: {
			user: process.env.GMAIL_USER,
			pass: process.env.GMAIL_PASS
		} 
	});
	var htmlcorreo=emailhtml(token,email); 
	var mailOptions = {
		from: "<appayoficial@gmail.com>", // sender address
		to: email, //
		subject: "Confirmar registro Appay", // Subject line	
		html: htmlcorreo
	}		
	smtpTransport.sendMail(mailOptions, function(error, response){
		if(error){
			console.log(error);
			//res.status(300).json(error);
		}else{
			console.log("Correo enviado");
			//res.status(200).json("Todo bien todo correcto");
		}
	});
}

//Funcion que genera el PUT (Update) de usuario
router.put('/',comprobacionjwt,function(req,res){
	db.getConnection(function(err, connection) {
		if (err) throw err;	
		var ID = connection.escape(req.body.id);
		var DNI = connection.escape(req.body.dni);
		var Nombre = connection.escape(req.body.nombre);
		var Email = connection.escape(req.body.email);
		var Direccion = connection.escape(req.body.direccion);
		var Comunidad = connection.escape(req.body.comunidad);
		var Provincia = connection.escape(req.body.provincia);
		var Localidad = connection.escape(req.body.localidad);
		var CP = connection.escape(req.body.cp);
		var Telefono = connection.escape(req.body.telefono);
		var Foto = connection.escape(req.body.foto);
		var Sexo = connection.escape(req.body.sexo);
		var Fecha = connection.escape(req.body.fecha);
		var Contra = connection.escape(req.body.contra);
		var Rol = connection.escape(req.body.rol);
		var Estado = connection.escape(req.body.estado);
		var Eliminado = connection.escape(req.body.eliminado);
		var data = {
			"usuario":""
		};	
		var consulta = "UPDATE usuario SET ";
		if(ID != 'NULL'){
			var i=0;
			if(DNI != 'NULL'){
				consulta  += "DNI_usuario="+DNI;
				i++;
			}
			if(Nombre != 'NULL'){
				if (i==1) {
					consulta  += " , ";
					i--;	
				}
				consulta  += "Nombre_usuario="+Nombre;
				i++;
			}
			if(Email != 'NULL'){
				if (i==1) {
					consulta  += " , ";
					i--;	
				}
				consulta  += "Email_usuario="+Email;
				i++;
			}
			if(Direccion != 'NULL'){
				if (i==1) {
					consulta  += " , ";
					i--;	
				}
				consulta  += "Direccion_usuario="+Direccion;
				i++;
			}
			if(Comunidad != 'NULL'){
				if (i==1) {
					consulta  += " , ";
					i--;	
				}
				consulta  += "Comunidad_usuario="+Comunidad;
				i++;
			}
			if(Provincia != 'NULL'){
				if (i==1) {
					consulta  += " , ";
					i--;	
				}
				consulta  += "Provincia_usuario="+Provincia;
				i++;
			}
			if(Localidad != 'NULL'){
				if (i==1) {
					consulta  += " , ";
					i--;	
				}
				consulta  += "Localidad_usuario="+Localidad;
				i++;
			}
			if(CP != 'NULL'){
				if (i==1) {
					consulta  += " , ";
					i--;	
				}
				consulta  += "CP_usuario="+CP;
				i++;
			}
			if(Telefono != 'NULL'){
				if (i==1) {
					consulta  += " , ";
					i--;	
				}
				consulta  += "Telefono_usuario="+Telefono;
				i++;
			}
			if(Sexo != 'NULL'){
				if (i==1) {
					consulta  += " , ";
					i--;	
				}
				consulta  += "Sexo_usuario="+Sexo;
				i++;
			}
			if(Fecha != 'NULL'){
				if (i==1) {
					consulta  += " , ";
					i--;	
				}
				consulta  += "Fecha_nac_usuario="+Fecha;
				i++;
			}
			if(Foto != 'NULL'){
				if (i==1) {
					consulta  += " , ";
					i--;	
				}
				consulta  += "Foto_usuario="+Foto;
				i++;
			}
			if(Contra != 'NULL'){
				if (i==1) {
					consulta  += " , ";
					i--;	
				}
				consulta  += "Contra_usuario=md5("+Contra+")";;
				i++;
			}
			if(Rol != 'NULL'){
				if (i==1) {
					consulta  += " , ";
					i--;	
				}
				consulta  += "Rol_usuario="+Rol;
				i++;
			}	
			if(Estado != 'NULL'){
				if (i==1) {
					consulta  += " , ";
					i--;	
				}
				consulta  += "Estado_usuario="+Estado;
				i++;
			}	
			if(Eliminado != 'NULL'){
				if (i==1) {
					consulta  += " , ";
					i--;	
				}
				consulta  += "Eliminado_usuario="+Eliminado;
				i++;
			}	
			consulta = consulta + " WHERE Id_usuario="+ID;
		}
		console.log(consulta);
		connection.query(consulta,function(err, rows, fields){
			if(err){
				return res.status(400).json({ error: err });
			}else{
				data["usuario"] = "Actualizado correctamente!";
				return res.status(200).json(data);
			}
		});
		connection.release();
	});
});

//Se añade un usuario a una tienda, cuando pase por el codigo QR
router.get('/entraTienda',function(req,res){
	db.getConnection(function(err, connection) {
		if (err) throw err;	
		var Id_usuario = connection.escape(req.query.id_usuario);
		var Id_tienda = connection.escape(req.query.id_tienda);
		var data = {
			"usuario":"",
			"Tiendas":""
		};
		var preconsulta = "SELECT * FROM tienda WHERE Id_Tienda="+Id_tienda+";SELECT * FROM usuario_tienda WHERE Id_usuario_usuario_tienda="+Id_usuario+" AND Id_tienda_usuario_tienda="+Id_tienda;
		var consulta = "INSERT INTO usuario_tienda (Id_tienda_usuario_tienda, Id_usuario_usuario_tienda, Estado_usuario_tienda, Eliminado_usuario_tienda) VALUES("+Id_tienda+","+Id_usuario+", '1','0');";
		console.log(preconsulta);
		console.log(consulta);
		connection.query(preconsulta,function(err, rows, fields){
			if(err){
				return res.status(400).json({ usuario: err });
				console.log(err);
			}else{
				if(rows[0].length != 0){
					data["Tiendas"] = rows[0];
					console.log("La tienda existe ");
					if (rows[1].length == 0) {
						console.log("La tienda existe ");	
						connection.query(consulta+"UPDATE tienda SET Numero_usuarios_tienda = Numero_usuarios_tienda+1, Numero_usuarios_hora_tienda = Numero_usuarios_hora_tienda+1, Numero_usuarios_dia_tienda = Numero_usuarios_dia_tienda+1, Numero_usuarios_semana_tienda = Numero_usuarios_semana_tienda+1, Numero_usuarios_mes_tienda = Numero_usuarios_mes_tienda+1  WHERE Id_tienda="+Id_tienda+";",function(err, rows, fields){
							if(err){
								return res.status(400).json({ usuario: err });
								console.log(err);
							}else{
								if(rows != 0){
									data["usuario"] = "La tienda existe y añado al usuario a la tienda e incremento";
									return res.status(200).json(data);					
								}else{
									data["usuario"] = "El usuario no existe o la tienda no existe";
									return res.status(204).json(data);
								}
							}
						});
					}else{
						return res.status(200).json(data);					
					}
				}else{
					data["usuario"] = "El usuario no existe o la tienda no existe";
					return res.status(204).json(data);
				}
			}
		});
	connection.release();
	});
});

//Se asigna una tienda a un usuario de tipo administrador
router.post('/usuarioAdminTienda',function(req,res){
	db.getConnection(function(err, connection) {
		if (err) throw err;	
		var Id_usuario = connection.escape(req.body.id_usuario);
		var Id_tienda = connection.escape(req.body.id_tienda);
		var data = {
			"usuario":""
		};
		var consulta = "INSERT INTO usuario_admin_tienda (id_tienda_usuario_admin_tienda, id_usuario_usuario_admin_tienda, Estado_usuario_admin_tienda, Eliminado_usuario_admin_tienda) VALUES("+Id_tienda+","+Id_usuario+",'1','0')";
			connection.query(consulta,function(err, rows, fields){
				if(err){
					return res.status(400).json({ usuario: err });
					console.log(err);
				}else{
					if(rows != 0){
						data["usuario"] = "Administrador vinculado a la tienda";
						return res.status(200).json(data);					
					}else{
						data["usuario"] = "El usuario no existe o la tienda no existe";
						return res.status(204).json(data);
					}
				}
			});
	connection.release();
	});
});
//DEVUELVE usuario, o todos o id='n'
router.get('/adminTienda',comprobacionjwt,function(req,res){
	var data = {
		"usuario":""
	};
	db.getConnection(function(err, connection) {
		if (err) throw err;
		var id = connection.escape(req.query.id);
		var consulta = "SELECT Id_usuario, DNI_usuario, Nombre_usuario, Email_usuario, Direccion_usuario, Comunidad_usuario, Provincia_usuario, Localidad_usuario, CP_usuario, Telefono_usuario, Foto_usuario, Nombre_rol, Estado_usuario, Eliminado_usuario, Fecha_usuario  FROM usuario_admin_tienda TA JOIN usuario u ON Id_usuario = TA.id_usuario_usuario_admin_tienda JOIN tipo_usuario t ON Rol_usuario = Id_tipo_usuario;";
		connection.query(consulta,function(err, rows, fields){
			if(err){
				return res.status(400).json({ usuario: err });
				console.log(err);
			}else{
				if(rows != 0){
					data["usuario"] = rows;
					return res.status(200).json(data);					
				}else{
					data["usuario"] = "El usuario no existen usuarios";
					return res.status(204).json(data);
				}
			}
		});
		connection.release();
	});
});


//Metodo login para admin
router.post("/admin", function(req,res,next){
    db.getConnection(function(err, connection) {    
        if (err) throw err;
        var username =connection.escape(req.body.username);
        var password =connection.escape(req.body.password);
        console.log("username es "+username);
        console.log("password es "+password);
        //llamamos a la base de datos para ver si el usuario es correcto o no 
        var consulta="SELECT Nombre_usuario, Id_usuario, Foto_usuario, Id_tienda, Nombre_tienda, Logo_tienda from usuario, tienda, usuario_admin_tienda WHERE Email_usuario="+username+" AND Id_usuario_usuario_admin_tienda=Id_usuario AND Id_tienda_usuario_admin_tienda=Id_tienda AND Contra_usuario=md5("+password+")";//Esto tienes que controlarlo con el md5
        console.log(consulta);
        connection.query(consulta, function(err, rows, fields) {
            if(err){
                console.log(err); 
                return res.status(400).json({ error: err });
            }else{
                if(rows!=null && rows.length != 0){ //si es correcto
                    var user=rows[0];
                    console.log(user);
                    var token= jwt.sign({//firmamos el token , que caduca en 7 dias
                        data: user
                    }, mySecretKey, { expiresIn: '168h' });

                    return res.status(200).json(token);  //lo enviamos
                }else{
                    return res.status(401).json("El usuario no existe");
                }
            }
        });
    connection.release();
    });
}); 



//Metodo que comprueba si una contraseña es correcta o no
router.post("/checkPassword", function(req,res,next){
    db.getConnection(function(err, connection) {    
        if (err) throw err;
        var id =connection.escape(req.body.id);
        var password =connection.escape(req.body.password);
		console.log("entra en updatePassword");
		console.log(id);
		console.log(password);
        //llamamos a la base de datos para ver si el usuario es correcto o no 
        var consulta="SELECT Contra_usuario from usuario WHERE Id_usuario="+id+" AND Contra_usuario=md5("+password+")";//Esto tienes que controlarlo con el md5
        console.log(consulta);
        connection.query(consulta, function(err, rows, fields) {
			if(err){
				console.log("Error en la query...");
				return res.status(400).json({ error: err });
			}else{
				console.log("Query OK");
				if(rows.length != 0){
					console.log("Devuelvo los usuario");
					data = rows;
					return res.status(200).json(data);
				}else{
					console.log("contraseña no correcta");
					return res.status(204).json("La contraseña no es la correcta");	
				}
			}
        });
    connection.release();
    });
}); 

//Metodo login para admin
router.post("/updateToken", function(req,res,next){
    db.getConnection(function(err, connection) {    
        if (err) throw err;
        var username =connection.escape(req.body.username);
        var password =connection.escape(req.body.password);
        console.log("username es "+username);
        console.log("password es "+password);
        //llamamos a la base de datos para ver si el usuario es correcto o no 
        var consulta="SELECT Nombre_usuario, Id_usuario, Foto_usuario, Id_tienda, Nombre_tienda, Logo_tienda from usuario, tienda, usuario_admin_tienda WHERE Email_usuario="+username+" AND Id_usuario_usuario_admin_tienda=Id_usuario AND Id_tienda_usuario_admin_tienda=Id_tienda AND Contra_usuario="+password;//Esto tienes que controlarlo con el md5
        console.log(consulta);
        connection.query(consulta, function(err, rows, fields) {
            if(err){
                console.log(err); 
                return res.status(400).json({ error: err });
            }else{
                if(rows!=null && rows.length != 0){ //si es correcto
                    var user=rows[0];
                    console.log(user);
                    var token= jwt.sign({//firmamos el token , que caduca en 7 dias
                        data: user
                    }, mySecretKey, { expiresIn: '168h' });

                    return res.status(200).json(token);  //lo enviamos
                }else{
                    return res.status(401).json("El usuario no existe");
                }
            }
        });
    connection.release();
    });
}); 

//Funcion que genera el PUT (Update) de usuario
router.put('/updateState',comprobacionjwt,function(req,res){
	db.getConnection(function(err, connection) {
		if (err) throw err;	
		var usuario = req.body.usuario;
		console.log("Entra en el put de updateState");
		var consulta="";		
		for(var i=0;i<usuario.length;i++){
			consulta += "UPDATE usuario SET Eliminado_usuario = '"+usuario[i].Eliminado_usuario+"' WHERE Id_usuario="+usuario[i].Id_usuario+";";
		}
		console.log(consulta);
		connection.query(consulta,function(err, rows, fields){
			if(err){
                console.log(err); 
                return res.status(400).json({ error: err });
            }else{
				return res.status(200).json("Actualizado correctamente");
            }	
		});	
		connection.release();	
	});
});




module.exports = router;