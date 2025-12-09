import { Request, Response } from 'express';
import { SagaService } from '../services/saga.service';


export class SagaController {
  private sagaService: SagaService;

  constructor() {
    this.sagaService = new SagaService();
  }

  comprar = async (req: Request, res: Response): Promise<void> => {
    try {
      if (!req.body || typeof req.body !== 'object') {
        console.error('[Orquestador] req.body es undefined o inválido');
        console.error('[Orquestador] Content-Type recibido:', req.get('Content-Type'));
        console.error('[Orquestador] Body raw:', req.body);
        res.status(400).json({
          success: false,
          message: 'El cuerpo de la petición está vacío o no es válido. Asegúrate de enviar Content-Type: application/json y un body JSON válido',
          hint: 'En Postman, selecciona "Body" > "raw" > "JSON" y envía: {"usuario": "juan123", "productoId": 1, "cantidad": 2}'
        });
        return;
      }

      const { usuario, productoId, cantidad } = req.body;

      if (!usuario || productoId === undefined || cantidad === undefined) {
        res.status(400).json({
          success: false,
          message: 'Faltan parámetros: usuario, productoId, cantidad',
          recibido: req.body
        });
        return;
      }

      const resultado = await this.sagaService.ejecutarSagaCompra(usuario, productoId, cantidad);

      const statusCode = resultado.success ? 200 : 409;
      res.status(statusCode).json(resultado);
    } catch (error: any) {
      console.error('[Orquestador] Error inesperado:', error);
      console.error('[Orquestador] Stack:', error.stack);
      
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Error interno del servidor',
          error: error.message || 'Error desconocido'
        });
      }
    }
  };

  health = (req: Request, res: Response): void => {
    res.json({ status: 'OK', service: 'Orquestador Saga' });
  };
}

