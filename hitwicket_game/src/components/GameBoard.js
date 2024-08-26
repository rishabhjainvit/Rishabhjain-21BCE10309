import React, { useState } from 'react';
import '../styles/GameBoard.css'; // Ensure this path matches where your CSS file is located

const GameBoard = () => {
    const initialBoard = [
      ['R1', 'K1', 'Q1', 'B1', 'N1'],  // Player 1's major pieces
      ['P1', 'P1', 'P1', 'P1', 'P1'],  // Player 1's pawns
      [null, null, null, null, null],
      [null, null, null, null, null],  // Empty row
      ['P2', 'P2', 'P2', 'P2', 'P2'],  // Player 2's pawns
      ['R2', 'K2', 'Q2', 'B2', 'N2'],  // Player 2's major pieces
    ];
  
    const [board, setBoard] = useState(initialBoard); // Fix: useState is now imported
    const [isPlayerOneTurn, setIsPlayerOneTurn] = useState(true);
    const [gameStatus, setGameStatus] = useState("Player 1's turn");
  
    const handleClick = (rowIndex, colIndex) => {
        const piece = board[rowIndex][colIndex];
        if (!piece || gameStatus !== "Game in progress") return;
    
        // Check if the piece is a pawn
        const isPawn = piece.startsWith('P');
        if (!isPawn) return;
    
        const newBoard = board.map(row => row.slice()); // Create a deep copy of the board
    
        let newRow = rowIndex;
    
        // Determine the movement based on the player's turn and initial position
        if (isPlayerOneTurn) {
            // Player 1's pawn logic
            if (rowIndex === 1 && !newBoard[rowIndex - 2][colIndex]) {
                // If on initial row, allow two-step movement
                newRow = rowIndex - 2;
            } else if (rowIndex > 0 && !newBoard[rowIndex - 1][colIndex]) {
                // Otherwise, move one step forward
                newRow = rowIndex - 1;
            } else {
                return; // Invalid move
            }
        } else {
            // Player 2's pawn logic
            if (rowIndex === 3 && !newBoard[rowIndex + 2][colIndex]) {
                // If on initial row, allow two-step movement
                newRow = rowIndex + 2;
            } else if (rowIndex < 4 && !newBoard[rowIndex + 1][colIndex]) {
                // Otherwise, move one step forward
                newRow = rowIndex + 1;
            } else {
                return; // Invalid move
            }
        }
    
        // Move the piece to the new position
        newBoard[rowIndex][colIndex] = null; // Clear the original position
        newBoard[newRow][colIndex] = piece; // Place the piece in the new position
        setBoard(newBoard); // Update the board state
    
        // Check for a winner
        const winner = checkWinner(newBoard);
        if (winner) {
            setGameStatus(`Player ${winner} wins!`);
        } else {
            // Switch turns
            setIsPlayerOneTurn(!isPlayerOneTurn);
            setGameStatus(`Player ${isPlayerOneTurn ? 2 : 1}'s turn`);
        }
    };
    
    const checkWinner = (board) => {
        // Check for win condition: any P1 reaching row 0 or any P2 reaching row 4
        const player1Wins = board[0].some(cell => cell && cell.startsWith('P1'));
        const player2Wins = board[4].some(cell => cell && cell.startsWith('P2'));
    
        if (player1Wins) return 1;
        if (player2Wins) return 2;
    
        return null;
    };
    
    
  
    return (
        <div className="game-container">
            <h1>5x5 Chess-like Game</h1>
            <h2>{isPlayerOneTurn ? "Player 1's turn" : "Player 2's turn"}</h2>
            <div className="game-board">
                {board.map((row, rowIndex) =>
                    row.map((cell, colIndex) => (
                        <div
                            key={`${rowIndex}-${colIndex}`}
                            className={`cell ${(rowIndex + colIndex) % 2 === 0 ? 'light' : 'dark'}`}
                            onClick={() => handleClick(rowIndex, colIndex)}
                        >
                            {cell}
                        </div>
                    ))
                )}
            </div>
            {/* Display Player 2 below the board */}
            <h2>Player 2</h2>
        </div>
    );
};

export default GameBoard;