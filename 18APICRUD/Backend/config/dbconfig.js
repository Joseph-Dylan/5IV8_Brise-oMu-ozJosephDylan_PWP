import mysql from 'mysql2';
import dotenv from 'dotenv';

//si vamos a tener una base de datos en servidor
// import {fileURLToPath} from 'url';

//const __filename = fileURLToPath(import.meta.url);
//const __dirname = path.dirname(__filename);

//dotenv.config({path.resolve(__dirname, '../.env')});
dotenv.config();

const config = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: 'n0m3l0',
    database: 'curso'

    //conection limit: 10,
    //acquiereTimeout: 30000,
    //idieTimeout: 30000,
});

config.getConnection((err) => {
    if (err) {
        console.error('Error en la base de datos', err);
        return;
    }
    console.log('Conexión exitosa.');
    connection.release();
});

export default config;