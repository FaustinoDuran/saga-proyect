import { Request, Response } from "express";
import { InventarioService } from "../services/inventario.service";
import { LatenciaUtil } from "@shared/utils/latencia.util";


export class InventarioController {

    private inventarioService: InventarioService;

    constructor() {
        this.inventarioService = new InventarioService();
    }

    procesarActualizacion = async (req: Request, res: Response): Promise<void> => {
        try {
            await LatenciaUtil.simular();
            const {productoId, stock} = req.body;
            const exito = this.inventarioService.actualizarStock(productoId, stock);
        
            if (exito) {
                res.status(200).json ({
                    succes:true,
                    message:'Se actualizo el stock correctamente',
                    productoId,
                    stock
            });
        }   else {
                res.status(409).json ({
                    succes:false,
                    message:'No se pudo actualizar el stock correctamente',
                    timeStamp: new Date().toISOString()
                });
            };
        }
        catch (error) {
            console.error('[ms-compras] Error:', error);
            res.status(500).json({
                success:false,
                message:'Error interno del servidor',
                timestamp: new Date().toISOString()
            });
        }
    }

    compensarActualizacion = async (res: Response, req: Request): Promise<void> => {
        try {
            await LatenciaUtil.simular();
            const {productoId, stock} = req.body;

            this.inventarioService.compensarStock(productoId, stock);

            res.status(200).json({
                succes: true,
                message: 'Stock compensado exitosamente',
                productoId,
                stock
            });
        }
        catch (error) {
            console.log('[ms-inventario] Error en compensación', error)
            res.status(500).json({
                succes:false,
                message:'Error del servidor'
            });
        }
        
    }
}
