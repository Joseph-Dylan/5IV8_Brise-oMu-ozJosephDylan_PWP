class UltimateTicTacToe {
    constructor(containerElement) {
        this.container = containerElement;
        this.gameId = parseInt(containerElement.dataset.gameId);
        this.completed = containerElement.dataset.completed === 'true';
        this.winner = containerElement.dataset.winner || '';
        this.moves = JSON.parse(containerElement.dataset.moves || '[]');
        this.subGames = JSON.parse(containerElement.dataset.subGames || '[]');
        
        this.currentPlayer = 'X';
        this.board = this.initializeBoard();
        this.mainBoard = this.initializeMainBoard();
        
        this.initializeGame();
        this.renderBoard();
        this.updateGameInfo();
    }
    
    initializeBoard() {
        const board = [];
        for (let i = 0; i < 9; i++) {
            board[i] = Array(9).fill('');
        }
        return board;
    }
    
    initializeMainBoard() {
        return Array(9).fill('');
    }
    
    initializeGame() {
        // Aplicar movimientos guardados
        this.moves.forEach(move => {
            this.makeMove(
                move.main_board_position,
                move.sub_board_position,
                move.player,
                false // No guardar en BD
            );
        });
        
        // Determinar siguiente jugador
        if (this.moves.length > 0) {
            const lastMove = this.moves[this.moves.length - 1];
            this.currentPlayer = lastMove.player === 'X' ? 'O' : 'X';
        }
    }
    
    renderBoard() {
        const container = document.getElementById('ultimate-board');
        container.innerHTML = '';
        
        for (let mainPos = 0; mainPos < 9; mainPos++) {
            const mainCell = document.createElement('div');
            mainCell.className = 'main-cell';
            
            if (this.mainBoard[mainPos]) {
                mainCell.classList.add(`won-${this.mainBoard[mainPos].toLowerCase()}`);
            }
            
            const subBoard = document.createElement('div');
            subBoard.className = 'sub-board';
            subBoard.dataset.mainPosition = mainPos;
            
            for (let subPos = 0; subPos < 9; subPos++) {
                const subCell = document.createElement('div');
                subCell.className = 'sub-cell';
                subCell.dataset.mainPosition = mainPos;
                subCell.dataset.subPosition = subPos;
                
                const value = this.board[mainPos][subPos];
                if (value) {
                    subCell.textContent = value;
                    subCell.classList.add(value.toLowerCase());
                }
                
                // MODIFICADO: Todas las celdas son jugables si el juego no ha terminado
                // y la celda está vacía y el sub-tablero principal no está ganado
                if (!this.completed && 
                    this.board[mainPos][subPos] === '' && 
                    this.mainBoard[mainPos] === '') {
                    subCell.addEventListener('click', () => this.handleCellClick(mainPos, subPos));
                } else {
                    subCell.style.cursor = 'not-allowed';
                    subCell.style.opacity = '0.6';
                }
                
                subBoard.appendChild(subCell);
            }
            
            mainCell.appendChild(subBoard);
            container.appendChild(mainCell);
        }
    }
    
    handleCellClick(mainPos, subPos) {
        if (this.completed) return;
        if (this.board[mainPos][subPos] !== '') return;
        if (this.mainBoard[mainPos] !== '') return; // Sub-tablero ya ganado
        
        this.makeMove(mainPos, subPos, this.currentPlayer, true);
    }
    
    async makeMove(mainPos, subPos, player, saveToDB = true) {
        this.board[mainPos][subPos] = player;
        
        if (saveToDB) {
            try {
                const response = await fetch(`/game/${this.gameId}/move`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        mainBoard: mainPos,
                        subBoard: subPos,
                        player: player
                    })
                });
                
                const result = await response.json();
                if (!result.success) {
                    console.error('Error al guardar movimiento:', result.error);
                    return;
                }
            } catch (error) {
                console.error('Error:', error);
                return;
            }
        }
        
        // Verificar si se ganó el sub-tablero
        this.checkSubGameWinner(mainPos);
        
        // MODIFICADO: No hay restricciones para el siguiente movimiento
        // Los jugadores pueden jugar en cualquier sub-tablero disponible
        
        // Cambiar jugador
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        
        // Verificar si se ganó el juego principal
        this.checkMainGameWinner();
        
        this.renderBoard();
        this.updateGameInfo();
    }
    
    checkSubGameWinner(mainPos) {
        const subBoard = this.board[mainPos];
        const winner = this.getWinner(subBoard);
        
        if (winner && !this.mainBoard[mainPos]) {
            this.mainBoard[mainPos] = winner;
            
            // Guardar en base de datos
            if (!this.completed) {
                fetch(`/game/${this.gameId}/subgame`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        subBoard: mainPos,
                        winner: winner
                    })
                });
            }
        }
    }
    
    checkMainGameWinner() {
    const winner = this.getWinner(this.mainBoard);
    if (winner && !this.completed) {
        this.completed = true;
        this.winner = winner;
        
        fetch(`/game/${this.gameId}/finish`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                winner: winner
            })
        });
        
        this.showMessage(`¡GANADOR: ${winner}!`, `winner-${winner.toLowerCase()}`, true);
        
    } else if (this.isMainBoardFull() && !this.completed) {
        this.completed = true;
        this.winner = 'Draw';
        
        fetch(`/game/${this.gameId}/finish`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                winner: 'Draw'
            })
        });
        
        this.showMessage('¡EMPATE!', 'winner-draw', true);
    }
}
    
    getWinner(board) {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // Filas
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columnas
            [0, 4, 8], [2, 4, 6]             // Diagonales
        ];
        
        for (let line of lines) {
            const [a, b, c] = line;
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return board[a];
            }
        }
        
        return null;
    }
    
    isSubBoardFull(mainPos) {
        return this.board[mainPos].every(cell => cell !== '') || this.mainBoard[mainPos] !== '';
    }
    
    isMainBoardFull() {
        return this.mainBoard.every((cell, index) => cell !== '' || this.isSubBoardFull(index));
    }
    
    updateGameInfo() {
        const currentPlayerEl = document.getElementById('current-player');
        const movesCountEl = document.getElementById('moves-count');
        
        if (currentPlayerEl) {
            currentPlayerEl.textContent = this.currentPlayer;
            currentPlayerEl.style.color = this.currentPlayer === 'X' ? '#e74c3c' : '#3498db';
        }
        
        if (movesCountEl) {
            movesCountEl.textContent = this.moves.length + (this.moves.length === this.moves.length ? 0 : 1);
        }
    }
    
    showMessage(message, type = 'success', isFinal = false) {
        const messageEl = document.getElementById('game-message');
        if (messageEl) {
            messageEl.textContent = message;
            messageEl.className = `game-message ${type}`;
            messageEl.style.display = 'block';
            
            if (isFinal) {
                // Crear banner final superpuesto
                this.createFinalBanner(message, type);
            }
            
            if (!isFinal) {
                setTimeout(() => {
                    messageEl.style.display = 'none';
                }, 3000);
            }
        }
    }

    createFinalBanner(message, type) {
        // Remover banner anterior si existe
        const existingBanner = document.querySelector('.final-result-banner');
        if (existingBanner) {
            existingBanner.remove();
        }
        
        const banner = document.createElement('div');
        banner.className = `final-result-banner ${type}`;
        banner.textContent = message;
        banner.innerHTML = `
            <div>${message}</div>
            <div style="font-size: 18px; margin-top: 20px; opacity: 0.9;">Juego Terminado</div>
        `;
        
        banner.addEventListener('click', () => {
            banner.remove();
        });
        
        document.body.appendChild(banner);
    }
}

// Inicializar el juego cuando se cargue la página
document.addEventListener('DOMContentLoaded', () => {
    const boardContainer = document.getElementById('ultimate-board');
    if (boardContainer) {
        window.game = new UltimateTicTacToe(boardContainer);
    }
});