import dotenv from 'dotenv';

dotenv.config();

export const SERVICES_CONFIG = {
  catalogo: process.env.CATALOGO_URL || 'http://localhost:3001',
  pagos: process.env.PAGOS_URL || 'http://localhost:3002',
  inventario: process.env.INVENTARIO_URL || 'http://localhost:3003',
  compras: process.env.COMPRAS_URL || 'http://localhost:3004'
} as const;

export type ServiceName = keyof typeof SERVICES_CONFIG;

