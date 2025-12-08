import axios from 'axios';
import { SERVICES_CONFIG, ServiceName } from '../config/services.config';

/**
 * Servicio para comunicación con los microservicios
 */
export class MicroservicesService {
  /**
   * Obtiene información de un producto del catálogo
   */
  async obtenerProducto(productoId: number) {
    try {
      const response = await axios.get(`${SERVICES_CONFIG.catalogo}/producto/${productoId}`);
      return response.data.data;
    } catch (error: any) {
      throw new Error('Error al obtener producto del catálogo');
    }
  }

  /**
   * Procesa un pago en el microservicio de pagos
   */
  async procesarPago(monto: number, usuario: string) {
    try {
      const response = await axios.post(`${SERVICES_CONFIG.pagos}/transaccion`, {
        monto,
        metodoPago: 'tarjeta',
        usuario
      });

      return response.data.transaccionId;
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        throw new Error('Pago rechazado');
      }
      throw error;
    }
  }

  /**
   * Actualiza el inventario
   */
  async actualizarInventario(productoId: number, cantidad: number) {
    try {
      const response = await axios.post(`${SERVICES_CONFIG.inventario}/transaccion`, {
        productoId,
        cantidad
      });

      return response.data;
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        throw new Error('Stock insuficiente');
      }
      throw error;
    }
  }

  /**
   * Registra una compra
   */
  async registrarCompra(usuario: string, productoId: number, cantidad: number, monto: number) {
    try {
      const response = await axios.post(`${SERVICES_CONFIG.compras}/transaccion`, {
        usuario,
        productoId,
        cantidad,
        monto
      });

      return response.data.compraId;
    } catch (error: any) {
      if (error.response && error.response.status === 409) {
        throw new Error('Error al registrar compra');
      }
      throw error;
    }
  }

  /**
   * Ejecuta la compensación en un servicio específico
   */
  async compensar(servicio: ServiceName, datos: any) {
    try {
      const url = `${SERVICES_CONFIG[servicio]}/compensar`;
      await axios.post(url, datos);
    } catch (error: any) {
      // Las compensaciones siempre deberían funcionar, pero capturamos el error por si acaso
      console.error(`Error al compensar ${servicio}:`, error.message);
      throw error;
    }
  }
}

