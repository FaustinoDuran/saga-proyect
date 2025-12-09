
export class InventarioService {
  actualizarStock(productoId: number, cantidad: number): boolean {

    const hayStock = Math.random() > 0.4;
    
    if (hayStock) {
      console.log(`[ms-inventario] Stock actualizado: Producto ${productoId} - Cantidad: ${cantidad}`);
    } else {
      console.log(`[ms-inventario] Sin stock: Producto ${productoId}`);
    }
    
    return hayStock;
  }


  generarStockRestante(): number {
    return Math.floor(Math.random() * 50) + 10;
  }

  compensarStock(productoId: number, cantidad: number): void {
    console.log(`[ms-inventario] Compensación ejecutada: Stock restaurado - Producto ${productoId} + ${cantidad}`);
  }
}