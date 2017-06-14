var express = require('express');
var router = express.Router();
var db = require('../helpers/database')();
var db2 = require('../helpers/database2')();
var htmlerror= require ('../emails/htmlerror');
var nodemailer = require('nodemailer');
const nodemailerDkim = require('nodemailer-dkim');

router.get('/products', function(request, response) {
    var query = "SELECT * FROM producto";
    var columnas =new Array;
    var nuevos = 0;
    var actualizados = 0;
    db2.getConnection(function(err, connection) {
        if (err) throw err;
            connection.query(query, function(err, rows, fields) {
                console.log("Entro en la primera Query");
                if (err) {
                    console.log('error: ', err);
                    throw err;
                }
                console.log("kshdfgjkdajshgfkajdshgfkajshgdfkajhsgdfkjhagsdf");
                console.log(rows);
                if(rows.length != 0){
                    for(var i = 0; i<rows.length; i++){
                        columnas[i] = rows[i];
                    }
                }
                var productos = new Array;
                var actualizarProductos = new Array;
                var actualizar = false;
                db.getConnection(function(err, connection) {
                    console.log("Entro en la segunda coñexion");
                    if (err) throw err;
                        var Id_tienda = connection.escape(request.query.id);
                    if(columnas.length > 0 && Id_tienda != "NULL"){
                        var comprobarProducto = "";
                        for(var i = 0; i<columnas.length; i++){
                            comprobarProducto += "SELECT * FROM producto JOIN producto_tienda ON Id_producto=Id_producto_producto_tienda WHERE Id_tienda_producto_tienda = "+Id_tienda+" AND Codigo_producto = "+columnas[i].Codigo_producto+";";
                        }
                        console.log(comprobarProducto);
                        connection.query(comprobarProducto, function(err, rows2, fields) {
                            console.log("Entro en la tercera query");
                            if (err) {
                                console.log('error: ', err);
                                throw err;
                            }else{
                                var j = 0;
                                var k = 0;
                                for(var i = 0; i<rows2.length; i++){
                                    if(rows2[i].length == 0){
                                        productos[j] = columnas[i];
                                        j++;
                                        nuevos++;
                                    }else{
                                        actualizarProductos[k] = columnas[i];
                                        k++;
                                        actualizados++;
                                        actualizar = true;
                                        console.log("El producto ya existe, se va a actualizar");
                                    }
                                }
                                //Si existen productos duplicados se van a actualizar
                                if(actualizar){
                                    var updateProductos = "";
                                    for(var i = 0; i<actualizarProductos.length; i++){
                                        updateProductos += "UPDATE producto JOIN producto_tienda ON Id_producto_producto_tienda = Id_producto SET Nombre_producto = '"+actualizarProductos[i].Nombre_producto+"', Codigo_producto = '"+actualizarProductos[i].Codigo_producto+"', Descripcion_producto = '"+actualizarProductos[i].Descripcion_producto+"', Precio_producto = "+actualizarProductos[i].Precio_producto+", Stock_producto = "+actualizarProductos[i].Stock_producto+", Eliminado_producto="+actualizarProductos[i].Eliminado_producto+" WHERE Codigo_producto = '"+actualizarProductos[i].Codigo_producto+"' AND Id_tienda_producto_tienda = "+Id_tienda+";";
                                    }

                                    console.log(updateProductos);
                                    connection.query(updateProductos, function(err, rows3, fields) {
                                        if (err) {
                                            console.log('error: ', err);
                                            throw err;
                                        }else{
                                            console.log("Productos actualizados correctamente");
                                        }
                                    });
                                }
                            }
                            if(productos.length > 0){
                                console.log("Entro al ultimo if");
                                var query2 ="";
                                //Esta linea abria que cambiar en caso de que la base de datos del cliente fuera de otra forma
                                var fecha = new Date().toLocaleString();
                                for(var i = 0; i<productos.length; i++){
                                    query2 = query2 + "INSERT INTO producto (Nombre_producto, Codigo_producto, Descripcion_producto, Precio_producto, Stock_producto,Estado_producto, Eliminado_producto) VALUES ('"+productos[i].Nombre_producto+"', '"+productos[i].Codigo_producto+"', '"+productos[i].Descripcion_producto+"', '"+productos[i].Precio_producto+"', '"+productos[i].Stock_producto+"', '1','0');"
                                }
                                console.log(query2);
                                db.getConnection(function(err, connection) {
                                    if (err) throw err;
                                        connection.query(query2, function(err, rows4, fields) {
                                            if (err) {
                                                console.log('error: ', err);
                                                throw err;
                                            }else{
                                                var Id_tienda = connection.escape(request.query.id); //Hay que pasarle el id de tienda para saber en que tienda se insertan los productos
                                                var query3 = "";
                                                if(rows4.length > 0){
                                                    for(var i = 0; i < rows4.length; i++){
                                                        query3+="INSERT INTO producto_tienda (Id_tienda_producto_tienda, Id_producto_producto_tienda) VALUES("+Id_tienda+","+rows4[i].insertId+");";
                                                    }
                                                }else{
                                                    query3+="INSERT INTO producto_tienda (Id_tienda_producto_tienda, Id_producto_producto_tienda) VALUES("+Id_tienda+","+rows4.insertId+");";
                                                }
                                                //Añadimos la fecha de la ultima copia de la tienda
                                                query3 += "UPDATE tienda SET Ultima_copia_productos_tienda='"+fecha+"' WHERE Id_tienda="+request.query.id+"";
                                                console.log(query3);
                                                connection.query(query3,function(err, rows5, fields){
                                                    if(err){
                                                        console.log(err);
                                                    }else{
                                                        console.log("Insertado correctamente en producto_tienda");
                                                    }
                                                });
                                            }
                                        });
                                    connection.release();
                                });
                                return response.status(200).json("Productos nuevos añadidos: "+nuevos+" --- Productos actualizados: "+actualizados);
                            }else{
                                console.log("Entro al else");
                                return response.status(200).json("Productos nuevos añadidos: "+nuevos+" --- Productos actualizados: "+actualizados);
                            }  
                        });
                    }
                    connection.release();
                });
            });
        connection.release();
    });
});
module.exports = router;