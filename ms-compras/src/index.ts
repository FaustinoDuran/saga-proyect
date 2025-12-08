import express from 'express';
import dotenv from 'dotenv';
import comprasRoutes from '../src/routes/compras.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json());

app.use('/', comprasRoutes);

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});



