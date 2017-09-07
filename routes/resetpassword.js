var express = require('express');
var router = express.Router();
var db = require('../helpers/database')();

var comprobacionjwt= require ('../helpers/comprobacionjwt');
var jwt =require("jsonwebtoken");
var emailhtml= require ('../emails/htmlresetpassword');
var emailhtmlmovil= require ('../emails/htmlresetpasswordmovil');
var emailbienvenida= require ('../emails/htmlbienvenida');
var nodemailer = require('nodemailer');
const nodemailerDkim = require('nodemailer-dkim');
var htmlerror= require ('../emails/htmlerror');
var mySecretKey=process.env.JWT_SECRETKEY;


//Peticion de cambio de contraseña. Se llamará cuando alguien no recuerde su contraseña
router.post('/',function(req,res){
    var encontrado=false; 
    //req.body.email="emiliomaestre94@gmail.com"; //PARA HACER LAS PRUEBAS
    
    db.getConnection(function(err, connection) {
        if (err) throw err;
		var Email = connection.escape(req.body.email);
        console.log(Email);
		var consulta = "SELECT Email_usuario, Nick_usuario FROM usuario WHERE Email_usuario="+Email+";";
		connection.query(consulta,function(err, rows, fields){
			if(err){
                console.log(err); 
                htmlerror(err); 					
                return res.status(400).json({ error: err });
            }else{
                if(rows != 0){ // Si que lo ha encontrado
                    var nickUsu= rows[0].Nick_usuario;
                    var randomstring = Math.random().toString(36).slice(-8);
                    consulta2="UPDATE usuario SET Contra_usuario=md5("+connection.escape(randomstring)+") WHERE Email_usuario="+Email+";";
                    console.log(consulta2);
                    connection.query(consulta2,function(err, rows, fields){ 
                        if(err){
                            console.log(err); 
                            htmlerror(err); 					
                            return res.status(400).json({ error: err });
                        }else{                     
                            console.log("Usuario encontrado");
            
                            var token= jwt.sign({//firmamos el token , que caduca en 24 horas
                                data: req.body.email
                                }, mySecretKey, { expiresIn: '24h' });

                            var smtpTransport = nodemailer.createTransport("SMTP",{
                                service: "gmail",
                                auth: {
                                    user: process.env.GMAIL_USER, 
                                    pass: process.env.GMAIL_PASS
                                }
                            });
                                
                                var htmlcorreo=emailhtmlmovil(token, nickUsu,randomstring); 
                                var mailOptions = {
                                    from: "<myroutesoficial@gmail.com>", // sender address
                                    to: req.body.email, //
                                    subject: "Restablecer contraseña MyRoutes", // Subject line
                                    html: htmlcorreo
                                }
                                
                                smtpTransport.sendMail(mailOptions, function(error, response){
                                    if(error){
                                        console.log(error);
                                        htmlerror(err); 					return res.status(400).json(error);
                                    }else{
                                        console.log("Correo enviado");
                                        return res.status(200).json("Todo bien todo correcto");
                                    }
                                });
                        }//fin else
                     });




                }else{
                    console.log("Usuario no encontrado"); 
                    return res.status(204).json("El usuario no existe");   
                }
            }
		});
	connection.release();
	});
});

//Peticion de cambio de contraseña. Se llamará cuando alguien no recuerde su contraseña
router.post('/bienvenida',function(req,res){

    var token= jwt.sign({//firmamos el token , que caduca en 24 horas
        data: req.body.email
        }, mySecretKey, { expiresIn: '24h' });

    var smtpTransport = nodemailer.createTransport("SMTP",{
        service: "gmail",
        auth: {
            user: process.env.GMAIL_USER, 
            pass: process.env.GMAIL_PASS
        }
    });

    var htmlcorreo=emailbienvenida(token, req.body.email); 
    var mailOptions = {
        from: "<myroutesoficial@gmail.com>", // sender address
        to: req.body.email, //
        subject: "Bienvenido a MyRoutes", // Subject line
        html: htmlcorreo
    }
    		
    smtpTransport.sendMail(mailOptions, function(error, response){
        if(error){
            console.log(error);
            htmlerror(err); 					
            return res.status(400).json(error);
        }else{
            console.log("Correo enviado");
            return res.status(200).json("Todo bien todo correcto");
        }
    });
                
});







//Este get se llamara desde el cliente para ver si el token es correcto
router.get('/',function(req,res){
    var token = req.body.token;
    jwt.verify(token, mySecretKey, function(error, decoded) //verificamos que el token es correcto
    {
        if(error)
        {
            console.log(error);
            return res.status(401).json(error); //error, acceso no autorizado
        }
        else
        {
            console.log("Token correcto");
            return res.status(200).json(token); //en este momento guardaremos id_token en sesion
        }
    });       
});



// PUT de cambiar contraseña (COMPROBAR)
router.put('/',comprobacionjwt,function(req,res){
	db.getConnection(function(err, connection) {
		if (err) throw err;	
		var Contra = connection.escape(req.body.contra);
        //var email=req.objeto_token;
        var email=connection.escape(req.objeto_token.data);
        console.log(email);
		var data = {
			"Usuario":""
		};

        var consulta = "UPDATE usuario SET Contra_usuario=md5("+Contra+") Where Email_usuario="+email;
			
        console.log(consulta);
        connection.query(consulta,function(err, rows, fields){
            if(err){
                htmlerror(err); 					return res.status(400).json({ error: err });
            }else{
                data["Usuario"] = "Actualizado correctamente!";
                return res.status(200).json(data["Usuario"]);
            }
           // res.json(data);
        });
	connection.release();
	});
});

 
module.exports = router; 