import { Router } from 'express';
import { PagosController } from '../controllers/pagos.controller';

/**
 * Configuración de rutas del microservicio de pagos
 */
const router = Router();
const pagosController = new PagosController();

// Rutas de pagos
router.post('/transaccion', pagosController.procesarTransaccion);
router.post('/compensar', pagosController.compensar);

export default router;

