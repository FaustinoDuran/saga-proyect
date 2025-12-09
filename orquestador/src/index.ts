import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import sagaRoutes from './routes/saga.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares en orden correcto
app.use(cors());

// Body parser - debe ir antes de las rutas
app.use(express.json({ 
  limit: '10mb',
  strict: true 
}));
app.use(express.urlencoded({ 
  extended: true,
  limit: '10mb'
}));

// Middleware de logging (después del body parser)
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
    console.log(`[Orquestador] Content-Type: ${req.get('Content-Type')}`);
    console.log(`[Orquestador] Body recibido:`, JSON.stringify(req.body, null, 2));
  }
  next();
});

app.use('/', sagaRoutes);

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

process.on('unhandledRejection', (reason, promise) => {
  console.error('[Orquestador] Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('[Orquestador] Uncaught Exception:', error);
  console.error('[Orquestador] Stack:', error.stack);
});

const server = app.listen(PORT, () => {
  console.log('\n========================================');
  console.log(`🎯 [${process.env.SERVICE_NAME}] Corriendo en puerto ${PORT}`);
  console.log('========================================\n');
  console.log('Endpoints disponibles:');
  console.log(`  POST http://localhost:${PORT}/comprar`);
  console.log(`  GET  http://localhost:${PORT}/health\n`);
});

server.on('error', (error: any) => {
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Error: El puerto ${PORT} ya está en uso`);
    console.error('💡 Solución: Cierra la otra instancia o cambia el puerto en .env');
    process.exit(1);
  } else {
    console.error('[Orquestador] Error del servidor:', error);
  }
});

process.on('SIGTERM', () => {
  console.log('[Orquestador] SIGTERM recibido, cerrando servidor...');
  server.close(() => {
    console.log('[Orquestador] Servidor cerrado');
    process.exit(0);
  });
});

