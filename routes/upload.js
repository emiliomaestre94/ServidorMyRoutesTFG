var express = require('express');
var router = express.Router();
var db = require('../helpers/database')();
var htmlerror= require ('../emails/htmlerror');
var nodemailer = require('nodemailer');
const nodemailerDkim = require('nodemailer-dkim');


router.get('/',function(req,res){
	db.getConnection(function(err, connection) {
        if (err) throw err;
        var aux = req.query.aux;
        console.log(aux);
        switch (aux) {
            case '1':
                var consulta="UPDATE tienda SET Numero_usuarios_hora_tienda = 0;UPDATE tienda SET Total_ventas_hora_tienda = 0;UPDATE tienda SET Numero_facturas_hora_tienda = 0;UPDATE tienda SET Numero_usuarios_compran_hora_tienda = 0;";		
                break;
            case '2':
                var consulta="UPDATE tienda SET Numero_usuarios_dia_tienda = 0;UPDATE tienda SET Total_ventas_dia_tienda = 0;UPDATE tienda SET Numero_facturas_dia_tienda = 0;UPDATE tienda SET Numero_usuarios_compran_dia_tienda = 0;";	
                break;
            case '3':
                var consulta="UPDATE tienda SET Numero_usuarios_semana_tienda = 0;UPDATE tienda SET Total_ventas_semana_tienda = 0;UPDATE tienda SET Numero_facturas_semana_tienda = 0;UPDATE tienda SET Numero_usuarios_compran_semana_tienda = 0;";	
                break;
            case '4':
                var consulta="UPDATE tienda SET Numero_usuarios_mes_tienda = 0;UPDATE tienda SET Total_ventas_mes_tienda = 0;UPDATE tienda SET Numero_facturas_mes_tienda = 0;UPDATE tienda SET Numero_usuarios_compran_mes_tienda = 0;";	
                break;
        }
		console.log("Consulta:");
		console.log(consulta);
		connection.query(consulta,function(err, rows, fields){
			if(err){
				console.log("Error en la query...");
				htmlerror(err); 					return res.status(400).json({ error: err });
			}else{
				console.log("Query OK");
				if(rows.length != 0){
                    console.log("Actualizo las estadisticas");
					return res.status(200).json("Ok");
				}else{
					console.log("No hay Ofertas...");
					return res.status(204).json("No hace nada");	
				}
			}
		});
    connection.release();
	});
});

module.exports = router;