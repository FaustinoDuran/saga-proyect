/**
 * Servicio que gestiona la lógica de negocio del inventario
 */
export class InventarioService {
  /**
   * Verifica si hay stock disponible y actualiza el inventario
   * Retorna true si hay stock, false si no hay
   */
  actualizarStock(productoId: number, cantidad: number): boolean {
    // 60% de éxito, 40% sin stock
    const hayStock = Math.random() > 0.4;
    
    if (hayStock) {
      console.log(`[ms-inventario] ✅ Stock actualizado: Producto ${productoId} - Cantidad: ${cantidad}`);
    } else {
      console.log(`[ms-inventario] ❌ Sin stock: Producto ${productoId}`);
    }
    
    return hayStock;
  }

  /**
   * Genera un stock restante aleatorio
   */
  generarStockRestante(): number {
    return Math.floor(Math.random() * 50) + 10;
  }

  /**
   * Ejecuta la compensación (restaura el stock)
   */
  compensarStock(productoId: number, cantidad: number): void {
    console.log(`[ms-inventario] 🔄 Compensación ejecutada: Stock restaurado - Producto ${productoId} + ${cantidad}`);
  }
}