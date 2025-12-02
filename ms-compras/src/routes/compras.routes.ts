import { Router } from "express";
import { CompraController } from "../controller/compras.controller";


const router = Router();
const comprasController = new CompraController;

router.post('/transaccion', comprasController.procesarTransaccion);
router.post('/compensar', comprasController.compensarCompra);

export default router;

