import { Router } from 'express';
import { SagaController } from '../controllers/saga.controller';

const router = Router();
const sagaController = new SagaController();

router.post('/comprar', sagaController.comprar);
router.get('/health', sagaController.health);

export default router;

