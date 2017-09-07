module.exports = function (token, nombre) {

var html=`
<!DOCTYPE html>
<html>
    <head>
        <META http-equiv="Content-Type" content="text/html; charset=utf-8"></head>
    <body>
<div>   
<table bgcolor="#EEE" style="border-radius:10px;font-family:-apple-system,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#00a18a;line-height:1.5;width:100%;margin:0;padding:16px">
    <tbody><tr style="font-family:-apple-system,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#00a18a;line-height:1.5;margin:0;padding:0">  
        <td bgcolor="#00a18a" style="font-family:-apple-system,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#00a18a;line-height:1.5;display:block!important;max-width:600px!important;clear:both!important;margin:0 auto;padding:20px;border:1px solid #eee"><br style="font-family:-apple-system,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#00a18a;line-height:1.5;margin:0;padding:0">
            <p align="center" style="font-family:-apple-system,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#00a18a;line-height:1.5;font-weight:normal;margin:0 0 10px;padding:0">
                <img align="center" alt="APPAY" border="0" width="110" src="http://i.imgur.com/Lzt34d5.png" style="font-family:-apple-system,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#00a18a;line-height:1.5;max-width:100%;margin:0;padding:0">
            </p>
        </td>
    </tr>
    <tr style="font-family:-apple-system,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#00a18a;line-height:1.5;margin:0;padding:0">   
        <td bgcolor="#FFFFFF" style="font-family:-apple-system,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#00a18a;line-height:1.5;display:block!important;max-width:600px!important;clear:both!important;margin:0 auto;padding:20px;border:1px solid #eee">
  
            <div style="font-family:-apple-system,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#00a18a;line-height:1.5;max-width:600px;display:block;margin:0 auto;padding:0">
                <table style="font-family:-apple-system,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#00a18a;line-height:1.5;width:100%;margin:0;padding:0">
                    <tbody><tr style="font-family:-apple-system,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#00a18a;line-height:1.5;margin:0;padding:0">
                        <td style="font-family:-apple-system,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#00a18a;line-height:1.5;margin:0;padding:0">
                            <p style="font-family:-apple-system,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#00a18a;line-height:1.5;font-weight:normal;margin:0 0 10px;padding:0">Hola,`+nombre.replace(/'/g, "")+`</p>
                            <p style="font-family:-apple-system,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#00a18a;line-height:1.5;font-weight:normal;margin:0 0 10px;padding:0">Bienvenido a MyRoutes</p>
                            <p style="font-family:-apple-system,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#00a18a;line-height:1.5;font-weight:normal;margin:0 0 10px;padding:0">Estamos encantados de que formes parte de nuestra familia. Ya puedes empezar a crear tus rutas personalizadas y visitar los lugares más emblematicos de las zonas en las que te encuentres.</p>

                        </td>
                    </tr>
                </tbody></table>
            </div>      
        </td>
        <td style="font-family:-apple-system,Roboto,Helvetica,Arial,sans-serif;font-size:14px;color:#00a18a;line-height:1.5;margin:0;padding:0"></td>
    </tr>
    </tbody></table>
    </div>
</body>
</html>
`;

return html;
};