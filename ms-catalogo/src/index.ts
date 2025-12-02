import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import catalogoRoutes from './routes/catalogo.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.use('/', catalogoRoutes);

app.listen(PORT, () => {
    console.log(`${process.env.SERVICE_NAME} is running on port ${PORT}`);
});



