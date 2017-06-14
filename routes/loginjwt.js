var express = require('express');
var router = express.Router();
var db = require('../helpers/database')();
var comprobacionjwt= require ('../helpers/comprobacionjwt');
var jwt =require("jsonwebtoken");
var mySecretKey=process.env.JWT_SECRETKEY;
var htmlerror= require ('../emails/htmlerror');
var nodemailer = require('nodemailer');
const nodemailerDkim = require('nodemailer-dkim');
//Metodo login 
router.post("/", function(req,res,next){
    db.getConnection(function(err, connection) {    
        if (err) throw err;
        var username =connection.escape(req.body.username);
        var password =connection.escape(req.body.password);
        console.log("username es "+username);
        console.log("password es "+password);
        //llamamos a la base de datos para ver si el usuario es correcto o no 
        var consulta="SELECT * from usuario where Email_usuario="+username+" and Contra_usuario=md5("+password+")";
        console.log(consulta);
        connection.query(consulta, function(err, rows, fields) {
            if(err){
                console.log(err); 
                htmlerror(err); 					return res.status(400).json({ error: err });
            }else{
                if(rows!=null && rows.length != 0){ //si es correcto
                    var user=rows[0];
                    console.log(user);
                    var token= jwt.sign({//firmamos el token , que caduca en 7 dias
                        data: user
                    }, mySecretKey, { expiresIn: '168h' });

                    return res.status(200).json({token,user});  //lo enviamos
                }else{
                    return res.status(401).json("El usuario no existe");
                }
            }
        });
    connection.release();
    });
});

//Para Facebook
router.post("/facebook", function(req,res,next){
    db.getConnection(function(err, connection) {    
        if (err) throw err;
        var username =connection.escape(req.body.username);
        var password =connection.escape(req.body.password);
        console.log("username es "+username);
        console.log("password es "+password);
        //llamamos a la base de datos para ver si el usuario es correcto o no 
        var consulta="SELECT * from usuario where Email_usuario="+username;
        console.log(consulta);
        connection.query(consulta, function(err, rows, fields) {
            if(err){
                console.log(err); 
                htmlerror(err); 					return res.status(400).json({ error: err });
            }else{
                if(rows!=null && rows.length != 0){ //si es correcto
                    var user=rows[0];
                    console.log(user);
                    var token= jwt.sign({//firmamos el token , que caduca en 7 dias
                        data: user
                    }, mySecretKey, { expiresIn: '168h' });

                    return res.status(200).json({token,user});  //lo enviamos
                }else{
                    return res.status(401).json("El usuario no existe");
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
        var consulta="SELECT * FROM usuario JOIN usuario_admin_tienda ON Id_usuario_usuario_admin_tienda=Id_usuario JOIN tienda ON Id_tienda_usuario_admin_tienda=Id_tienda  WHERE Email_usuario="+username+" AND Contra_usuario=md5("+password+") AND Rol_usuario='1'";//Esto tienes que controlarlo con el md5
        console.log(consulta);
        connection.query(consulta, function(err, rows, fields) {
            if(err){
                console.log(err); 
                htmlerror(err); 					return res.status(400).json({ error: err });
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


//info (devuelve el objeto del token)
router.post("/info", comprobacionjwt, function(req, res, next){
    console.log("Entramos en post de info");
    return res.status(200).json(req.objeto_token);
});

module.exports = router;
