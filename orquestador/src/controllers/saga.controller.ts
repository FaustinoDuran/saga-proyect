import { Request, Response } from 'express';
import { SagaService } from '../services/saga.service';

/**
 * Controlador que maneja las peticiones HTTP del orquestador
 */
export class SagaController {
  private sagaService: SagaService;

  constructor() {
    this.sagaService = new SagaService();
  }

  /**
   * Endpoint principal que inicia la saga de compra
   */
  comprar = async (req: Request, res: Response): Promise<void> => {
    try {
      const { usuario, productoId, cantidad } = req.body;

      // Validación básica
      if (!usuario || !productoId || !cantidad) {
        res.status(400).json({
          success: false,
          message: 'Faltan parámetros: usuario, productoId, cantidad'
        });
        return;
      }

      // Ejecutar la saga
      const resultado = await this.sagaService.ejecutarSagaCompra(usuario, productoId, cantidad);

      // Retornar respuesta al cliente
      const statusCode = resultado.success ? 200 : 409;
      res.status(statusCode).json(resultado);
    } catch (error: any) {
      console.error('[Orquestador] Error inesperado:', error);
      console.error('[Orquestador] Stack:', error.stack);
      
      // Asegurar que siempre se envía una respuesta
      if (!res.headersSent) {
        res.status(500).json({
          success: false,
          message: 'Error interno del servidor',
          error: error.message || 'Error desconocido'
        });
      }
    }
  };

  /**
   * Endpoint de health check
   */
  health = (req: Request, res: Response): void => {
    res.json({ status: 'OK', service: 'Orquestador Saga' });
  };
}

