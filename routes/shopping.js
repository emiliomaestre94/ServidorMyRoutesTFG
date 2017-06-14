var express = require('express');
var router = express.Router();
var stripe = require("stripe")("sk_test_UUI3byJJ3VYLpTvFOEz3Rt1E");
var comprobacionjwt= require ('../helpers/comprobacionjwt');
var htmlerror= require ('../emails/htmlerror');
var nodemailer = require('nodemailer');
const nodemailerDkim = require('nodemailer-dkim');

router.get('/',comprobacionjwt,function(req,res){
    res.send("SHOOPING GET CORRECTO");
});


router.post('/',comprobacionjwt,function(req,res){
     console.log("ENTRA EN EL POST");
    var card_id= req.body.id;
    var precio= req.body.precio;
    console.log("COSTUMER ES " + card_id);
    var preciofinal= +precio * 100;
    
    stripe.charges.create({
        amount: preciofinal,
        currency: 'eur',
        card: card_id
    }, 
    function(err, charge) {
        if (err) {
            console.log("ALGUN ERROR. ESPEREMOS QUE NO");
            res.json("ALGUN ERROR. ESPEREMOS QUE NO");
        } else {
            console.log("FUNCIONA CORRECTAMENTE");
            res.json("FUNCIONA CORRECTAMENTE");
        }
    });

});

module.exports = router;