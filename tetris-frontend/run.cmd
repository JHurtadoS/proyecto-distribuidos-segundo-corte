@echo off
echo Tetris Frontend Runner

IF "%1"=="prod" (
  echo Starting in PRODUCTION mode...
  npm install && npm run prod
) ELSE (
  echo Starting in DEVELOPMENT mode...
  npm install && npm start
)

echo.
echo To run in production mode: run.cmd prod 