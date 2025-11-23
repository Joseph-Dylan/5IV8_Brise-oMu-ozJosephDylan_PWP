const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const ejs = require('ejs');

require('dotenv').config({path: './.env'});

const app = express();
const port = 3000;

// Configuración de mysql
const bd = mysql.createConnection({
    host: process.env.BD_HOST,
    user: process.env.BD_USER,
    password: process.env.BD_PASSWORD,
    database: process.env.BD_NAME
});

bd.connect((err) => {
    if (err) {
        console.error('Error de conexion: ' + err);
        return;
    }
    console.log('Conexión exitosa a la base de datos ' + bd.threadId);
});

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/css'));

// Ruta principal - Listar instrumentos
app.get('/', (req, res) => {
    const query = 'SELECT * FROM instrumentos ORDER BY proxima_calibracion ASC';
    bd.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los instrumentos: ' + err);
            res.status(500).send('Error al obtener los instrumentos');
        }
        res.render('index', { instrumentos: results });
    });
});

// Ruta para crear un instrumento
app.post('/instrumentos', (req, res) => {
    const { 
        id_instrumento, 
        descripcion, 
        ultima_calibracion, 
        fecha_calibracion_actual, 
        estandar_referencia, 
        lectura_antes, 
        lectura_despues, 
        certificado_asociado, 
        proxima_calibracion 
    } = req.body;

    if (ultima_calibracion && fecha_calibracion_actual && new Date(fecha_calibracion_actual) < new Date(ultima_calibracion)) {
        return res.status(400).send('Error: La fecha de calibración actual no puede ser anterior a la última calibración');
    }
    
    if (fecha_calibracion_actual && proxima_calibracion && new Date(proxima_calibracion) <= new Date(fecha_calibracion_actual)) {
        return res.status(400).send('Error: La próxima calibración debe ser después de la fecha actual');
    }
    
    const query = `INSERT INTO instrumentos 
        (id_instrumento, descripcion, ultima_calibracion, fecha_calibracion_actual, 
         estandar_referencia, lectura_antes, lectura_despues, certificado_asociado, proxima_calibracion) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    bd.query(query, [
        id_instrumento, descripcion, ultima_calibracion, fecha_calibracion_actual,
        estandar_referencia, lectura_antes, lectura_despues, certificado_asociado, proxima_calibracion
    ], (err, results) => {
        if (err) {
            console.error('Error al crear el instrumento: ' + err);
            res.status(500).send('Error al crear el instrumento');
        }
        res.redirect('/');
    });
});

// Ruta para eliminar instrumento
app.get('/instrumentos/delete/:id', (req, res) => {
    const instrumentoId = req.params.id;
    const query = 'DELETE FROM instrumentos WHERE id = ?';
    bd.query(query, [instrumentoId], (err, results) => {
        if (err) {
            console.error('Error al eliminar el instrumento: ' + err);
            res.status(500).send('Error al eliminar el instrumento');
        }
        res.redirect('/');
    });
});

// Ruta para editar instrumento
app.get('/instrumentos/edit/:id', (req, res) => {
    const instrumentoId = req.params.id;
    const query = 'SELECT * FROM instrumentos WHERE id = ?';
    bd.query(query, [instrumentoId], (err, results) => {
        if (err) {
            console.error('Error al obtener el instrumento: ' + err);
            res.status(500).send('Error al obtener el instrumento');
        }
        res.render('edit', { instrumento: results[0] });
    });
});

// Ruta para actualizar instrumento
app.post('/instrumentos/update/:id', (req, res) => {
    const instrumentoId = req.params.id;
    const { 
        id_instrumento, 
        descripcion, 
        ultima_calibracion, 
        fecha_calibracion_actual, 
        estandar_referencia, 
        lectura_antes, 
        lectura_despues, 
        certificado_asociado, 
        proxima_calibracion 
    } = req.body;

    if (ultima_calibracion && fecha_calibracion_actual && new Date(fecha_calibracion_actual) < new Date(ultima_calibracion)) {
        return res.status(400).send('Error: La fecha de calibración actual no puede ser anterior a la última calibración');
    }
    
    if (fecha_calibracion_actual && proxima_calibracion && new Date(proxima_calibracion) <= new Date(fecha_calibracion_actual)) {
        return res.status(400).send('Error: La próxima calibración debe ser después de la fecha actual');
    }
    
    const query = `UPDATE instrumentos SET 
        id_instrumento = ?, descripcion = ?, ultima_calibracion = ?, fecha_calibracion_actual = ?,
        estandar_referencia = ?, lectura_antes = ?, lectura_despues = ?, certificado_asociado = ?, 
        proxima_calibracion = ? WHERE id = ?`;
    
    bd.query(query, [
        id_instrumento, descripcion, ultima_calibracion, fecha_calibracion_actual,
        estandar_referencia, lectura_antes, lectura_despues, certificado_asociado, 
        proxima_calibracion, instrumentoId
    ], (err, results) => {
        if (err) {
            console.error('Error al actualizar el instrumento: ' + err);
            res.status(500).send('Error al actualizar el instrumento');
        }
        res.redirect('/');
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});