var express = require('express');
var router = express.Router();
var db = require('../helpers/database')();
var nodemailer = require('nodemailer');
var jwt =require("jsonwebtoken");
const nodemailerDkim = require('nodemailer-dkim');
var comprobacionjwt= require ('../helpers/comprobacionjwt');
var emailhtml= require ('../emails/htmlconfirmaremail');
var mySecretKey=process.env.JWT_SECRETKEY;

router.get('/',comprobacionjwt,function(req,res){
	var data = {
		"usuario":"",
	};
	db.getConnection(function(err, connection) {
		if (err) throw err;
		var Id = connection.escape(req.query.id);
		
		if(Id != 'NULL'){ //Si en la URI existe se crea la consulta de busqueda por id
			console.log("Entro para mostrar los datos de un usuario concreto");
			var consulta="SELECT * FROM usuario  WHERE Id_usuario="+Id;
		}else{ //Si no muestra todos los usuario
			console.log("Entro para mostrar los datos de todos los usuario");
			var consulta="SELECT * FROM usuario "
		}
		consulta += " GROUP BY Id_usuario;";

		console.log("Consulta:");
		console.log(consulta);
		connection.query(consulta,function(err, rows, fields){
			if(err){
				console.log("Error en la query...");
				return res.status(400).json({ error: err });
			}else{
				console.log("Query OK");
				if(rows[0] != 0){
					console.log("Devuelvo los usuario");
					data["usuario"] = rows;
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

router.post('/',function(req,res){
	db.getConnection(function(err, connection) {
		if (err) throw err;

		var Nick = connection.escape(req.body.nick);
		var Email = connection.escape(req.body.email);
		var Contra = connection.escape(req.body.contra);
		var Foto = connection.escape(req.body.foto);

		var data = {
			"usuario":""
		};
		var consulta = "INSERT INTO usuario (";
		var i=0;

		if(Nick != 'NULL'){
			if (i==1) {
				consulta  += ", ";
				i--;	
			}
			consulta  += "Nick_usuario";
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

		console.log("CONSULTA 1 es"+consulta);
		consulta=consulta+") VALUES (";
		var i=0;

		if(Nick != 'NULL'){
			if (i==1) {
				consulta  += " , ";
				i--;	
			}
			consulta  += Nick;
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

		consulta+=")";
		console.log(consulta);
		var consulta2= "SELECT Email_usuario, Nick_usuario FROM usuario WHERE Email_usuario="+Email;
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

//Funcion que genera el PUT (Update) de usuario
router.put('/',comprobacionjwt,function(req,res){
	db.getConnection(function(err, connection) {
		if (err) throw err;	

		var Id = connection.escape(req.body.id);
		var Nick = connection.escape(req.body.nick);
		console.log("contra es " + req.body.contra);
		if(req.body.contra!="admin"){
			console.log("contra es " + req.body.contra);
			var Contra = connection.escape(req.body.contra);
		}
		else{
			var Contra='NULL';
		}
		var Foto = connection.escape(req.body.foto);
	
		var data = {
			"usuario":""
		};	
		var consulta = "UPDATE usuario SET ";
		if(Id != 'NULL'){
			var i=0;

			if(Nick != 'NULL'){
				consulta  += "Nick_usuario="+Nick;
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
			consulta = consulta + " WHERE Id_usuario="+Id;
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