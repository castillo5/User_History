import express from 'express';
import cors from 'cors';

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas de ejemplo
app.get('/', (req, res) => {
  res.send('Servidor levantado, milagrosamente.');
});

export default app;
