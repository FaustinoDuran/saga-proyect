import { Router } from 'express';
import { InventarioController } from '../controller/inventario.controller';

/**
 * Configuración de rutas del microservicio de inventario
 */
const router = Router();
const inventarioController = new InventarioController();

// Rutas de inventario
router.post('/transaccion', inventarioController.procesarTransaccion);
router.post('/compensar', inventarioController.compensar);

export default router;

