# Tetris Frontend

A simple frontend UI for interacting with the Tetris microservices system.

## Technologies

- **Preact** (via CDN) - A lightweight alternative to React
- **Tailwind CSS** (via CDN) - Utility-first CSS framework
- **Vite** - Fast development server and bundler

## Running Locally

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open your browser at http://localhost:5173

### For Windows Users

Simply double-click the `run.cmd` file to install dependencies and start the application.

## Connecting to Backend Services

By default, the frontend will connect to the backend services through:

1. In development mode: Using a Vite proxy at `/api` (which forwards to http://localhost:8080)
2. In production mode: Using the `VITE_API_URL` environment variable or http://localhost:8080 by default

### Starting the Backend Services

Before using the frontend, ensure your backend microservices are running:

1. Start all microservices in the coordinada or orquestada mode:

```bash
cd ..
docker-compose up -d
```

2. Verify the cliente-service is running and accessible on port 8080 (the gateway for all other services)

3. If the cliente-service is running on a different port or host, update the VITE_API_URL:

```bash
# Linux/Mac
export VITE_API_URL=http://your-host:your-port

# Windows Command Prompt
set VITE_API_URL=http://your-host:your-port

# Windows PowerShell
$env:VITE_API_URL="http://your-host:your-port"
```

## API Connection Flow

This frontend works by communicating with the backend microservices in the following flow:

1. Frontend → cliente-service (API Gateway, port 8080)
2. cliente-service → Individual microservices:
   - verificadortablero-service (manages the game board)
   - generador-service (creates new Tetris pieces)
   - girador-service (rotates pieces)
   - deslizador-service (moves pieces)

The state flow is updated after each action:

1. User performs action (move, rotate, new piece)
2. Frontend sends request to API
3. Backend updates game state
4. Frontend fetches updated board state
5. UI refreshes to show the new state

## Game Controls

- **Arrow Keys**: Move the tetramino (left, right, down)
- **Up Arrow**: Rotate the tetramino
- **Space**: Generate a new tetramino
- **Buttons**: UI controls for the same actions

## Structure

- `index.html` - Main HTML file with Preact and Tailwind CSS loaded via CDN
- `src/main.js` - Main application code with UI components and game logic
- `Dockerfile` - Docker configuration for containerizing the frontend
- `docker-compose.frontend.yml` - Docker Compose configuration for running with other services
- `vite.config.js` - Vite configuration including the API proxy for development
