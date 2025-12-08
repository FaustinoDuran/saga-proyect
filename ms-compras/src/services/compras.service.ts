/**
 * Servicio que gestiona la lógica de negocio de compras
 */
export class CompraService {
  /**
   * Registra una compra en el sistema
   * Retorna true si se registró exitosamente, false si falló
   */
  registrarCompra(usuario: string, productoId: number, cantidad: number, monto: number): boolean {
    // 80% de éxito, 20% de fallo
    const exito = Math.random() > 0.2;
    
    if (exito) {
      console.log(`[ms-compras] ✅ Compra registrada: Usuario ${usuario} - Producto ${productoId}`);
    } else {
      console.log(`[ms-compras] ❌ Error al registrar compra: Usuario ${usuario}`);
    }
    
    return exito;
  }

  /**
   * Genera un ID único para la compra
   */
  generarCompraId(): string {
    return `COMP-${Date.now()}`;
  }

  /**
   * Ejecuta la compensación (cancela la compra)
   */
  compensarCompra(compraId: string, usuario: string): void {
    console.log(`[ms-compras] 🔄 Compensación ejecutada: Compra cancelada - ID: ${compraId}`);
  }
}

