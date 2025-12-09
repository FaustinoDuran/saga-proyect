import { Router } from 'express';
import { PagosController } from '../controllers/pagos.controller';

const router = Router();
const pagosController = new PagosController();

router.post('/transaccion', pagosController.procesarTransaccion);
router.post('/compensar', pagosController.compensar);

export default router;

