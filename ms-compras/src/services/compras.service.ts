
export class CompraService {

    registrarCompra(usuario: string, productoId: number, cantidad: number, monto: number): boolean {
        const exito = Math.random() > 0.2;

        if (exito) {
            console.log('[ms-compras] Compra registrada exitosamente')
            return true;
        } else {
            console.log('[ms-compras] Error al registrar compra')
            return false;
        }
    }

    generarCompraId(): string {
        return `COMP-${Date.now()}`;
    }
    
    compensarCompra(compraId: string):void {
        console.log('[ms-compras] Compensación ejecutada: Compra cancelada - ID: ${compraId}')
    }

}

