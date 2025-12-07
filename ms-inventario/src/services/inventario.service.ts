
export class InventarioService {

  actualizarStock(productoId: number, stock: number): boolean {

    const existeStock = Math.random() > 0.4;

    if (existeStock) {
      console.log(`[ms-inventario] stock actualizado: Producto ${productoId} - stock: ${stock}`);
    } else {
      console.log(`[ms-inventario] in stock: Producto ${productoId}`);
    }
    return existeStock;
  }

  compensarStock(productoId: number, stock: number): void {
    console.log(`[ms-inventario] Compensación ejecutada: stock restaurado - Producto ${productoId} + ${stock}`);
  }
}