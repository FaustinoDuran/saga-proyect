import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pagosRoutes from './routes/pagos.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.use('/', pagosRoutes);

process.on('unhandledRejection', (reason, promise) => {
  console.error('[ms-pagos] Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[ms-pagos] Uncaught Exception:', error);
});

const server = app.listen(PORT, () => {
  console.log(`[${process.env.SERVICE_NAME}] Corriendo en puerto ${PORT}`);
});

server.on('error', (error: any) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`Error: El puerto ${PORT} ya está en uso`);
    process.exit(1);
  } else {
    console.error('[ms-pagos] Error del servidor:', error);
  }
});

