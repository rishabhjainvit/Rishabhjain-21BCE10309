import React, { useState } from 'react';
import '../styles/GameBoard.css'; // Ensure this path matches where your CSS file is located

const GameBoard = () => {
  const [board, setBoard] = useState(Array(5).fill().map(() => Array(5).fill(null)));
  const [currentPlayer, setCurrentPlayer] = useState('A');
  const [setupPhase, setSetupPhase] = useState(true);
  const [playerASetup, setPlayerASetup] = useState('');
  const [playerBSetup, setPlayerBSetup] = useState('');
  const [moveInput, setMoveInput] = useState('');
  const [gameStatus, setGameStatus] = useState('Player A: Set up your characters');

  const characterTypes = ['P', 'H1', 'H2'];

  const isValidSetup = (setup) => {
    const characters = setup.split(',').map(char => char.trim());
    const isValidCount = characters.length === 5;
    const isValidChars = characters.every(char => characterTypes.includes(char));
    return isValidCount && isValidChars;
  };

  const setupBoard = () => {
    const newBoard = Array(5).fill().map(() => Array(5).fill(null));
    playerASetup.split(',').forEach((char, index) => {
      newBoard[0][index] = `A-${char.trim()}`;
    });
    playerBSetup.split(',').forEach((char, index) => {
      newBoard[4][index] = `B-${char.trim()}`;
    });
    setBoard(newBoard);
    setSetupPhase(false);
    setGameStatus("Player A's turn");
  };

  const handleSetupInput = (e) => {
    const setup = e.target.value.toUpperCase();
    currentPlayer === 'A' ? setPlayerASetup(setup) : setPlayerBSetup(setup);
  };

  const handleSetupSubmit = () => {
    const setup = currentPlayer === 'A' ? playerASetup : playerBSetup;
    if (isValidSetup(setup)) {
      if (currentPlayer === 'A') {
        setCurrentPlayer('B');
        setGameStatus("Player B: Set up your characters");
      } else {
        setupBoard();
      }
    } else {
      alert("Invalid setup. Please use 5 characters (P, H1, H2) separated by commas.");
    }
  };

  const isValidMove = (char, move) => {
    const [type] = char.split('-');
    if (!characterTypes.includes(type)) return false;
    if (type === 'P' || type === 'H1') return ['L', 'R', 'F', 'B'].includes(move);
    if (type === 'H2') return ['FL', 'FR', 'BL', 'BR'].includes(move);
    return false;
  };

  const getNewPosition = (row, col, char, move) => {
    const [type] = char.split('-');
    const distance = type.startsWith('H') ? 2 : 1;
    const direction = currentPlayer === 'A' ? 1 : -1;

    switch (move) {
      case 'L': return [row, col - distance];
      case 'R': return [row, col + distance];
      case 'F': return [row + (distance * direction), col];
      case 'B': return [row - (distance * direction), col];
      case 'FL': return [row + (distance * direction), col - distance];
      case 'FR': return [row + (distance * direction), col + distance];
      case 'BL': return [row - (distance * direction), col - distance];
      case 'BR': return [row - (distance * direction), col + distance];
      default: return [row, col];
    }
  };

  const isInBounds = (row, col) => row >= 0 && row < 5 && col >= 0 && col < 5;

  const makeMove = (charName, move) => {
    const newBoard = board.map(row => [...row]);
    let charFound = false;

    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        if (newBoard[i][j] === `${currentPlayer}-${charName}`) {
          const [newRow, newCol] = getNewPosition(i, j, charName, move);

          if (!isInBounds(newRow, newCol)) {
            alert("Invalid move: Out of bounds");
            return;
          }

          if (newBoard[newRow][newCol] && newBoard[newRow][newCol].startsWith(currentPlayer)) {
            alert("Invalid move: Cannot target friendly character");
            return;
          }

          // Handle Hero1 and Hero2 path clearing
          if (charName.startsWith('H')) {
            const midRow = Math.floor((i + newRow) / 2);
            const midCol = Math.floor((j + newCol) / 2);
            if (newBoard[midRow][midCol] && !newBoard[midRow][midCol].startsWith(currentPlayer)) {
              newBoard[midRow][midCol] = null;
            }
          }

          newBoard[newRow][newCol] = `${currentPlayer}-${charName}`;
          newBoard[i][j] = null;
          charFound = true;
          break;
        }
      }
      if (charFound) break;
    }

    if (!charFound) {
      alert("Invalid move: Character not found");
      return;
    }

    setBoard(newBoard);
    setCurrentPlayer(currentPlayer === 'A' ? 'B' : 'A');
    setGameStatus(`Player ${currentPlayer === 'A' ? 'B' : 'A'}'s turn`);
    checkWinCondition(newBoard);
  };

  const handleMoveInput = (e) => {
    setMoveInput(e.target.value.toUpperCase());
  };

  const handleMoveSubmit = () => {
    const [charName, move] = moveInput.split(':');
    if (isValidMove(charName, move)) {
      makeMove(charName, move);
      setMoveInput('');
    } else {
      alert("Invalid move format. Please use format 'CharName:Move' (e.g., P:L, H1:F, H2:FL)");
    }
  };

  const checkWinCondition = (board) => {
    const playerAAlive = board.some(row => row.some(cell => cell && cell.startsWith('A')));
    const playerBAlive = board.some(row => row.some(cell => cell && cell.startsWith('B')));

    if (!playerAAlive) {
      setGameStatus("Player B wins!");
    } else if (!playerBAlive) {
      setGameStatus("Player A wins!");
    }
  };

  return (
    <div className="game-container">
      <h1>5x5 Character Battle Game</h1>
      <h2>{gameStatus}</h2>
      {setupPhase ? (
        <div>
          <input 
            type="text" 
            value={currentPlayer === 'A' ? playerASetup : playerBSetup} 
            onChange={handleSetupInput} 
            placeholder="Enter 5 characters (P, H1, H2) separated by commas"
          />
          <button onClick={handleSetupSubmit}>Submit Setup</button>
        </div>
      ) : (
        <div>
          <div className="game-board">
            {board.map((row, rowIndex) => (
              <div key={rowIndex} className="row">
                {row.map((cell, colIndex) => (
                  <div key={colIndex} className="cell">
                    {cell}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <input 
            type="text" 
            value={moveInput} 
            onChange={handleMoveInput} 
            placeholder="Enter move (e.g., P:L, H1:F, H2:FL)"
          />
          <button onClick={handleMoveSubmit}>Submit Move</button>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
