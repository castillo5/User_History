import express from 'express';
import cors from 'cors';
import routes from './routes';

const app = express();

// Middlewares globales
app.use(cors());
app.use(express.json());

// Rutas base
app.use('/', routes);

app.get('/', (_req, res) => {
  res.send('Servidor User_History en ejecución.');
});

export default app;
