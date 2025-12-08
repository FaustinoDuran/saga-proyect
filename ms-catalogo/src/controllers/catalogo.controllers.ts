import {Request, Response} from 'express';
import { CatalogoService } from '../services/catalogo.services';
import { LatenciaUtil } from '../../../shared/utils/latencia.util';
import { ApiResponse } from '../../../shared/types/response.types';
import { Producto } from '../../../shared/types/producto.types';



export class CatalogoController {
    private catalogoService: CatalogoService;

    constructor(){
        this.catalogoService = new CatalogoService();
    }

    obtenerProducto = async (req: Request, res: Response): Promise<void> => {
        try {
            await LatenciaUtil.simular();
            const { id } = req.params;
            const producto: Producto = id ? this.catalogoService.obtenerProductoPorId(Number(id)) : this.catalogoService.obtenerProductoAleatorio();
            console.log(`ms-catalogo: producto colicitado: ${producto.nombre}`);

            const response: ApiResponse<Producto> = {
                success: true,
                message: 'Producto obtenido exitosamente',
                data: producto,
                timestamp: new Date().toISOString()
            };

            res.status(200).json(response);

        } catch (error) {
            console.error('[ms-catalogo] Error: ', error);

            const errorResponse: ApiResponse = {
                success: false,
                message: 'Error al obtener el producto',
                timestamp: new Date().toISOString()
            };

            res.status(500).json(errorResponse);
        }
    };
}