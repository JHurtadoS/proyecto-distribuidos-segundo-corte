// Import Preact globally exposed components
const { h, render, useState, useEffect } = window.preact;

// Constants
// In development mode, use /api proxy to avoid CORS issues
// In production, use the configured API URL or localhost default
const isDev = import.meta.env.DEV;
const API_URL = isDev ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:8080');
const CELL_SIZE = 30;
const COLORS = {
  I: 'bg-cyan-500',
  O: 'bg-yellow-500',
  T: 'bg-purple-500',
  S: 'bg-green-500',
  Z: 'bg-red-500',
  J: 'bg-blue-500',
  L: 'bg-orange-500',
  empty: 'bg-gray-900'
};

// Debug logging
const debug = (message) => {
  console.log(`[Tetris Debug] ${message}`);
};

// Utils - Enhanced with better error handling and logging
const request = async (endpoint, method = 'GET', data = null) => {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  };

  if (data) options.body = JSON.stringify(data);

  debug(`Making ${method} request to ${API_URL}${endpoint}`);
  
  try {
    const response = await fetch(`${API_URL}${endpoint}`, options);
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Request failed: ${response.status} - ${errorText}`);
    }
    
    const result = await response.json();
    debug(`Response from ${endpoint}: ${JSON.stringify(result)}`);
    return result;
  } catch (error) {
    console.error(`API request error to ${endpoint}:`, error);
    throw error;
  }
};

// Components
const Cell = ({ filled, color = 'empty', isActivePiece = false }) => {
  let cellClass = `w-[${CELL_SIZE}px] h-[${CELL_SIZE}px] border border-gray-700 `;
  
  if (filled) {
    if (isActivePiece) {
      // Active piece cells get a highlight effect
      cellClass += `${COLORS[color]} opacity-80 border-white`;
    } else {
      // Fixed blocks
      cellClass += COLORS[color];
    }
  } else {
    cellClass += COLORS.empty;
  }
  
  return h('div', { class: cellClass });
};

const Row = ({ cells, activePieceCoords, rowIndex, activePieceType }) => {
  return h('div', { class: 'flex' }, 
    cells.map((cell, colIndex) => {
      // Check if this cell is part of the active piece
      const isActivePiece = activePieceCoords && 
        activePieceCoords.some(coord => coord.x === colIndex && coord.y === rowIndex);
      
      // Use the type for active pieces, default to 'O' for fixed blocks
      const cellType = isActivePiece ? activePieceType : 'O';
      
      return h(Cell, { 
        filled: cell === 1, 
        key: colIndex,
        color: cellType, 
        isActivePiece
      });
    })
  );
};

const Board = ({ board, activePiece }) => {
  // Calculate the absolute coordinates of the active piece cells if we have an active piece
  const activePieceCoords = 
    activePiece && activePiece.coordenadasBloques ? 
    activePiece.coordenadasBloques : 
    [];
  
  // Get the active piece type
  const activePieceType = activePiece ? activePiece.tipo : 'I';
    
  return h('div', { class: 'inline-block border-4 border-gray-600' }, 
    board.map((row, rowIndex) => 
      h(Row, { 
        cells: row, 
        key: rowIndex, 
        rowIndex,
        activePieceCoords,
        activePieceType
      })
    )
  );
};

const Controls = ({ onMove, onRotate, onNewPiece, onInitGame, disabled, gameInitialized }) => {
  return h('div', { class: 'mt-6 grid grid-cols-3 gap-3 max-w-md mx-auto' }, [
    h('button', { 
      class: `btn col-start-1 col-span-3 p-4 bg-green-600 rounded-lg ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-green-500 font-bold'} mb-4`, 
      onClick: () => !disabled && onInitGame(),
      disabled
    }, 'Initialize Game'),
    
    h('button', { 
      class: `btn col-start-1 col-span-3 p-4 bg-blue-600 rounded-lg ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-500 font-bold'} mb-4`, 
      onClick: () => !disabled && onNewPiece(),
      disabled
    }, 'Generate New Piece'),
    
    h('button', { 
      class: `btn col-start-1 p-4 bg-indigo-600 rounded-lg ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-500 font-bold'}`, 
      onClick: () => !disabled && onMove('izquierda'),
      disabled
    }, 'Move Left'),
    
    h('button', { 
      class: `btn col-start-2 p-4 bg-indigo-600 rounded-lg ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-500 font-bold'}`, 
      onClick: () => !disabled && onMove('abajo'),
      disabled
    }, 'Move Down'),
    
    h('button', { 
      class: `btn col-start-3 p-4 bg-indigo-600 rounded-lg ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-indigo-500 font-bold'}`, 
      onClick: () => !disabled && onMove('derecha'),
      disabled
    }, 'Move Right'),
    
    h('button', { 
      class: `btn col-start-1 col-span-3 p-4 bg-purple-600 rounded-lg ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-purple-500 font-bold'} mt-4`, 
      onClick: () => !disabled && onRotate('derecha'),
      disabled
    }, 'Rotate Piece')
  ]);
};

const GameInfo = ({ gameState, apiStatus, activePiece }) => {
  // Get the piece color class based on the type
  const getPieceColorClass = (tipo) => {
    return COLORS[tipo] || 'bg-gray-500';
  };
  
  return h('div', { class: 'mt-4 text-center' }, [
    h('p', { class: 'text-lg' }, `Game Status: ${gameState.gameOver ? 'Game Over' : 'Playing'}`),
    
    activePiece && h('div', { class: 'mt-2 p-3 bg-gray-800 rounded border border-gray-600' }, [
      h('div', { class: 'flex items-center justify-center gap-2 mb-2' }, [
        h('div', { 
          class: `w-6 h-6 ${getPieceColorClass(activePiece.tipo)} rounded` 
        }),
        h('p', { class: 'text-lg font-bold' }, `Active Piece: ${activePiece.tipo || 'Unknown'}`)
      ]),
      h('p', { class: 'text-md' }, `Position: (${activePiece.x}, ${activePiece.y})`),
      activePiece.coordenadasBloques && activePiece.coordenadasBloques.length > 0 && 
        h('div', { class: 'mt-2 text-sm' }, [
          h('p', { class: 'font-semibold' }, 'Block Coordinates:'),
          h('div', { class: 'grid grid-cols-2 mt-1 gap-1' },
            activePiece.coordenadasBloques.map((coord, idx) => 
              h('span', { class: 'text-xs py-1 px-2 bg-gray-700 rounded' }, `(${coord.x},${coord.y})`)
            )
          )
        ])
    ]),
    
    apiStatus && h('p', { class: `text-sm mt-3 ${apiStatus.includes('Error') ? 'text-red-400' : 'text-green-400'}` }, apiStatus),
    
    h('p', { class: 'text-xs text-gray-400 mt-3' }, `API URL: ${API_URL}`),
    h('div', { class: 'mt-2 text-xs text-gray-400' }, [
      h('p', { class: 'mb-1' }, 'Board positions:'),
      h('pre', { class: 'text-left inline-block bg-gray-700 p-2 rounded' }, 
        '(0,0)      (9,0)\n' +
        '  +----------+\n' +
        '  |          |\n' +
        '  |  BOARD   |\n' +
        '  |  10×20   |\n' +
        '  |          |\n' +
        '  +----------+\n' +
        '(0,19)     (9,19)'
      )
    ])
  ]);
};

// Calculate coordinates of the blocks in a tetramino
const calculateBlockCoordinates = (tetramino, offsetX, offsetY) => {
  const coords = [];
  if (!tetramino || !tetramino.matriz) return coords;
  
  for (let y = 0; y < tetramino.matriz.length; y++) {
    for (let x = 0; x < tetramino.matriz[y].length; x++) {
      if (tetramino.matriz[y][x] === 1) {
        coords.push({ x: offsetX + x, y: offsetY + y });
      }
    }
  }
  return coords;
};

// Main App Component
const App = () => {
  const [board, setBoard] = useState(Array(20).fill().map(() => Array(10).fill(0)));
  const [gameState, setGameState] = useState({ gameOver: false });
  const [loading, setLoading] = useState(false);
  const [apiStatus, setApiStatus] = useState('');
  const [gameInitialized, setGameInitialized] = useState(false);
  const [activePiece, setActivePiece] = useState(null);

  // Initialize the game
  const initGame = async () => {
    try {
      setLoading(true);
      setApiStatus('Initializing game...');
      
      const data = await request('/juego/iniciar', 'POST');
      
      setBoard(data.estado);
      setGameState({ gameOver: false });
      setGameInitialized(true);
      setActivePiece(null);
      setApiStatus('Game initialized! Click "New Piece" to start.');
    } catch (error) {
      console.error('Failed to initialize game:', error);
      setApiStatus(`Error: Failed to initialize game. Make sure the backend services are running.`);
      setGameInitialized(false);
    } finally {
      setLoading(false);
    }
  };

  // Load the board state
  const loadBoard = async () => {
    if (!gameInitialized) return;
    
    try {
      setApiStatus('Loading board...');
      const data = await request('/juego/tablero');
      setBoard(data.estado);
      setApiStatus('');
    } catch (error) {
      console.error('Failed to load board:', error);
      setApiStatus('Error: Failed to load board state');
    }
  };

  // Generate a new tetramino
  const generatePiece = async () => {
    if (!gameInitialized) {
      await initGame();
      if (!gameInitialized) return;
    }
    
    try {
      setLoading(true);
      setApiStatus('Generating new piece...');
      
      const result = await request('/juego/tetramino', 'POST');
      
      if (!result.exito) {
        setGameState({ gameOver: true });
        setApiStatus('Game Over! No space for new pieces.');
      } else {
        // Update active piece info if available in the response
        if (result.tetramino) {
          const posX = result.x !== undefined ? result.x : 3; // Default to center if not provided
          const posY = result.y !== undefined ? result.y : 0;  // Default to top if not provided
          
          // If coordinates aren't provided, calculate them from the tetramino matrix
          const coordenadasBloques = result.coordenadasBloques || 
            calculateBlockCoordinates(result.tetramino, posX, posY);
          
          setActivePiece({
            tipo: result.tetramino.tipo,
            matriz: result.tetramino.matriz,
            x: posX,
            y: posY,
            coordenadasBloques
          });
        }
        
        // Always load board after generating a piece to see the current state
        await loadBoard();
        
        setApiStatus('Piece generated successfully!');
      }
    } catch (error) {
      console.error('Failed to generate piece:', error);
      setApiStatus('Error: Failed to generate new piece');
    } finally {
      setLoading(false);
    }
  };

  // Move the active piece
  const movePiece = async (direction) => {
    if (!gameInitialized || gameState.gameOver) return;
    
    try {
      setLoading(true);
      setApiStatus(`Moving piece ${direction}...`);
      
      const result = await request('/juego/deslizar', 'POST', { direccion: direction });
      
      // Always load the board to see the result of the movement
      await loadBoard();
      
      // If movement was successful and the active piece was returned
      if (result.exito && result.tetramino) {
        const posX = result.x !== undefined ? result.x : (activePiece ? activePiece.x : 3);
        const posY = result.y !== undefined ? result.y : (activePiece ? activePiece.y : 0);
        
        // Calculate or use provided coordinates
        const coordenadasBloques = result.coordenadasBloques || 
          calculateBlockCoordinates(result.tetramino, posX, posY);
          
        setActivePiece({
          tipo: result.tetramino.tipo,
          matriz: result.tetramino.matriz,
          x: posX,
          y: posY, 
          coordenadasBloques
        });
        
        setApiStatus(`Moved piece ${direction} successfully`);
      }
      // If movement down failed, it means the piece is locked, generate a new piece
      else if (!result.exito && direction === 'abajo') {
        setApiStatus('Piece locked in place, generating new piece...');
        setActivePiece(null);
        // Add small delay before generating next piece
        setTimeout(generatePiece, 300);
      }
      else if (!result.exito) {
        setApiStatus(`Could not move piece ${direction}`);
      }
    } catch (error) {
      console.error(`Failed to move piece ${direction}:`, error);
      setApiStatus(`Error: Failed to move piece ${direction}`);
    } finally {
      setLoading(false);
    }
  };

  // Rotate the active piece
  const rotatePiece = async (direction) => {
    if (!gameInitialized || gameState.gameOver) return;
    
    try {
      setLoading(true);
      setApiStatus('Rotating piece...');
      
      const result = await request('/juego/girar', 'POST', { direccion: direction });
      
      // Always load the board after rotation
      await loadBoard();
      
      if (result.exito && result.tetramino) {
        const posX = result.x !== undefined ? result.x : (activePiece ? activePiece.x : 3);
        const posY = result.y !== undefined ? result.y : (activePiece ? activePiece.y : 0);
        
        // Calculate or use provided coordinates
        const coordenadasBloques = result.coordenadasBloques || 
          calculateBlockCoordinates(result.tetramino, posX, posY);
          
        setActivePiece({
          tipo: result.tetramino.tipo,
          matriz: result.tetramino.matriz,
          x: posX,
          y: posY,
          coordenadasBloques
        });
        
        setApiStatus('Rotation successful!');
      } else {
        setApiStatus(`Rotation failed: ${result.motivo || 'Could not rotate in that direction'}`);
      }
    } catch (error) {
      console.error('Failed to rotate piece:', error);
      setApiStatus('Error: Failed to rotate piece');
    } finally {
      setLoading(false);
    }
  };

  // Initialize on component mount
  useEffect(() => {
    debug(`Frontend initialized, connecting to API: ${API_URL}`);
    // Auto-initialize when the app loads
    initGame();
    
    // Cleanup on unmount
    return () => {
      debug('Component unmounting, performing cleanup');
    };
  }, []);

  // Auto-drop functionality is optional for the demo
  // Commenting out to simplify testing
  /*
  useEffect(() => {
    // Only auto-drop if game is active and not loading
    if (gameState.gameOver || loading || !gameInitialized || !activePiece) return;

    const intervalId = setInterval(() => {
      debug('Auto-dropping piece');
      movePiece('abajo');
    }, 1000); // Drop every second

    return () => clearInterval(intervalId);
  }, [gameState.gameOver, loading, gameInitialized, activePiece]);
  */

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameState.gameOver || loading || !gameInitialized) return;

      switch (e.key) {
        case 'ArrowLeft':
          movePiece('izquierda');
          break;
        case 'ArrowRight':
          movePiece('derecha');
          break;
        case 'ArrowDown':
          movePiece('abajo');
          break;
        case 'ArrowUp':
          rotatePiece('derecha');
          break;
        case ' ':  // Spacebar
          generatePiece();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameState.gameOver, loading, gameInitialized]);

  return h('div', { class: 'flex flex-col items-center' }, [
    h('h1', { class: 'text-3xl font-bold mb-6' }, 'Tetris Game'),
    h(Board, { board, activePiece }),
    h(Controls, { 
      onMove: movePiece, 
      onRotate: rotatePiece, 
      onNewPiece: generatePiece,
      onInitGame: initGame,
      disabled: loading || (gameState.gameOver && gameInitialized),
      gameInitialized
    }),
    h(GameInfo, { gameState, apiStatus, activePiece }),
    gameState.gameOver && h('button', { 
      class: 'mt-4 p-3 bg-red-700 rounded-lg hover:bg-red-600', 
      onClick: initGame,
      disabled: loading
    }, 'Restart Game'),
    loading && h('div', { class: 'mt-4 text-xl animate-pulse' }, 'Loading...')
  ]);
};

// Render the app
render(h(App), document.getElementById('app')); 