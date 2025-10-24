const express = require('express');
const mirrow = require('./endpoints/mirrow');

//vamos a hacer una instancia del servidor

const app = express();
const port = 3000;

app.use(express.json()); //middleware para que express pueda entender el body de las peticiones
//definimos las rutas
app.get('/', mirrow);
app.post('/', mirrow);
app.put('/', mirrow);
app.patch('/', mirrow);
app.delete('/', mirrow);
app.head('/', mirrow);

app.listen(port, () => {
    console.log(`Servidor ejecutandose en http://localhost:${port}`);
});