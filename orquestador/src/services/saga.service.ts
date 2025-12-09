import { MicroservicesService } from './microservices.service';
import { Producto } from '../../../shared/types/producto.types';
import { TransaccionCompletada } from '../../../shared/types/transaccion.types';
import { SagaResponse } from '../../../shared/types/response.types';

export class SagaService {
  private microservicesService: MicroservicesService;

  constructor() {
    this.microservicesService = new MicroservicesService();
  }

  async ejecutarSagaCompra(usuario: string, productoId: number, cantidad: number): Promise<SagaResponse> {
    const transaccionesCompletadas: TransaccionCompletada[] = [];
    let producto: Producto | null = null;
    let pagoId: string | null = null;
    let compraId: string | null = null;

    try {
      console.log('\n========================================');
      console.log('🚀 INICIANDO SAGA DE COMPRA');
      console.log('========================================\n');

      producto = await this.ejecutarPasoProducto(productoId);

      pagoId = await this.ejecutarPasoPago(producto, cantidad, usuario);
      transaccionesCompletadas.push({
        servicio: 'pagos',
        datos: { transaccionId: pagoId, monto: producto.precio * cantidad }
      });

      await this.ejecutarPasoInventario(producto.id, cantidad);
      transaccionesCompletadas.push({
        servicio: 'inventario',
        datos: { productoId: producto.id, cantidad }
      });

      compraId = await this.ejecutarPasoCompra(usuario, producto, cantidad);
      transaccionesCompletadas.push({
        servicio: 'compras',
        datos: { compraId, usuario }
      });

      console.log('========================================');
      console.log('✅ SAGA COMPLETADA EXITOSAMENTE');
      console.log('========================================\n');

      return this.crearResultadoExitoso(producto, cantidad, pagoId, compraId);

    } catch (error: any) {
      console.error('\n========================================');
      console.error('❌ ERROR EN SAGA - INICIANDO COMPENSACIONES');
      console.error(`Motivo: ${error.message}`);
      console.error('========================================\n');

      await this.compensarTransacciones(transaccionesCompletadas);

      return this.crearResultadoFallido(producto, cantidad, error.message, transaccionesCompletadas.length);
    }
  }

  private async ejecutarPasoProducto(productoId: number): Promise<Producto> {
    console.log('📦 PASO 1: Obteniendo información del producto...');
    const producto = await this.microservicesService.obtenerProducto(productoId);
    console.log(`✅ Producto obtenido: ${producto.nombre} - Precio: $${producto.precio}\n`);
    return producto;
  }


  private async ejecutarPasoPago(producto: Producto, cantidad: number, usuario: string): Promise<string> {
    console.log('💳 PASO 2: Procesando pago...');
    const pagoId = await this.microservicesService.procesarPago(producto.precio * cantidad, usuario);
    console.log(`✅ Pago procesado: ${pagoId}\n`);
    return pagoId;
  }


  private async ejecutarPasoInventario(productoId: number, cantidad: number): Promise<void> {
    console.log('📊 PASO 3: Actualizando inventario...');
    await this.microservicesService.actualizarInventario(productoId, cantidad);
    console.log(`✅ Inventario actualizado\n`);
  }


  private async ejecutarPasoCompra(usuario: string, producto: Producto, cantidad: number): Promise<string> {
    console.log('📝 PASO 4: Registrando compra...');
    const compraId = await this.microservicesService.registrarCompra(
      usuario,
      producto.id,
      cantidad,
      producto.precio * cantidad
    );
    console.log(`✅ Compra registrada: ${compraId}\n`);
    return compraId;
  }


  private async compensarTransacciones(transacciones: TransaccionCompletada[]): Promise<void> {
    console.log(`🔄 Ejecutando ${transacciones.length} compensación(es)...\n`);

    for (let i = transacciones.length - 1; i >= 0; i--) {
      const transaccion = transacciones[i];
      
      try {
        console.log(`🔄 Compensando: ${transaccion.servicio}...`);
        await this.microservicesService.compensar(transaccion.servicio, transaccion.datos);
        console.log(`✅ ${transaccion.servicio} compensado exitosamente\n`);
      } catch (error) {
        console.error(`❗ Error al compensar ${transaccion.servicio}:`, error);
      }
    }

    console.log('========================================');
    console.log('✅ COMPENSACIONES COMPLETADAS');
    console.log('========================================\n');
  }

 
  private crearResultadoExitoso(producto: Producto, cantidad: number, pagoId: string, compraId: string): SagaResponse {
    return {
      success: true,
      message: 'Transacción completada exitosamente',
      detalles: {
        producto: producto.nombre,
        cantidad,
        montoTotal: producto.precio * cantidad,
        pagoId,
        compraId
      }
    };
  }

  private crearResultadoFallido(
    producto: Producto | null,
    cantidad: number,
    errorMessage: string,
    transaccionesRevertidas: number
  ): SagaResponse {
    return {
      success: false,
      message: 'Transacción fallida - Todas las operaciones fueron revertidas',
      error: errorMessage,
      detalles: {
        producto: producto?.nombre || 'Desconocido',
        cantidad,
        transaccionesRevertidas
      }
    };
  }
}

