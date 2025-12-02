import {Router} from 'express';
import { CatalogoController } from '../controllers/catalogo.controllers';

const router =  Router();
const catalogoController = new CatalogoController();


router.get('/producto', catalogoController.obtenerProducto.bind(catalogoController));

router.get('/producto/:id', catalogoController.obtenerProducto.bind(catalogoController));

export default router;