import express from 'express';
import path from 'path';

//aquí nosotros tenemos que agregar las rutas que se van a consumir
const app = express();
const PORT = process.env.PORT || 3000;

const __dirname = path.resolve(); 

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, '../Frontend', 'public')));

app.set('views engine', 'ejs');
app.set('public', path.join(__dirname, '../Frontend', 'public'));

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});