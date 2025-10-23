const { response } = require('express');
var http = require('http');

//vamos a crear nuestro propio servidor

var servidor = http.createServer(function (req, res) {
    // req -> es una solicitud, viene por parte de la arquitectura cliente-servidor, todos los cleintes (navegadores, usuarios, app, servicios, etc), son los que realizan una petición al servidor
    //res -> es la respuesta que el servidor le va a dar al cliente
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.write('<h1>Hola Mundo desde Node.js</h1>');
    res.write('<h1>A mimir</h1>');
    res.write('<h1>AHHHHHHHHH</h1>');
    console.log('Hola si entro al sevidror');
    res.end(); 
});

//es necesario tener un puerto para que el servidor pueda escuchar las peticiones
servidor.listen(3000);
console.log('Servidor ejecutandose en http://localhost:3000');

