import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pagosRoutes from './routes/pagos.routes';

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use('/', pagosRoutes);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ [${process.env.SERVICE_NAME}] Corriendo en puerto ${PORT}`);
});

