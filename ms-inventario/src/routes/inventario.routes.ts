import { Router } from 'express';
import { InventarioController } from '../controller/inventario.controller';

const router = Router();
const inventarioController = new InventarioController();

router.post('/transaccion', inventarioController.procesarTransaccion);
router.post('/compensar', inventarioController.compensar);

export default router;

