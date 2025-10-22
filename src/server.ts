import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas
app.use('/auth', authRoutes);

app.get('/', (_req, res) => {
  res.send('Servidor User_History en ejecución.');
});

export default app;
