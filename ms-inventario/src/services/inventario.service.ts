
export class InventarioService {

  actualizarStock(productoId: number, Stock: number): boolean {

    const existeStock = Math.random() > 0.4;

    if (existeStock) {
      console.log(`[ms-inventario] Stock actualizado: Producto ${productoId} - Stock: ${Stock}`);
    } else {
      console.log(`[ms-inventario] in stock: Producto ${productoId}`);
    }
    return existeStock;
  }

  compensarStock(productoId: number, Stock: number): void {
    console.log(`[ms-inventario] Compensación ejecutada: Stock restaurado - Producto ${productoId} + ${Stock}`);
  }

  // generarStockRestante(): number {
  //   return Math.floor(Math.random() * 50) + 10;
  // }
}