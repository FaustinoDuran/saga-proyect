import { Request, Response } from 'express';
import { PagosService } from '../services/pagos.service';
import { LatenciaUtil } from '../../../shared/utils/latencia.util';

export class PagosController {
  private pagosService: PagosService;

  constructor() {
    this.pagosService = new PagosService();
  }

  procesarTransaccion = async (req: Request, res: Response): Promise<void> => {
    try {
      await LatenciaUtil.simular();
      
      const { monto, metodoPago, usuario } = req.body;
      
      const exito = this.pagosService.procesarPago(monto, metodoPago, usuario);
      
      if (exito) {
        res.status(200).json({
          success: true,
          message: 'Pago procesado exitosamente',
          transaccionId: this.pagosService.generarTransaccionId(),
          monto,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(409).json({
          success: false,
          message: 'Pago rechazado - Fondos insuficientes o error en procesamiento',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('[ms-pagos] Error:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };

  compensar = async (req: Request, res: Response): Promise<void> => {
    try {
      await LatenciaUtil.simular();
      
      const { transaccionId, monto } = req.body;
      
      this.pagosService.compensarPago(transaccionId, monto);
      
      res.status(200).json({
        success: true,
        message: 'Reembolso procesado exitosamente',
        transaccionId,
        monto,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[ms-pagos] Error en compensación:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };
}

