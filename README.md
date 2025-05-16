# Sistema Distribuido de Tetris

Este proyecto implementa un juego de Tetris mediante una arquitectura de microservicios. El sistema está compuesto por 5 microservicios independientes que se comunican entre sí para proporcionar la funcionalidad completa del juego.

## Arquitectura

El sistema sigue una arquitectura distribuida con los siguientes componentes:

1. **VerificadorTablero**: Mantiene el estado del tablero de juego y verifica las colisiones
2. **Generador**: Crea nuevas piezas de Tetris aleatorias
3. **Girador**: Rota las piezas de Tetris
4. **Deslizador**: Mueve las piezas horizontal y verticalmente
5. **Cliente**: Punto de entrada para el jugador, coordina las operaciones entre servicios

El sistema puede funcionar en dos modos:

- **Coordinada**: Los microservicios se llaman directamente entre sí
- **Orquestada**: Se utiliza un middleware central para coordinar las operaciones entre servicios

## Tecnologías Utilizadas

- **Backend**: NestJS (Node.js + TypeScript)
- **Contenedores**: Docker y Docker Compose
- **Documentación API**: Swagger
- **Comunicación**: REST APIs

## Requisitos de Sistema

- Docker y Docker Compose instalados
- Node.js v18 o superior (solo para desarrollo)
- 4GB RAM mínimo recomendado

## Configuración de Puertos

Los servicios utilizan los siguientes puertos:

- **Cliente**: 8080 (entrada principal para el jugador)
- **Generador**: 3001
- **Girador**: 3002
- **VerificadorTablero**: 3003
- **Deslizador**: 3004
- **Middleware** (solo en modo orquestado): 3005

## Instrucciones de Ejecución

### Ejecutar con Docker Compose

1. Clonar el repositorio:

   ```bash
   git clone <url-del-repositorio>
   cd proyecto-tetris
   ```

2. Iniciar los servicios:

   ```bash
   # Modo coordinado (por defecto)
   docker-compose up -d

   # O especificar modo orquestado
   MODO=orquestada docker-compose up -d
   ```

3. Acceder a la aplicación en `http://localhost:8080`

4. Para detener los servicios:
   ```bash
   docker-compose down
   ```

### Documentación API (Swagger)

Cada microservicio expone su documentación Swagger en la ruta `/api`:

- Cliente: `http://localhost:8080/api`
- Generador: `http://localhost:3001/api`
- Girador: `http://localhost:3002/api`
- VerificadorTablero: `http://localhost:3003/api`
- Deslizador: `http://localhost:3004/api`

## Funciones Principales según el Diagrama

El sistema implementa las siguientes funciones clave:

1. `actualizarTablero(tetramino, coords)`: Actualiza el tablero con un tetramino en las coordenadas especificadas
2. `girarTetramino(tetramino)`: Rota un tetramino 90 grados
3. `getTablero()`: Obtiene el estado actual del tablero
4. `getTetramino()`: Genera un nuevo tetramino aleatorio
5. `deslizarTetramino(tetramino, distancia)`: Mueve un tetramino en la dirección especificada

## Desarrollo

Para desarrollo local sin Docker:

1. Instalar dependencias en cada microservicio:

   ```bash
   cd <servicio>-service
   npm install
   ```

2. Iniciar cada servicio:
   ```bash
   npm run start:dev
   ```

## Estructura del Proyecto

- `verificadortablero-service/`: Gestiona el estado del tablero y validaciones
- `generador-service/`: Genera piezas aleatorias
- `girador-service/`: Rota piezas
- `deslizador-service/`: Mueve piezas
- `cliente-service/`: Fachada principal para el usuario
- `docker-compose.yml`: Configuración para despliegue con Docker

## Resolución de Problemas

- **Error al iniciar servicios**: Verificar que no haya servicios usando los mismos puertos
- **Error de conexión entre servicios**: Asegurarse de que todos los contenedores estén funcionando
- **Los servicios no responden**: Verificar los logs con `docker-compose logs <servicio>`

## Licencia

Este proyecto está bajo la licencia MIT.
