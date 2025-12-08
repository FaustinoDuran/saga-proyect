import { Request, Response } from 'express';
import { CompraService } from '../services/compras.service';
import { LatenciaUtil } from '../../../shared/utils/latencia.util';

export class CompraController {
    private compraService: CompraService;

    constructor() {
        this.compraService = new CompraService();
    }

    procesarTransaccion = async (req: Request, res: Response): Promise<void> => {
        try {
            await LatenciaUtil.simular();
            const { usuario, productoId, cantidad, monto } = req.body;
            const exito = this.compraService.registrarCompra(usuario, productoId, cantidad, monto)

            if (exito) { 
                res.status(200).json({
                    success:true,
                    message:'Compra registrada exitosamente',
                    compraId: this.compraService.generarCompraId(),
                    usuario,
                    productoId,
                    cantidad,
                    monto,
                    timestamp: new Date().toISOString()
                });
            } else {
                res.status(409).json({
                    success:false,
                    message:'La compra no pudo ser registrada',
                    timestamp: new Date().toISOString()
                });
            };
        } catch (error) {
            console.error('[ms-compras] Error:', error);
            res.status(500).json({
                success:false,
                message:'Error interno del servidor',
                timestamp: new Date().toISOString()
            });
        }
    };

    compensarCompra = async (req: Request, res: Response): Promise<void> => {
        try {
            await LatenciaUtil.simular();
            const { compraId, usuario } = req.body;

            this.compraService.compensarCompra(compraId, usuario);

            res.status(200).json({
                success: true,
                message: 'Compra cancelada exitosamente',
                compraId,
                usuario,
                timestamp: new Date().toISOString()
            });
        } catch (error) {
            console.error('[ms-compras] Error en compensación:', error);
            res.status(500).json({
                success: false,
                message: 'Error interno del servidor'
            });
        }
    };
    }