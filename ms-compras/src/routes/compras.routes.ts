import { Router } from 'express';
import { CompraController } from '../controller/compras.controller';

/**
 * Configuración de rutas del microservicio de compras
 */
const router = Router();
const comprasController = new CompraController();

// Rutas de compras
router.post('/transaccion', comprasController.procesarTransaccion);
router.post('/compensar', comprasController.compensarCompra);

export default router;

