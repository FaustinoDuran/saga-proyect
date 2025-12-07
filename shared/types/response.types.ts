
export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  error?: string;
  timestamp: string;
}

export interface SagaResponse {
  success: boolean;
  message: string;
  error?: string;
  detalles: {
    producto: string;
    cantidad: number;
    montoTotal?: number;
    pagoId?: string;
    compraId?: string;
    transaccionesRevertidas?: number;
  };
}
