import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sagaRoutes from './routes/saga.routes';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Middleware de logging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Rutas
app.use('/', sagaRoutes);

// Manejador de errores global
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('[Orquestador] Error no manejado:', err);
  if (!res.headersSent) {
    res.status(500).json({
      success: false,
      message: 'Error interno del servidor',
      error: err.message || 'Error desconocido'
    });
  }
});

// Manejar errores no capturados ANTES de iniciar el servidor
process.on('unhandledRejection', (reason, promise) => {
  console.error('[Orquestador] Unhandled Rejection at:', promise, 'reason:', reason);
  // No hacer exit para que el servidor siga corriendo
});

process.on('uncaughtException', (error) => {
  console.error('[Orquestador] Uncaught Exception:', error);
  console.error('[Orquestador] Stack:', error.stack);
  // No hacer exit inmediatamente, dejar que el servidor intente continuar
});

// Iniciar servidor
const server = app.listen(PORT, () => {
  console.log('\n========================================');
  console.log(`🎯 [${process.env.SERVICE_NAME}] Corriendo en puerto ${PORT}`);
  console.log('========================================\n');
  console.log('Endpoints disponibles:');
  console.log(`  POST http://localhost:${PORT}/comprar`);
  console.log(`  GET  http://localhost:${PORT}/health\n`);
});

// Manejar cierre del servidor
server.on('error', (error: any) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Error: El puerto ${PORT} ya está en uso`);
  } else {
    console.error('[Orquestador] Error del servidor:', error);
  }
});

