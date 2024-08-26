import React, { useState, useEffect } from 'react';
import GameBoard from './components/GameBoard'; // Import GameBoard

const App = () => {
  // Initialize the board state as a 5x5 grid filled with null
  const [board, setBoard] = useState(Array(5).fill().map(() => Array(5).fill(null)));
  const [ws, setWs] = useState(null);

  useEffect(() => {
    // Create a new WebSocket connection when the component mounts
    const socket = new WebSocket('ws://localhost:4000');

    // Set up event listeners for WebSocket
    socket.onopen = () => {
      console.log('Connected to the server');
      setWs(socket); // Save the WebSocket connection to state
    };

    socket.onmessage = (event) => {
      const gameState = JSON.parse(event.data);
      setBoard(gameState.board); // Update the game board with data from the server
    };

    socket.onclose = () => {
      console.log('Disconnected from the server');
    };

    // Clean up the WebSocket connection when the component unmounts
    return () => {
      socket.close();
    };
  }, []);

  // Function to handle click events on the board
  const handleClick = (rowIndex, colIndex) => {
    if (ws) {
      // Send the move to the server via WebSocket
      ws.send(JSON.stringify({ row: rowIndex, col: colIndex }));
    }
  };

  return (
    <div className="game-container">
      <h1>Chess-like Game</h1>
      {/* Use the GameBoard component here */}
      <GameBoard board={board} handleClick={handleClick} />
    </div>
  );
};

export default App;
