import { Router } from 'express';
import { SagaController } from '../controllers/saga.controller';

/**
 * Configuración de rutas del orquestador
 */
const router = Router();
const sagaController = new SagaController();

// Rutas del orquestador
router.post('/comprar', sagaController.comprar);
router.get('/health', sagaController.health);

export default router;

