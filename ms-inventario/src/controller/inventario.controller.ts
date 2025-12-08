import { Request, Response } from "express";
import { InventarioService } from "../services/inventario.service";
import { LatenciaUtil } from '../../../shared/utils/latencia.util';


export class InventarioController {

    private inventarioService: InventarioService;

    constructor() {
        this.inventarioService = new InventarioService();
    }

    /**
     * Endpoint para actualizar el inventario
     * Retorna 200 o 409 aleatoriamente
     */
    procesarTransaccion = async (req: Request, res: Response): Promise<void> => {
        try {
            await LatenciaUtil.simular();
            const { productoId, cantidad } = req.body;
            
            const hayStock = this.inventarioService.actualizarStock(productoId, cantidad);
            
            if (hayStock) {
                res.status(200).json({
                    success: true,
                    message: 'Inventario actualizado exitosamente',
                    productoId,
                    cantidadDescontada: cantidad,
                    stockRestante: this.inventarioService.generarStockRestante(),
                    timestamp: new Date().toISOString()
                });
            } else {
                res.status(409).json({
                    success: false,
                    message: 'Stock insuficiente - No se puede procesar la compra',
                    productoId,
                    stockDisponible: 0,
                    timestamp: new Date().toISOString()
                });
            }
        } catch (error) {
            console.error('[ms-inventario] Error:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    };

    /**
     * Endpoint para compensar (restaurar stock)
     * Siempre retorna 200
     */
    compensar = async (req: Request, res: Response): Promise<void> => {
        try {
            await LatenciaUtil.simular();
            
            const { productoId, cantidad } = req.body;
            
            this.inventarioService.compensarStock(productoId, cantidad);
            
            res.status(200).json({
                success: true,
                message: 'Stock restaurado exitosamente',
                productoId,
                cantidadRestaurada: cantidad,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('[ms-inventario] Error en compensación:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    };
}
