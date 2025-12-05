const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const path = require('path');

require('dotenv').config({path: './.env'});

const app = express();
const port = 3000;

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

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use('/css', express.static(path.join(__dirname, 'css')));
app.use('/js', express.static(path.join(__dirname, 'js')));

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

app.get('/games/new', (req, res) => {
    res.render('new-game');
});

app.post('/games', (req, res) => {
    const { playerXName, playerOName } = req.body;
    
    const query = `
        INSERT INTO games 
        (winner, completed, player_x_name, player_o_name, player_x_score, player_o_score) 
        VALUES (NULL, FALSE, ?, ?, 0, 0)
    `;
    
    bd.query(query, [
        playerXName || 'Jugador X',
        playerOName || 'Jugador O'
    ], (err, results) => {
        if (err) {
            console.error('Error al crear el juego: ' + err);
            res.status(500).send('Error al crear el juego');
            return;
        }
        res.redirect('/game/' + results.insertId);
    });
});

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

app.post('/game/:id/subgame', (req, res) => {
    const gameId = req.params.id;
    const { subBoard, winner } = req.body;
    
    const checkQuery = 'SELECT * FROM sub_games WHERE game_id = ? AND sub_board_position = ?';
    bd.query(checkQuery, [gameId, subBoard], (err, results) => {
        if (err) {
            console.error('Error al verificar sub-juego: ' + err);
            return res.status(500).json({ error: 'Error interno del servidor' });
        }
        
        if (results.length > 0) {
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

app.post('/game/:id/update-score', (req, res) => {
    const gameId = req.params.id;
    const { player, score } = req.body;
    
    let query;
    if (player === 'X') {
        query = 'UPDATE games SET player_x_score = ? WHERE id = ?';
    } else {
        query = 'UPDATE games SET player_o_score = ? WHERE id = ?';
    }
    
    bd.query(query, [score, gameId], (err, results) => {
        if (err) {
            console.error('Error al actualizar puntuación: ' + err);
            return res.status(500).json({ error: 'Error al actualizar puntuación' });
        }
        res.json({ success: true });
    });
});

app.post('/game/:id/finish', (req, res) => {
    const gameId = req.params.id;
    const { winner, playerXScore, playerOScore } = req.body;
    
    const getPlayerQuery = 'SELECT player_x_name, player_o_name FROM games WHERE id = ?';
    bd.query(getPlayerQuery, [gameId], (err, results) => {
        if (err) {
            console.error('Error al obtener nombres: ' + err);
            return res.status(500).json({ error: 'Error al finalizar el juego' });
        }
        
        let winnerToStore = winner;
        
        if (winner === 'X') {
            winnerToStore = results[0].player_x_name;
        } else if (winner === 'O') {
            winnerToStore = results[0].player_o_name;
        }
        
        const updateQuery = `
            UPDATE games 
            SET winner = ?, completed = TRUE, 
                player_x_score = ?, player_o_score = ? 
            WHERE id = ?
        `;
        
        bd.query(updateQuery, [
            winnerToStore, 
            playerXScore || 0, 
            playerOScore || 0, 
            gameId
        ], (err, results) => {
            if (err) {
                console.error('Error al finalizar el juego: ' + err);
                return res.status(500).json({ error: 'Error al finalizar el juego' });
            }
            res.json({ success: true });
        });
    });
});

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

app.get('/api/game/:id', (req, res) => {
    const gameId = req.params.id;
    
    const gameQuery = 'SELECT * FROM games WHERE id = ?';
    const movesQuery = 'SELECT * FROM moves WHERE game_id = ? ORDER BY move_number ASC';
    const subGamesQuery = 'SELECT * FROM sub_games WHERE game_id = ?';
    
    bd.query(gameQuery, [gameId], (err, gameResults) => {
        if (err || gameResults.length === 0) {
            res.status(404).json({ error: 'Juego no encontrado' });
            return;
        }
        
        bd.query(movesQuery, [gameId], (err, movesResults) => {
            if (err) {
                res.status(500).json({ error: 'Error al obtener movimientos' });
                return;
            }
            
            bd.query(subGamesQuery, [gameId], (err, subGamesResults) => {
                if (err) {
                    res.status(500).json({ error: 'Error al obtener sub-juegos' });
                    return;
                }
                
                res.json({
                    game: gameResults[0],
                    moves: movesResults,
                    subGames: subGamesResults
                });
            });
        });
    });
});

app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`);
});

/*
create database GatoGatos;
use GatoGatos;

create table if not exists games (
    id int auto_increment primary key,
    created_at timestamp default current_timestamp,
    winner varchar(50) null,
    completed boolean default false,
    player_x_name varchar(50) default 'Jugador X',
    player_o_name varchar(50) default 'Jugador O',
    player_x_score int default 0,
    player_o_score int default 0
);

create table if not exists moves (
    id int auto_increment primary key,
    game_id int,
    main_board_position int,
    sub_board_position int,
    player enum('X', 'O'),
    move_number int,
    created_at timestamp default current_timestamp,
    foreign key (game_id) references games(id) on delete cascade
);

create table if not exists sub_games (
    id int auto_increment primary key,
    game_id int,
    sub_board_position int,
    winner enum('X', 'O', 'Draw') null,
    completed boolean default false,
    foreign key (game_id) references games(id) on delete cascade
);
 
*/