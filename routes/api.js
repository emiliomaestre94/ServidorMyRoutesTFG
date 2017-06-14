var express = require('express');
var router = express.Router();
var db = require('../helpers/database');
var db = db();
var htmlerror= require ('../emails/htmlerror');
var nodemailer = require('nodemailer');
const nodemailerDkim = require('nodemailer-dkim');

//CANTIDAD DE usuario POR LOCALIZACION
//IDEA, MEDIA DE EDAD DE LOS usuario
router.get('/usuario', function(request, response) {
   var query;
   if(requesquery.localidad)  query='SELECT COUNT(*) FROM usuario WHERE localidad_usuario = '+ requesquery.localidad;
   else if (requesquery.comunidad) query='SELECT COUNT(*) FROM usuario WHERE comunidad_usuario = '+ requesquery.comunidad;
   else if (requesquery.provincia) query='SELECT COUNT(*) FROM usuario WHERE provincia_usuario = '+ requesquery.provincia;
   else     query='SELECT COUNT(*) FROM usuario';

    console.log(query);
    db.getConnection(function(err, connection) {
        if (err) throw err;
        connection.query(query, function(err, rows, fields) {
            if (err) {
                console.log('error: ', err);
                throw err;
            }
                response.send([rows]);
        });
        connection.release();
    });
});


//TIENDAS POR LOCALIZACION 
router.get('/tiendas', function(request, response) {
   var query;
   if(requesquery.localidad)  query='SELECT * FROM tienda WHERE localidad_tienda = '+ requesquery.localidad;
   else if (requesquery.comunidad) query='SELECT * FROM tienda WHERE comunidad_tienda = '+ requesquery.comunidad;
   else if (requesquery.provincia) query='SELECT * FROM tienda WHERE provincia_tienda = '+ requesquery.provincia;
   else     query='SELECT * FROM tienda';
    console.log(query);
    db.getConnection(function(err, connection) {
        if (err) throw err;
        connection.query(query, function(err, rows, fields) {
            if (err) {
                console.log('error: ', err);
                throw err;
            }
            response.send([rows]);
        });
        connection.release();
    });   


});


//PRODUCTOS POR LOCALIZACION
router.get('/productos', function(request, response) {
   var query;
   if(requesquery.localidad)  query='SELECT COUNT(id_producto_tienda) FROM producto_tienda, tienda WHERE id_tienda= id_tienda_producto_tienda AND localidad_tienda = '+ requesquery.localidad;
   else if (requesquery.comunidad) query='SELECT COUNT(id_producto_tienda) FROM producto_tienda, tienda WHERE id_tienda= id_tienda AND comunidad_tienda = '+ requesquery.comunidad;
   else if (requesquery.provincia) query='SELECT COUNT(id_producto_tienda) FROM producto_tienda, tienda WHERE id_tienda= id_tienda AND provincia_tienda = '+ requesquery.provincia;
   else     query='SELECT COUNT(*) FROM producto_tienda;';
    console.log(query);
    db.getConnection(function(err, connection) {
        if (err) throw err;
        connection.query(query, function(err, rows, fields) {
            if (err) {
                console.log('error: ', err);
                throw err;
            }
            response.send([rows]);
        });
        connection.release();
    });      
});


//FACTURACION

    //num de facturas 
router.get('/facturacion', function(request, response) {
   var query;
   if(requesquery.mes) query='SELECT COUNT(*) FROM factura WHERE MONTH(fecha_factura) = '+ requesquery.mes;
   else query='SELECT COUNT(*) FROM factura;';
    console.log(query);
    db.getConnection(function(err, connection) {
        if (err) throw err;
        connection.query(query, function(err, rows, fields) {
            if (err) {
                console.log('error: ', err);
                throw err;
            }
            response.send([rows]);
        });
        connection.release();
    });      
});



    //cantidad de dinero facturado
router.get('/facturacion/total', function(request, response) {
   var query;
   if(requesquery.mes) query='  SELECT sum(total_factura) FROM factura WHERE MONTH(fecha_factura) ='+ requesquery.mes;
   else query='SELECT sum(total_factura) FROM factura';
    console.log(query);
    db.getConnection(function(err, connection) {
        if (err) throw err;
        connection.query(query, function(err, rows, fields) {
            if (err) {
                console.log('error: ', err);
                throw err;
            }
            response.send([rows]);
        });
        connection.release();
    });      
});
module.exports = router;