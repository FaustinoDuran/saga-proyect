
export interface TransaccionPago {
  transaccionId: string;
  monto: number;
  metodoPago: string;
  usuario: string;
  timestamp: string;
}

export interface TransaccionInventario {
  productoId: number;
  cantidad: number;
  stockRestante?: number;
}

export interface TransaccionCompra {
  compraId: string;
  usuario: string;
  productoId: number;
  cantidad: number;
  monto: number;
  timestamp: string;
}

export interface TransaccionCompletada {
  servicio: 'pagos' | 'inventario' | 'compras';
  datos: any;
}
