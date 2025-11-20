/*
Vamos a crear un cliente servidor para un crud
Para esto tenemos que probar si el modulo de mysql esta verificado
sino utilizammos mysql2
*/

const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const ejs = require('ejs');

const app = express();
const port = 3000;


//configuración de mysql

const bd = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'n0m3l0',
    database: 'estudiantescecyt'
});

bd.connect((err) => {
    if (err) {
        console.error('Error de conexion: ' + err);
        return;
    }
    console.log('Conexión exitosa a la base de datos' + bd.threadId);
});

// tenemos que configurar nuesro middleware, el cual estaremos usando rutas y codificación de la información por json
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//tenemos que configurar las vistas que se van a ejecutar
app.set('view engine', 'ejs');

//donde se encuentra el directorio de dichas vistas
app.set('views', __dirname + '/views');

//para la carga de imagenes, css, multimedia, etc, es necesario configurar una carpeta public en la cual todos los recursos del proyecto se podrán consumir
app.use(express.static(__dirname + '/css'));

//vamos a crear el crud de estudiantes apartir de rutas

//ruta get
app.get('/', (req, res) => {
    //necesito obtener la lista de estudiantes
    const querry = 'SELECT * FROM estudiantes';
    bd.query(querry , (err, results) => {
        if (err) {
            console.error('Error al obtener los estudiantes: ' + err);
            res.status(500).send('Error al obtener los estudiantes');
        }
        //renderizamos la vista index y le pasamos los resultados
        res.render('index', { estudiantes: results });
    });
});

//ruta para crear un estudiante
app.post('/estudiantes', (req, res) => {
    //obtener los parametros del formulario
    const { nombre, apellido, edad } = req.body;
    const querry = `INSERT INTO estudiantes (nombre, apellido, edad) VALUES ('${nombre}', '${apellido}', '${edad}')`;
    bd.query(querry, (err, results) => {
        if (err) {
            console.error('Error al crear el estudiante: ' + err);
            res.status(500).send('Error al crear el estudiante');
        }
        res.redirect('/');
    });
});


app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

