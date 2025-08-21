const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = 8080;

// CORS para permitir conexiones desde cualquier origen
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Servir archivos estáticos
app.use(express.static(path.join(__dirname)));

// Ruta principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-browser.html'));
});

// Ruta para el archivo de test
app.get('/test', (req, res) => {
  res.sendFile(path.join(__dirname, 'test-browser.html'));
});

app.listen(PORT, () => {
  console.log(`🌐 Servidor de test corriendo en http://localhost:${PORT}`);
  console.log(`📄 Abre http://localhost:${PORT}/test en tu navegador`);
}); 