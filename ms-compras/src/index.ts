import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3004;

app.use(express.json());

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});

