# Renta-Uber Backend
FROM node:18-alpine AS base
WORKDIR /app

# Copiar package files y dependencias
COPY renta-uber-backend/package*.json ./renta-uber-backend/
RUN cd renta-uber-backend && npm install --production && npm install -g ts-node typescript

# Copiar el resto del código fuente
COPY renta-uber-backend ./renta-uber-backend

# Exponer puerto API
EXPOSE 3001

# Comando de inicio
CMD ["ts-node", "renta-uber-backend/server-simple.ts"]