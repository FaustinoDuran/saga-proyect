/**
 * Tipos relacionados con productos
 */
export interface Producto {
  id: number;
  nombre: string;
  precio: number;
  stock?: number;
  descripcion?: string;
}

export interface ProductoDetalle extends Producto {
  categoria?: string;
  marca?: string;
}
