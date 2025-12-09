export class CompraService {
  registrarCompra(usuario: string, productoId: number, cantidad: number, monto: number): boolean {

    const exito = Math.random() > 0.2;
    
    if (exito) {
      console.log(`[ms-compras] Compra registrada: Usuario ${usuario} - Producto ${productoId}`);
    } else {
      console.log(`[ms-compras] Error al registrar compra: Usuario ${usuario}`);
    }
    
    return exito;
  }


  generarCompraId(): string {
    return `COMP-${Date.now()}`;
  }

  compensarCompra(compraId: string, usuario: string): void {
    console.log(`[ms-compras] Compensación ejecutada: Compra cancelada - ID: ${compraId}`);
  }
}

