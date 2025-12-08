/**
 * Servicio que gestiona la lógica de negocio de pagos
 */
export class PagosService {
  /**
   * Procesa un pago con respuesta aleatoria
   * Retorna true si el pago fue exitoso, false si fue rechazado
   */
  procesarPago(monto: number, metodoPago: string, usuario: string): boolean {
    // 70% de éxito, 30% de fallo
    const exito = Math.random() > 0.3;
    
    if (exito) {
      console.log(`[ms-pagos] ✅ Pago procesado: $${monto} - Usuario: ${usuario}`);
    } else {
      console.log(`[ms-pagos] ❌ Pago rechazado: $${monto} - Usuario: ${usuario}`);
    }
    
    return exito;
  }

  /**
   * Genera un ID único para la transacción
   */
  generarTransaccionId(): string {
    return `PAY-${Date.now()}`;
  }

  /**
   * Ejecuta la compensación (reembolso) de un pago
   */
  compensarPago(transaccionId: string, monto: number): void {
    console.log(`[ms-pagos] 🔄 Compensación ejecutada: Reembolso de $${monto} - ID: ${transaccionId}`);
  }
}

