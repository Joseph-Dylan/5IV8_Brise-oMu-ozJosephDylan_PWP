class UltimateTicTacToe {
    constructor(containerElement) {
        console.log('Datos del juego recibidos:', {
            gameId: containerElement.dataset.gameId,
            playerX: containerElement.dataset.playerX,
            playerO: containerElement.dataset.playerO,
            playerXScore: containerElement.dataset.playerXScore,
            playerOScore: containerElement.dataset.playerOScore
        });
        
        this.container = containerElement;
        this.gameId = parseInt(containerElement.dataset.gameId);
        this.completed = containerElement.dataset.completed === 'true';
        this.winner = containerElement.dataset.winner || '';
        
        this.playerXName = containerElement.dataset.playerX || 'Jugador X';
        this.playerOName = containerElement.dataset.playerO || 'Jugador O';
        this.playerXScore = parseInt(containerElement.dataset.playerXScore) || 0;
        this.playerOScore = parseInt(containerElement.dataset.playerOScore) || 0;
        
        this.moves = JSON.parse(containerElement.dataset.moves || '[]');
        this.subGames = JSON.parse(containerElement.dataset.subGames || '[]');
        
        this.currentPlayer = 'X';
        this.board = this.initializeBoard();
        this.mainBoard = this.initializeMainBoard();
        
        this.initializeGame();
        this.renderBoard();
        this.updateGameInfo();
        this.updateScores();
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
        this.moves.forEach(move => {
            this.makeMove(
                move.main_board_position,
                move.sub_board_position,
                move.player,
                false
            );
        });
        
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
        if (this.mainBoard[mainPos] !== '') return;
        
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
        
        this.checkSubGameWinner(mainPos);
        
        this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
        
        this.checkMainGameWinner();
        
        this.renderBoard();
        this.updateGameInfo();
    }
    
    checkSubGameWinner(mainPos) {
        const subBoard = this.board[mainPos];
        const winner = this.getWinner(subBoard);
        
        if (winner && !this.mainBoard[mainPos]) {
            this.mainBoard[mainPos] = winner;
            
            const alreadyWon = this.subGames.some(subGame => 
                subGame.sub_board_position === mainPos && subGame.completed
            );
            
            if (!alreadyWon) {
                if (winner === 'X') {
                    this.playerXScore += 1;
                    console.log(`${this.playerXName} gana 1 punto! Total: ${this.playerXScore}`);
                } else if (winner === 'O') {
                    this.playerOScore += 1;
                    console.log(`${this.playerOName} gana 1 punto! Total: ${this.playerOScore}`);
                }
                
                const winnerName = winner === 'X' ? this.playerXName : this.playerOName;
                this.showMessage(`${winnerName} gana un sub-juego! (+1 punto)`, `winner-${winner.toLowerCase()}`);
                
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
                    
                    fetch(`/game/${this.gameId}/update-score`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            player: winner,
                            score: winner === 'X' ? this.playerXScore : this.playerOScore
                        })
                    });
                    
                    this.updateScores();
                }
            }
        }
    }
    
    checkMainGameWinner() {
        const winner = this.getWinner(this.mainBoard);
        if (winner && !this.completed) {
            this.completed = true;
            this.winner = winner === 'X' ? this.playerXName : this.playerOName;
            
            if (winner === 'X') {
                this.playerXScore += 5;
            } else if (winner === 'O') {
                this.playerOScore += 5;
            }
            
            fetch(`/game/${this.gameId}/finish`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    winner: this.winner,
                    playerXScore: this.playerXScore,
                    playerOScore: this.playerOScore
                })
            });
            
            const winnerName = winner === 'X' ? this.playerXName : this.playerOName;
            this.showMessage(`¡${winnerName} gana el juego!`, `winner-${winner.toLowerCase()}`, true);
            
        } else if (this.isMainBoardFull() && !this.completed) {
            this.completed = true;
            this.winner = 'Draw';
            
            this.playerXScore += 2;
            this.playerOScore += 2;
            
            fetch(`/game/${this.gameId}/finish`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    winner: 'Draw',
                    playerXScore: this.playerXScore,
                    playerOScore: this.playerOScore
                })
            });
            
            this.showMessage(`¡Empate! ${this.playerXName} y ${this.playerOName} ganan puntos`, 'winner-draw', true);
        }
        
        this.updateScores();
    }
    
    getWinner(board) {
        const lines = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8],
            [0, 3, 6], [1, 4, 7], [2, 5, 8],
            [0, 4, 8], [2, 4, 6]
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
        const currentPlayerNameEl = document.getElementById('current-player-name');
        const currentPlayerSymbolEl = document.getElementById('current-player-symbol');
        
        if (currentPlayerNameEl) {
            const currentPlayerName = this.currentPlayer === 'X' ? this.playerXName : this.playerOName;
            currentPlayerNameEl.textContent = currentPlayerName;
            currentPlayerNameEl.style.color = this.currentPlayer === 'X' ? 'rgb(200, 0, 0)' : 'rgb(0, 0, 200)';
        }
        
        if (currentPlayerSymbolEl) {
            currentPlayerSymbolEl.textContent = this.currentPlayer;
            currentPlayerSymbolEl.style.color = this.currentPlayer === 'X' ? 'rgb(200, 0, 0)' : 'rgb(0, 0, 200)';
        }
        
        const movesCountEl = document.getElementById('moves-count');
        if (movesCountEl) {
            movesCountEl.textContent = this.moves.length + (this.moves.length === this.moves.length ? 0 : 1);
        }
    }
    
    updateScores() {
        const playerXScoreEl = document.getElementById('player-x-score');
        const playerOScoreEl = document.getElementById('player-o-score');
        
        if (playerXScoreEl) {
            playerXScoreEl.textContent = `${this.playerXScore} puntos`;
        }
        
        if (playerOScoreEl) {
            playerOScoreEl.textContent = `${this.playerOScore} puntos`;
        }
    }
    
    showMessage(message, type = 'success', isFinal = false) {
        const messageEl = document.getElementById('game-message');
        if (messageEl) {
            messageEl.textContent = message;
            messageEl.className = `game-message ${type}`;
            messageEl.style.display = 'block';
            
            if (isFinal) {
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
        const existingBanner = document.querySelector('.final-result-banner');
        if (existingBanner) {
            existingBanner.remove();
        }
        
        const banner = document.createElement('div');
        banner.className = `final-result-banner ${type}`;
        
        let winnerSymbol = '';
        if (type === 'winner-x') winnerSymbol = '❌';
        if (type === 'winner-o') winnerSymbol = '⭕';
        if (type === 'winner-draw') winnerSymbol = '🤝';
        
        banner.innerHTML = `
            <div style="font-size: 36px; margin-bottom: 15px;">🏆 ${winnerSymbol}</div>
            <div style="font-size: 24px; font-weight: bold;">${message}</div>
            <div style="font-size: 18px; margin-top: 15px; background: rgba(255,255,255,0.2); padding: 10px; border-radius: 5px;">
                Puntuación final:<br>
                <strong>${this.playerXName}</strong>: ${this.playerXScore} puntos<br>
                <strong>${this.playerOName}</strong>: ${this.playerOScore} puntos
            </div>
        `;
        
        banner.addEventListener('click', () => {
            banner.remove();
        });
        
        document.body.appendChild(banner);
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const boardContainer = document.getElementById('ultimate-board');
    if (boardContainer) {
        window.game = new UltimateTicTacToe(boardContainer);
    }
});