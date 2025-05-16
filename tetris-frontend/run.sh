#!/bin/bash
echo "Tetris Frontend Runner"

if [ "$1" == "prod" ]; then
  echo "Starting in PRODUCTION mode..."
  npm install && npm run prod
else
  echo "Starting in DEVELOPMENT mode..."
  npm install && npm start
fi

echo ""
echo "To run in production mode: ./run.sh prod" 