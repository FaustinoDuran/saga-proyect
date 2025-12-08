import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import inventarioRoutes from './routes/inventario.routes';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3003;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/', inventarioRoutes);

// Manejar errores no capturados
process.on('unhandledRejection', (reason, promise) => {
  console.error('[ms-inventario] Unhandled Rejection:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[ms-inventario] Uncaught Exception:', error);
});

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log(`✅ [${process.env.SERVICE_NAME}] Corriendo en puerto ${PORT}`);
});

server.on('error', (error: any) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Error: El puerto ${PORT} ya está en uso`);
    process.exit(1);
  } else {
    console.error('[ms-inventario] Error del servidor:', error);
  }
});

