const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');

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
app.set('views', path.join(__dirname, 'views'));

app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

app.use(express.static(path.join(__dirname, 'public')));

// Ruta principal - Listar juegos
app.get('/', (req, res) => {
    const query = `
        SELECT g.*, 
               COUNT(DISTINCT m.id) as total_moves,
               COUNT(DISTINCT sg.id) as completed_sub_games
        FROM games g 
        LEFT JOIN moves m ON g.id = m.game_id 
        LEFT JOIN sub_games sg ON g.id = sg.game_id AND sg.completed = TRUE
        GROUP BY g.id 
        ORDER BY g.created_at DESC
    `;
    
    bd.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los juegos: ' + err);
            res.status(500).send('Error al obtener los juegos');
            return;
        }
        res.render('index', { games: results });
    });
});

// Ruta para crear un nuevo juego
app.post('/games', (req, res) => {
    const query = 'INSERT INTO games (winner, completed) VALUES (NULL, FALSE)';
    
    bd.query(query, (err, results) => {
        if (err) {
            console.error('Error al crear el juego: ' + err);
            res.status(500).send('Error al crear el juego');
            return;
        }
        res.redirect('/game/' + results.insertId);
    });
});

// Ruta para ver/continuar un juego específico
app.get('/game/:id', (req, res) => {
    const gameId = req.params.id;
    
    // Obtener información del juego
    const gameQuery = 'SELECT * FROM games WHERE id = ?';
    const movesQuery = `
        SELECT * FROM moves 
        WHERE game_id = ? 
        ORDER BY move_number ASC
    `;
    const subGamesQuery = 'SELECT * FROM sub_games WHERE game_id = ?';
    
    bd.query(gameQuery, [gameId], (err, gameResults) => {
        if (err || gameResults.length === 0) {
            console.error('Error al obtener el juego: ' + err);
            res.status(404).send('Juego no encontrado');
            return;
        }
        
        bd.query(movesQuery, [gameId], (err, movesResults) => {
            if (err) {
                console.error('Error al obtener los movimientos: ' + err);
                res.status(500).send('Error al obtener los movimientos');
                return;
            }
            
            bd.query(subGamesQuery, [gameId], (err, subGamesResults) => {
                if (err) {
                    console.error('Error al obtener los sub-juegos: ' + err);
                    res.status(500).send('Error al obtener los sub-juegos');
                    return;
                }
                
                res.render('game', {
                    game: gameResults[0],
                    moves: movesResults,
                    subGames: subGamesResults
                });
            });
        });
    });
});

// Ruta para hacer un movimiento
app.post('/game/:id/move', (req, res) => {
    const gameId = req.params.id;
    const { mainBoard, subBoard, player } = req.body;
    
    // Validaciones básicas
    if (mainBoard === undefined || subBoard === undefined || !player) {
        return res.status(400).json({ error: 'Datos incompletos' });
    }
    
    if (player !== 'X' && player !== 'O') {
        return res.status(400).json({ error: 'Jugador inválido' });
    }
    
    // Obtener el número del próximo movimiento
    const nextMoveQuery = 'SELECT COUNT(*) as count FROM moves WHERE game_id = ?';
    bd.query(nextMoveQuery, [gameId], (err, results) => {
        if (err) {
            console.error('Error al contar movimientos: ' + err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        const moveNumber = results[0].count + 1;
        
        // Insertar el movimiento
        const insertMoveQuery = `
            INSERT INTO moves (game_id, main_board_position, sub_board_position, player, move_number) 
            VALUES (?, ?, ?, ?, ?)
        `;
        
        bd.query(insertMoveQuery, [gameId, mainBoard, subBoard, player, moveNumber], (err, results) => {
            if (err) {
                console.error('Error al guardar el movimiento: ' + err);
                return res.status(500).json({ error: 'Error al guardar el movimiento' });
            }
            
            res.json({ success: true, moveNumber: moveNumber });
        });
    });
});

// Ruta para actualizar un sub-juego
app.post('/game/:id/subgame', (req, res) => {
    const gameId = req.params.id;
    const { subBoard, winner } = req.body;
    
    // Verificar si el sub-juego ya existe
    const checkQuery = 'SELECT * FROM sub_games WHERE game_id = ? AND sub_board_position = ?';
    bd.query(checkQuery, [gameId, subBoard], (err, results) => {
        if (err) {
            console.error('Error al verificar sub-juego: ' + err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        if (results.length > 0) {
            // Actualizar sub-juego existente
            const updateQuery = `
                UPDATE sub_games 
                SET winner = ?, completed = TRUE 
                WHERE game_id = ? AND sub_board_position = ?
            `;
            bd.query(updateQuery, [winner, gameId, subBoard], (err, results) => {
                if (err) {
                    console.error('Error al actualizar sub-juego: ' + err);
                    return res.status(500).json({ error: 'Error al actualizar sub-juego' });
                }
                res.json({ success: true });
            });
        } else {
            // Crear nuevo sub-juego
            const insertQuery = `
                INSERT INTO sub_games (game_id, sub_board_position, winner, completed) 
                VALUES (?, ?, ?, TRUE)
            `;
            bd.query(insertQuery, [gameId, subBoard, winner], (err, results) => {
                if (err) {
                    console.error('Error al crear sub-juego: ' + err);
                    return res.status(500).json({ error: 'Error al crear sub-juego' });
                }
                res.json({ success: true });
            });
        }
    });
});

// Ruta para finalizar un juego
app.post('/game/:id/finish', (req, res) => {
    const gameId = req.params.id;
    const { winner } = req.body;
    
    const updateQuery = 'UPDATE games SET winner = ?, completed = TRUE WHERE id = ?';
    bd.query(updateQuery, [winner, gameId], (err, results) => {
        if (err) {
            console.error('Error al finalizar el juego: ' + err);
            return res.status(500).json({ error: 'Error al finalizar el juego' });
        }
        res.json({ success: true });
    });
});

// Ruta para eliminar un juego
app.get('/games/delete/:id', (req, res) => {
    const gameId = req.params.id;
    const query = 'DELETE FROM games WHERE id = ?';
    bd.query(query, [gameId], (err, results) => {
        if (err) {
            console.error('Error al eliminar el juego: ' + err);
            res.status(500).send('Error al eliminar el juego');
            return;
        }
        res.redirect('/');
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});