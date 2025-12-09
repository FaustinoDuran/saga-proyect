import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import comprasRoutes from './routes/compras.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

app.use(cors());
app.use(express.json());

app.use('/', comprasRoutes);

process.on('unhandledRejection', (reason, promise) => {
  console.error('[ms-compras] Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[ms-compras] Uncaught Exception:', error);
});

const server = app.listen(PORT, () => {
  console.log(`✅ [${process.env.SERVICE_NAME}] Corriendo en puerto ${PORT}`);
});

server.on('error', (error: any) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Error: El puerto ${PORT} ya está en uso`);
    process.exit(1);
  } else {
    console.error('[ms-compras] Error del servidor:', error);
  }
});



