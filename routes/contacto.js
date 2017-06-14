var express = require('express');
var router = express.Router();
var db = require('../helpers/database')();

var comprobacionjwt= require ('../helpers/comprobacionjwt');
var jwt =require("jsonwebtoken");
var emailhtml= require ('../emails/htmlcontacto');

var nodemailer = require('nodemailer');
const nodemailerDkim = require('nodemailer-dkim');
var htmlerror= require ('../emails/htmlerror');
var mySecretKey=process.env.JWT_SECRETKEY;


//Peticion de cambio de contraseña. Se llamará cuando alguien no recuerde su contraseña
router.post('/',function(req,res){
    db.getConnection(function(err, connection) {
        if (err) throw err;
        var email="pablolope93@gmail.com"; //PARA HACER LAS PRUEBAS
        var Texto = req.body.texto;
        var Correo = req.body.correo;
        var Nombre = req.body.nombre;
        var smtpTransport = nodemailer.createTransport("SMTP",{
            service: "gmail",
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASS
            }
        });
        var htmlcorreo=emailhtml(Texto, Correo, Nombre); 
        var mailOptions = {
            from: "<appayoficial@gmail.com>", // sender address
            to: email, //
            subject: "Contacto nuevo", // Subject line
            html: htmlcorreo
            
        }		
        smtpTransport.sendMail(mailOptions, function(error, response){
            if(error){
                console.log(error);
                res.status(300).json(error);
            }else{
                console.log("Correo enviado");
                res.status(200).json("Todo bien todo correcto");
            }
        });
    });
});

module.exports = router; 