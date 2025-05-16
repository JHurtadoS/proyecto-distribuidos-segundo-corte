FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --silent
COPY . .
RUN npm run build
ENV PORT=3000
EXPOSE $PORT
CMD ["node","dist/main.js"] 