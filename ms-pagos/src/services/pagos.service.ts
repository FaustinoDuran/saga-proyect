export class PagosService {

  procesarPago(monto: number, metodoPago: string, usuario: string): boolean {
 
    const exito = Math.random() > 0.3;
    
    if (exito) {
      console.log(`[ms-pagos] ✅ Pago procesado: $${monto} - Usuario: ${usuario}`);
    } else {
      console.log(`[ms-pagos] ❌ Pago rechazado: $${monto} - Usuario: ${usuario}`);
    }
    
    return exito;
  }

  generarTransaccionId(): string {
    return `PAY-${Date.now()}`;
  }

  compensarPago(transaccionId: string, monto: number): void {
    console.log(`[ms-pagos] Compensación ejecutada: Reembolso de $${monto} - ID: ${transaccionId}`);
  }
}

