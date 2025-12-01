# Guía de Implementación - Patrón Saga con TypeScript y Express

## Paso 1: Estructura de Carpetas

Crear la siguiente estructura de proyecto siguiendo principios SOLID y DRY:

```
saga-proyect/
├── shared/
│   └── utils/
│       └── latencia.util.ts
├── ms-catalogo/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── catalogo.controller.ts
│   │   ├── services/
│   │   │   └── catalogo.service.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── ms-pagos/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── pagos.controller.ts
│   │   ├── services/
│   │   │   └── pagos.service.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── ms-inventario/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── inventario.controller.ts
│   │   ├── services/
│   │   │   └── inventario.service.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── ms-compras/
│   ├── src/
│   │   ├── controllers/
│   │   │   └── compras.controller.ts
│   │   ├── services/
│   │   │   └── compras.service.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
└── orquestador/
    ├── src/
    │   ├── controllers/
    │   │   └── saga.controller.ts
    │   ├── services/
    │   │   ├── saga.service.ts
    │   │   └── microservices.service.ts
    │   ├── config/
    │   │   └── services.config.ts
    │   └── index.ts
    ├── package.json
    └── tsconfig.json
```

**Nota**: La carpeta `shared/` contiene código compartido entre todos los microservicios, aplicando el principio DRY.

---

## Paso 2: Inicialización de cada Microservicio

### 2.1. Crear las carpetas

```bash
mkdir saga-proyect
cd saga-proyect
mkdir -p shared/utils
mkdir -p ms-catalogo/src/{controllers,services}
mkdir -p ms-pagos/src/{controllers,services}
mkdir -p ms-inventario/src/{controllers,services}
mkdir -p ms-compras/src/{controllers,services}
mkdir -p orquestador/src/{controllers,services,config}
```

### 2.2. Crear utilidad compartida

Crear el archivo `shared/utils/latencia.util.ts`:

```typescript
/**
 * Utilidad compartida para simular latencia de red
 * Aplicando el principio DRY - usado por todos los microservicios
 */
export class LatenciaUtil {
  /**
   * Simula un delay aleatorio entre 500ms y 1500ms
   */
  static async simular(): Promise<void> {
    const delay = Math.floor(Math.random() * 1000) + 500;
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}
```

### 2.3. Inicializar cada microservicio

Repetir para cada carpeta (ms-catalogo, ms-pagos, ms-inventario, ms-compras, orquestador):

```bash
cd ms-catalogo
npm init -y
npm install express cors
npm install -D typescript @types/express @types/node @types/cors ts-node nodemon
npx tsc --init
```

### 2.4. Configurar TypeScript

Editar `tsconfig.json` en cada microservicio para permitir importar desde `shared/`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "../",
    "baseUrl": "../",
    "paths": {
      "@shared/*": ["shared/*"]
    },
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true
  },
  "include": ["src/**/*", "../shared/**/*"],
  "exclude": ["node_modules"]
}
```

**Nota importante**: La configuración de `rootDir`, `baseUrl` y `paths` permite importar el código compartido usando `@shared/` o rutas relativas.

### 2.5. Agregar scripts en package.json

En cada `package.json`, agregar los scripts:

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/src/index.js"
  }
}
```

**Nota**: El path de start cambió a `dist/src/index.js` porque ahora `rootDir` incluye el nivel superior con la carpeta `shared/`.

---

## Paso 3: Utilidad Compartida (Carpeta shared/)

### ¿Por qué una carpeta compartida?

Aplicando el principio **DRY (Don't Repeat Yourself)**, creamos una carpeta `shared/` en la raíz del proyecto que contiene código reutilizable por todos los microservicios.

**Ventajas:**
- ✅ **Sin duplicación**: Una sola implementación de `LatenciaUtil`
- ✅ **Mantenibilidad**: Cambios en un solo lugar
- ✅ **Consistencia**: Todos los servicios usan la misma lógica
- ✅ **Escalabilidad**: Fácil agregar más utilidades compartidas

### Uso en cada microservicio

Cada microservicio importa la utilidad compartida con una ruta relativa:

```typescript
import { LatenciaUtil } from '../../../shared/utils/latencia.util';
```

Alternativamente, con la configuración de paths en `tsconfig.json`, se podría usar:

```typescript
import { LatenciaUtil } from '@shared/utils/latencia.util';
```

---

## Paso 4: Implementación de ms-catalogo

### Archivo: `ms-catalogo/src/services/catalogo.service.ts`

```typescript
/**
 * Servicio que gestiona la lógica de negocio del catálogo
 */
export class CatalogoService {
  private productos = [
    { id: 1, nombre: 'Laptop', precio: 1200 },
    { id: 2, nombre: 'Mouse', precio: 25 },
    { id: 3, nombre: 'Teclado', precio: 75 },
    { id: 4, nombre: 'Monitor', precio: 300 },
    { id: 5, nombre: 'Webcam', precio: 80 }
  ];

  /**
   * Genera un producto aleatorio con información completa
   */
  obtenerProductoAleatorio() {
    const productoAleatorio = this.productos[
      Math.floor(Math.random() * this.productos.length)
    ];
    
    return {
      ...productoAleatorio,
      stock: Math.floor(Math.random() * 100) + 1,
      descripcion: `Descripción del producto ${productoAleatorio.nombre}`
    };
  }

  /**
   * Obtiene un producto por ID (para este TP, retorna uno aleatorio)
   */
  obtenerProductoPorId(id: number) {
    return this.obtenerProductoAleatorio();
  }
}
```

### Archivo: `ms-catalogo/src/controllers/catalogo.controller.ts`

```typescript
import { Request, Response } from 'express';
import { CatalogoService } from '../services/catalogo.service';
import { LatenciaUtil } from '../../../shared/utils/latencia.util';

/**
 * Controlador que maneja las peticiones HTTP del catálogo
 */
export class CatalogoController {
  private catalogoService: CatalogoService;

  constructor() {
    this.catalogoService = new CatalogoService();
  }

  /**
   * Endpoint para obtener información de un producto
   */
  obtenerProducto = async (req: Request, res: Response): Promise<void> => {
    try {
      await LatenciaUtil.simular();
      
      const { id } = req.params;
      const producto = id 
        ? this.catalogoService.obtenerProductoPorId(Number(id))
        : this.catalogoService.obtenerProductoAleatorio();
      
      console.log(`[ms-catalogo] Producto solicitado: ${producto.nombre}`);
      
      // Siempre retorna 200
      res.status(200).json({
        success: true,
        data: producto,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[ms-catalogo] Error:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };
}
```

### Archivo: `ms-catalogo/src/index.ts`

```typescript
import express from 'express';
import cors from 'cors';
import { CatalogoController } from './controllers/catalogo.controller';

const app = express();
const PORT = 3001;

// Middlewares
app.use(cors());
app.use(express.json());

// Inicializar controlador
const catalogoController = new CatalogoController();

// Rutas
app.get('/producto/:id?', catalogoController.obtenerProducto);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ [ms-catalogo] Corriendo en puerto ${PORT}`);
});
```

---

## Paso 5: Implementación de ms-pagos

### Archivo: `ms-pagos/src/services/pagos.service.ts`

```typescript
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
```

### Archivo: `ms-pagos/src/controllers/pagos.controller.ts`

```typescript
import { Request, Response } from 'express';
import { PagosService } from '../services/pagos.service';
import { LatenciaUtil } from '../../../shared/utils/latencia.util';

/**
 * Controlador que maneja las peticiones HTTP de pagos
 */
export class PagosController {
  private pagosService: PagosService;

  constructor() {
    this.pagosService = new PagosService();
  }

  /**
   * Endpoint para procesar una transacción de pago
   * Retorna 200 o 409 aleatoriamente
   */
  procesarTransaccion = async (req: Request, res: Response): Promise<void> => {
    try {
      await LatenciaUtil.simular();
      
      const { monto, metodoPago, usuario } = req.body;
      
      const exito = this.pagosService.procesarPago(monto, metodoPago, usuario);
      
      if (exito) {
        res.status(200).json({
          success: true,
          message: 'Pago procesado exitosamente',
          transaccionId: this.pagosService.generarTransaccionId(),
          monto,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(409).json({
          success: false,
          message: 'Pago rechazado - Fondos insuficientes o error en procesamiento',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('[ms-pagos] Error:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };

  /**
   * Endpoint para compensar (reembolsar) un pago
   * Siempre retorna 200
   */
  compensar = async (req: Request, res: Response): Promise<void> => {
    try {
      await LatenciaUtil.simular();
      
      const { transaccionId, monto } = req.body;
      
      this.pagosService.compensarPago(transaccionId, monto);
      
      res.status(200).json({
        success: true,
        message: 'Reembolso procesado exitosamente',
        transaccionId,
        monto,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[ms-pagos] Error en compensación:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };
}
```

### Archivo: `ms-pagos/src/index.ts`

```typescript
import express from 'express';
import cors from 'cors';
import { PagosController } from './controllers/pagos.controller';

const app = express();
const PORT = 3002;

// Middlewares
app.use(cors());
app.use(express.json());

// Inicializar controlador
const pagosController = new PagosController();

// Rutas
app.post('/transaccion', pagosController.procesarTransaccion);
app.post('/compensar', pagosController.compensar);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ [ms-pagos] Corriendo en puerto ${PORT}`);
});
```

---

## Paso 6: Implementación de ms-inventario

### Archivo: `ms-inventario/src/services/inventario.service.ts`

```typescript
/**
 * Servicio que gestiona la lógica de negocio del inventario
 */
export class InventarioService {
  /**
   * Verifica si hay stock disponible y actualiza el inventario
   * Retorna true si hay stock, false si no hay
   */
  actualizarStock(productoId: number, cantidad: number): boolean {
    // 60% de éxito, 40% sin stock
    const hayStock = Math.random() > 0.4;
    
    if (hayStock) {
      console.log(`[ms-inventario] ✅ Stock actualizado: Producto ${productoId} - Cantidad: ${cantidad}`);
    } else {
      console.log(`[ms-inventario] ❌ Sin stock: Producto ${productoId}`);
    }
    
    return hayStock;
  }

  /**
   * Genera un stock restante aleatorio
   */
  generarStockRestante(): number {
    return Math.floor(Math.random() * 50) + 10;
  }

  /**
   * Ejecuta la compensación (restaura el stock)
   */
  compensarStock(productoId: number, cantidad: number): void {
    console.log(`[ms-inventario] 🔄 Compensación ejecutada: Stock restaurado - Producto ${productoId} + ${cantidad}`);
  }
}
```

### Archivo: `ms-inventario/src/controllers/inventario.controller.ts`

```typescript
import { Request, Response } from 'express';
import { InventarioService } from '../services/inventario.service';
import { LatenciaUtil } from '../../../shared/utils/latencia.util';

/**
 * Controlador que maneja las peticiones HTTP del inventario
 */
export class InventarioController {
  private inventarioService: InventarioService;

  constructor() {
    this.inventarioService = new InventarioService();
  }

  /**
   * Endpoint para actualizar el inventario
   * Retorna 200 o 409 aleatoriamente
   */
  procesarTransaccion = async (req: Request, res: Response): Promise<void> => {
    try {
      await LatenciaUtil.simular();
      
      const { productoId, cantidad } = req.body;
      
      const hayStock = this.inventarioService.actualizarStock(productoId, cantidad);
      
      if (hayStock) {
        res.status(200).json({
          success: true,
          message: 'Inventario actualizado exitosamente',
          productoId,
          cantidadDescontada: cantidad,
          stockRestante: this.inventarioService.generarStockRestante(),
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(409).json({
          success: false,
          message: 'Stock insuficiente - No se puede procesar la compra',
          productoId,
          stockDisponible: 0,
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('[ms-inventario] Error:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };

  /**
   * Endpoint para compensar (restaurar stock)
   * Siempre retorna 200
   */
  compensar = async (req: Request, res: Response): Promise<void> => {
    try {
      await LatenciaUtil.simular();
      
      const { productoId, cantidad } = req.body;
      
      this.inventarioService.compensarStock(productoId, cantidad);
      
      res.status(200).json({
        success: true,
        message: 'Stock restaurado exitosamente',
        productoId,
        cantidadRestaurada: cantidad,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[ms-inventario] Error en compensación:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };
}
```

### Archivo: `ms-inventario/src/index.ts`

```typescript
import express from 'express';
import cors from 'cors';
import { InventarioController } from './controllers/inventario.controller';

const app = express();
const PORT = 3003;

// Middlewares
app.use(cors());
app.use(express.json());

// Inicializar controlador
const inventarioController = new InventarioController();

// Rutas
app.post('/transaccion', inventarioController.procesarTransaccion);
app.post('/compensar', inventarioController.compensar);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ [ms-inventario] Corriendo en puerto ${PORT}`);
});
```

---

## Paso 7: Implementación de ms-compras

### Archivo: `ms-compras/src/services/compras.service.ts`

```typescript
/**
 * Servicio que gestiona la lógica de negocio de compras
 */
export class ComprasService {
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
```

### Archivo: `ms-compras/src/controllers/compras.controller.ts`

```typescript
import { Request, Response } from 'express';
import { ComprasService } from '../services/compras.service';
import { LatenciaUtil } from '../../../shared/utils/latencia.util';

/**
 * Controlador que maneja las peticiones HTTP de compras
 */
export class ComprasController {
  private comprasService: ComprasService;

  constructor() {
    this.comprasService = new ComprasService();
  }

  /**
   * Endpoint para registrar una transacción de compra
   * Retorna 200 o 409 aleatoriamente
   */
  procesarTransaccion = async (req: Request, res: Response): Promise<void> => {
    try {
      await LatenciaUtil.simular();
      
      const { usuario, productoId, cantidad, monto } = req.body;
      
      const exito = this.comprasService.registrarCompra(usuario, productoId, cantidad, monto);
      
      if (exito) {
        res.status(200).json({
          success: true,
          message: 'Compra registrada exitosamente',
          compraId: this.comprasService.generarCompraId(),
          usuario,
          productoId,
          cantidad,
          monto,
          timestamp: new Date().toISOString()
        });
      } else {
        res.status(409).json({
          success: false,
          message: 'Error al persistir la compra - Problema en base de datos',
          timestamp: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('[ms-compras] Error:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };

  /**
   * Endpoint para compensar (cancelar) una compra
   * Siempre retorna 200
   */
  compensar = async (req: Request, res: Response): Promise<void> => {
    try {
      await LatenciaUtil.simular();
      
      const { compraId, usuario } = req.body;
      
      this.comprasService.compensarCompra(compraId, usuario);
      
      res.status(200).json({
        success: true,
        message: 'Compra cancelada exitosamente',
        compraId,
        usuario,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('[ms-compras] Error en compensación:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };
}
```

### Archivo: `ms-compras/src/index.ts`

```typescript
import express from 'express';
import cors from 'cors';
import { ComprasController } from './controllers/compras.controller';

const app = express();
const PORT = 3004;

// Middlewares
app.use(cors());
app.use(express.json());

// Inicializar controlador
const comprasController = new ComprasController();

// Rutas
app.post('/transaccion', comprasController.procesarTransaccion);
app.post('/compensar', comprasController.compensar);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`✅ [ms-compras] Corriendo en puerto ${PORT}`);
});
```

---

## Paso 8: Implementación del Orquestador Saga

### Archivo: `orquestador/src/config/services.config.ts`

```typescript
/**
 * Configuración centralizada de las URLs de los microservicios
 */
export const SERVICES_CONFIG = {
  catalogo: 'http://localhost:3001',
  pagos: 'http://localhost:3002',
  inventario: 'http://localhost:3003',
  compras: 'http://localhost:3004'
} as const;

export type ServiceName = keyof typeof SERVICES_CONFIG;
```

### Archivo: `orquestador/src/services/microservices.service.ts`

```typescript
import axios from 'axios';
import { SERVICES_CONFIG, ServiceName } from '../config/services.config';

/**
 * Servicio para comunicación con los microservicios
 */
export class MicroservicesService {
  /**
   * Obtiene información de un producto del catálogo
   */
  async obtenerProducto(productoId: number) {
    const response = await axios.get(`${SERVICES_CONFIG.catalogo}/producto/${productoId}`);
    
    if (response.status !== 200) {
      throw new Error('Error al obtener producto del catálogo');
    }
    
    return response.data.data;
  }

  /**
   * Procesa un pago en el microservicio de pagos
   */
  async procesarPago(monto: number, usuario: string) {
    const response = await axios.post(`${SERVICES_CONFIG.pagos}/transaccion`, {
      monto,
      metodoPago: 'tarjeta',
      usuario
    });

    if (response.status !== 200) {
      throw new Error('Pago rechazado');
    }

    return response.data.transaccionId;
  }

  /**
   * Actualiza el inventario
   */
  async actualizarInventario(productoId: number, cantidad: number) {
    const response = await axios.post(`${SERVICES_CONFIG.inventario}/transaccion`, {
      productoId,
      cantidad
    });

    if (response.status !== 200) {
      throw new Error('Stock insuficiente');
    }

    return response.data;
  }

  /**
   * Registra una compra
   */
  async registrarCompra(usuario: string, productoId: number, cantidad: number, monto: number) {
    const response = await axios.post(`${SERVICES_CONFIG.compras}/transaccion`, {
      usuario,
      productoId,
      cantidad,
      monto
    });

    if (response.status !== 200) {
      throw new Error('Error al registrar compra');
    }

    return response.data.compraId;
  }

  /**
   * Ejecuta la compensación en un servicio específico
   */
  async compensar(servicio: ServiceName, datos: any) {
    const url = `${SERVICES_CONFIG[servicio]}/compensar`;
    await axios.post(url, datos);
  }
}
```

### Archivo: `orquestador/src/services/saga.service.ts`

```typescript
import { MicroservicesService } from './microservices.service';

interface Producto {
  id: number;
  nombre: string;
  precio: number;
}

interface TransaccionCompletada {
  servicio: 'pagos' | 'inventario' | 'compras';
  datos: any;
}

interface ResultadoSaga {
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

/**
 * Servicio que implementa la lógica de la Saga
 */
export class SagaService {
  private microservicesService: MicroservicesService;

  constructor() {
    this.microservicesService = new MicroservicesService();
  }

  /**
   * Ejecuta la saga completa de compra
   */
  async ejecutarSagaCompra(usuario: string, productoId: number, cantidad: number): Promise<ResultadoSaga> {
    const transaccionesCompletadas: TransaccionCompletada[] = [];
    let producto: Producto | null = null;
    let pagoId: string | null = null;
    let compraId: string | null = null;

    try {
      console.log('\n========================================');
      console.log('🚀 INICIANDO SAGA DE COMPRA');
      console.log('========================================\n');

      // PASO 1: Obtener producto del catálogo
      producto = await this.ejecutarPasoProducto(productoId);

      // PASO 2: Procesar pago
      pagoId = await this.ejecutarPasoPago(producto, cantidad, usuario);
      transaccionesCompletadas.push({
        servicio: 'pagos',
        datos: { transaccionId: pagoId, monto: producto.precio * cantidad }
      });

      // PASO 3: Actualizar inventario
      await this.ejecutarPasoInventario(producto.id, cantidad);
      transaccionesCompletadas.push({
        servicio: 'inventario',
        datos: { productoId: producto.id, cantidad }
      });

      // PASO 4: Registrar compra
      compraId = await this.ejecutarPasoCompra(usuario, producto, cantidad);
      transaccionesCompletadas.push({
        servicio: 'compras',
        datos: { compraId, usuario }
      });

      console.log('========================================');
      console.log('✅ SAGA COMPLETADA EXITOSAMENTE');
      console.log('========================================\n');

      return this.crearResultadoExitoso(producto, cantidad, pagoId, compraId);

    } catch (error: any) {
      console.error('\n========================================');
      console.error('❌ ERROR EN SAGA - INICIANDO COMPENSACIONES');
      console.error(`Motivo: ${error.message}`);
      console.error('========================================\n');

      await this.compensarTransacciones(transaccionesCompletadas);

      return this.crearResultadoFallido(producto, cantidad, error.message, transaccionesCompletadas.length);
    }
  }

  /**
   * Paso 1: Obtener producto
   */
  private async ejecutarPasoProducto(productoId: number): Promise<Producto> {
    console.log('📦 PASO 1: Obteniendo información del producto...');
    const producto = await this.microservicesService.obtenerProducto(productoId);
    console.log(`✅ Producto obtenido: ${producto.nombre} - Precio: $${producto.precio}\n`);
    return producto;
  }

  /**
   * Paso 2: Procesar pago
   */
  private async ejecutarPasoPago(producto: Producto, cantidad: number, usuario: string): Promise<string> {
    console.log('💳 PASO 2: Procesando pago...');
    const pagoId = await this.microservicesService.procesarPago(producto.precio * cantidad, usuario);
    console.log(`✅ Pago procesado: ${pagoId}\n`);
    return pagoId;
  }

  /**
   * Paso 3: Actualizar inventario
   */
  private async ejecutarPasoInventario(productoId: number, cantidad: number): Promise<void> {
    console.log('📊 PASO 3: Actualizando inventario...');
    await this.microservicesService.actualizarInventario(productoId, cantidad);
    console.log(`✅ Inventario actualizado\n`);
  }

  /**
   * Paso 4: Registrar compra
   */
  private async ejecutarPasoCompra(usuario: string, producto: Producto, cantidad: number): Promise<string> {
    console.log('📝 PASO 4: Registrando compra...');
    const compraId = await this.microservicesService.registrarCompra(
      usuario,
      producto.id,
      cantidad,
      producto.precio * cantidad
    );
    console.log(`✅ Compra registrada: ${compraId}\n`);
    return compraId;
  }

  /**
   * Ejecuta las compensaciones en orden inverso
   */
  private async compensarTransacciones(transacciones: TransaccionCompletada[]): Promise<void> {
    console.log(`🔄 Ejecutando ${transacciones.length} compensación(es)...\n`);

    for (let i = transacciones.length - 1; i >= 0; i--) {
      const transaccion = transacciones[i];
      
      try {
        console.log(`🔄 Compensando: ${transaccion.servicio}...`);
        await this.microservicesService.compensar(transaccion.servicio, transaccion.datos);
        console.log(`✅ ${transaccion.servicio} compensado exitosamente\n`);
      } catch (error) {
        console.error(`❗ Error al compensar ${transaccion.servicio}:`, error);
      }
    }

    console.log('========================================');
    console.log('✅ COMPENSACIONES COMPLETADAS');
    console.log('========================================\n');
  }

  /**
   * Crea el resultado para una saga exitosa
   */
  private crearResultadoExitoso(producto: Producto, cantidad: number, pagoId: string, compraId: string): ResultadoSaga {
    return {
      success: true,
      message: 'Transacción completada exitosamente',
      detalles: {
        producto: producto.nombre,
        cantidad,
        montoTotal: producto.precio * cantidad,
        pagoId,
        compraId
      }
    };
  }

  /**
   * Crea el resultado para una saga fallida
   */
  private crearResultadoFallido(
    producto: Producto | null,
    cantidad: number,
    errorMessage: string,
    transaccionesRevertidas: number
  ): ResultadoSaga {
    return {
      success: false,
      message: 'Transacción fallida - Todas las operaciones fueron revertidas',
      error: errorMessage,
      detalles: {
        producto: producto?.nombre || 'Desconocido',
        cantidad,
        transaccionesRevertidas
      }
    };
  }
}
```

### Archivo: `orquestador/src/controllers/saga.controller.ts`

```typescript
import { Request, Response } from 'express';
import { SagaService } from '../services/saga.service';

/**
 * Controlador que maneja las peticiones HTTP del orquestador
 */
export class SagaController {
  private sagaService: SagaService;

  constructor() {
    this.sagaService = new SagaService();
  }

  /**
   * Endpoint principal que inicia la saga de compra
   */
  comprar = async (req: Request, res: Response): Promise<void> => {
    try {
      const { usuario, productoId, cantidad } = req.body;

      // Validación básica
      if (!usuario || !productoId || !cantidad) {
        res.status(400).json({
          success: false,
          message: 'Faltan parámetros: usuario, productoId, cantidad'
        });
        return;
      }

      // Ejecutar la saga
      const resultado = await this.sagaService.ejecutarSagaCompra(usuario, productoId, cantidad);

      // Retornar respuesta al cliente
      const statusCode = resultado.success ? 200 : 409;
      res.status(statusCode).json(resultado);
    } catch (error) {
      console.error('[Orquestador] Error inesperado:', error);
      res.status(500).json({
        success: false,
        message: 'Error interno del servidor'
      });
    }
  };

  /**
   * Endpoint de health check
   */
  health = (req: Request, res: Response): void => {
    res.json({ status: 'OK', service: 'Orquestador Saga' });
  };
}
```

### Archivo: `orquestador/src/index.ts`

```typescript
import express from 'express';
import cors from 'cors';
import { SagaController } from './controllers/saga.controller';

const app = express();
const PORT = 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Inicializar controlador
const sagaController = new SagaController();

// Rutas
app.post('/comprar', sagaController.comprar);
app.get('/health', sagaController.health);

// Iniciar servidor
app.listen(PORT, () => {
  console.log('\n========================================');
  console.log(`🎯 [ORQUESTADOR] Corriendo en puerto ${PORT}`);
  console.log('========================================\n');
  console.log('Endpoints disponibles:');
  console.log(`  POST http://localhost:${PORT}/comprar`);
  console.log(`  GET  http://localhost:${PORT}/health\n`);
});
```

### Instalar dependencia adicional en el orquestador:

```bash
cd orquestador
npm install axios
npm install -D @types/axios
```

---

## Paso 9: Orden de Ejecución

### 9.1. Levantar todos los servicios

Abrir **5 terminales** diferentes y ejecutar en cada una:

**Terminal 1 - ms-catalogo:**
```bash
cd ms-catalogo
npm run dev
```

**Terminal 2 - ms-pagos:**
```bash
cd ms-pagos
npm run dev
```

**Terminal 3 - ms-inventario:**
```bash
cd ms-inventario
npm run dev
```

**Terminal 4 - ms-compras:**
```bash
cd ms-compras
npm run dev
```

**Terminal 5 - orquestador:**
```bash
cd orquestador
npm run dev
```

### 9.2. Verificar que todos estén corriendo

Deberías ver en las terminales:

```
✅ [ms-catalogo] Corriendo en puerto 3001
✅ [ms-pagos] Corriendo en puerto 3002
✅ [ms-inventario] Corriendo en puerto 3003
✅ [ms-compras] Corriendo en puerto 3004
🎯 [ORQUESTADOR] Corriendo en puerto 3000
```

---

## Paso 10: Probar el Sistema

### 10.1. Usando curl

```bash
curl -X POST http://localhost:3000/comprar \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "juan123",
    "productoId": 1,
    "cantidad": 2
  }'
```

### 10.2. Usando Postman

1. Crear una petición `POST` a `http://localhost:3000/comprar`
2. En Headers: `Content-Type: application/json`
3. En Body (raw JSON):
```json
{
  "usuario": "maria456",
  "productoId": 3,
  "cantidad": 1
}
```

### 10.3. Respuestas Esperadas

**Caso exitoso (200):**
```json
{
  "success": true,
  "message": "Transacción completada exitosamente",
  "detalles": {
    "producto": "Laptop",
    "cantidad": 2,
    "montoTotal": 2400,
    "pagoId": "PAY-1234567890",
    "compraId": "COMP-1234567890"
  }
}
```

**Caso fallido (409):**
```json
{
  "success": false,
  "message": "Transacción fallida - Todas las operaciones fueron revertidas",
  "error": "Stock insuficiente",
  "detalles": {
    "producto": "Laptop",
    "cantidad": 2,
    "transaccionesRevertidas": 2
  }
}
```

---

## Paso 11: Observar el Flujo en los Logs

### Caso de éxito en los logs:

```
🚀 INICIANDO SAGA DE COMPRA
📦 PASO 1: Obteniendo información del producto...
✅ Producto obtenido: Laptop - Precio: $1200

💳 PASO 2: Procesando pago...
✅ Pago procesado: PAY-1234567890

📊 PASO 3: Actualizando inventario...
✅ Inventario actualizado

📝 PASO 4: Registrando compra...
✅ Compra registrada: COMP-1234567890

✅ SAGA COMPLETADA EXITOSAMENTE
```

### Caso con compensación en los logs:

```
🚀 INICIANDO SAGA DE COMPRA
📦 PASO 1: Obteniendo información del producto...
✅ Producto obtenido: Mouse - Precio: $25

💳 PASO 2: Procesando pago...
✅ Pago procesado: PAY-9876543210

📊 PASO 3: Actualizando inventario...
❌ ERROR EN SAGA - INICIANDO COMPENSACIONES
Motivo: Stock insuficiente

🔄 Ejecutando 1 compensación(es)...
🔄 Compensando: pagos...
✅ pagos compensado exitosamente

✅ COMPENSACIONES COMPLETADAS
```

---

## Paso 12: Manejo de Errores y Compensaciones

### Lógica implementada en el orquestador:

1. **Registro de transacciones completadas**: Cada vez que una transacción tiene éxito, se agrega al array `transaccionesCompletadas`.

2. **Detección de errores**: Si algún microservicio retorna un código diferente a 200, se lanza una excepción.

3. **Compensación en orden inverso**: 
   - Si falla en el paso 3 (inventario), se compensa el paso 2 (pagos).
   - Si falla en el paso 4 (compras), se compensan los pasos 3 y 2 (inventario y pagos).

4. **Respuesta al cliente**: Se retorna un objeto JSON indicando si la transacción fue exitosa o fallida.

---

## Paso 13: Principios SOLID Aplicados

### Single Responsibility Principle (SRP)
- **Controladores**: Solo manejan peticiones HTTP y validaciones básicas
- **Servicios**: Contienen la lógica de negocio específica
- **Utilidades**: Funcionalidades reutilizables (simulación de latencia)
- **Configuración**: Gestiona las URLs de servicios de forma centralizada

### Open/Closed Principle (OCP)
- Los servicios están abiertos a extensión pero cerrados a modificación
- Se pueden agregar nuevos microservicios sin modificar el código existente
- La estructura permite agregar nuevas funcionalidades sin romper las existentes

### Liskov Substitution Principle (LSP)
- Los servicios implementan contratos claros mediante sus métodos públicos
- Las respuestas son consistentes y predecibles

### Interface Segregation Principle (ISP)
- Cada servicio expone solo los métodos que necesita
- Los controladores no dependen de métodos que no utilizan
- Separación clara entre capa de presentación (controllers) y lógica (services)

### Dependency Inversion Principle (DIP)
- Los controladores dependen de servicios (abstracciones), no de implementaciones concretas
- El orquestador usa `MicroservicesService` como capa de abstracción para la comunicación HTTP
- La configuración está separada del código de negocio

### Otros Principios Aplicados

**KISS (Keep It Simple, Stupid)**
- Código directo y fácil de entender
- Sin abstracciones innecesarias
- Lógica clara en cada método

**DRY (Don't Repeat Yourself)**
- Carpeta `shared/` con utilidades comunes (LatenciaUtil)
- Una sola implementación de simulación de latencia para todos los microservicios
- Estructura consistente en todos los servicios
- Métodos privados en `SagaService` evitan duplicación
- No hay código repetido entre microservicios

**Clean Code**
- Nombres descriptivos de variables, métodos y clases
- Métodos pequeños con una sola responsabilidad
- Comentarios JSDoc para documentación
- Estructura consistente y predecible
- Logs informativos y organizados

---

## Paso 14: Respuesta Final al Cliente

El sistema siempre responde al cliente con:

### Estructura de respuesta exitosa:
```typescript
{
  success: true,
  message: string,
  detalles: {
    producto: string,
    cantidad: number,
    montoTotal: number,
    pagoId: string,
    compraId: string
  }
}
```

### Estructura de respuesta fallida:
```typescript
{
  success: false,
  message: string,
  error: string,
  detalles: {
    producto: string,
    cantidad: number,
    transaccionesRevertidas: number
  }
}
```

El cliente puede confiar en el campo `success` para determinar el resultado de la operación.

---

## Paso 15: Flujo de Uso y Manejo de Memoria

### Flujo Completo del Sistema

```
┌─────────────┐
│   Cliente   │
│  (Postman/  │
│    curl)    │
└──────┬──────┘
       │ POST /comprar
       │ { usuario, productoId, cantidad }
       ▼
┌─────────────────────────────────────────────────────┐
│              ORQUESTADOR (Puerto 3000)              │
│                                                     │
│  1. Recibe petición en SagaController              │
│  2. Valida parámetros                              │
│  3. Llama a SagaService.ejecutarSagaCompra()       │
│                                                     │
│  ┌───────────────────────────────────────────┐    │
│  │        Ejecución de la Saga               │    │
│  │                                           │    │
│  │  Paso 1: GET ms-catalogo:3001/producto   │──┐ │
│  │          ↓ (siempre 200)                  │  │ │
│  │          Obtiene: { id, nombre, precio }  │  │ │
│  │                                           │  │ │
│  │  Paso 2: POST ms-pagos:3002/transaccion  │  │ │
│  │          ↓ (200 o 409 aleatorio)          │  │ │
│  │          Si 200: guarda pagoId            │  │ │
│  │          Si 409: ❌ FALLO → compensar     │  │ │
│  │                                           │  │ │
│  │  Paso 3: POST ms-inventario:3003/trans.. │  │ │
│  │          ↓ (200 o 409 aleatorio)          │  │ │
│  │          Si 200: continúa                 │  │ │
│  │          Si 409: ❌ FALLO → compensar P2  │  │ │
│  │                                           │  │ │
│  │  Paso 4: POST ms-compras:3004/transacc.. │  │ │
│  │          ↓ (200 o 409 aleatorio)          │  │ │
│  │          Si 200: ✅ ÉXITO TOTAL           │  │ │
│  │          Si 409: ❌ FALLO → compensar P3,P2│  │ │
│  └───────────────────────────────────────────┘  │ │
│                                                 │ │
│  4. Retorna resultado al cliente (200 o 409)   │ │
└─────────────────────────────────────────────────┘ │
                                                    │
    ┌───────────────────────────────────────────────┘
    │
    │  Comunicación HTTP entre microservicios
    │
    ▼
┌─────────────┬─────────────┬─────────────┬─────────────┐
│ ms-catalogo │  ms-pagos   │ms-inventario│ ms-compras  │
│  (3001)     │   (3002)    │   (3003)    │   (3004)    │
│             │             │             │             │
│ GET         │ POST        │ POST        │ POST        │
│ /producto   │ /transaccion│ /transaccion│ /transaccion│
│             │ /compensar  │ /compensar  │ /compensar  │
└─────────────┴─────────────┴─────────────┴─────────────┘
```

### Manejo de Memoria y Estado

#### **Para este Trabajo Práctico: NO se requiere persistencia**

Según la consigna, los microservicios simulan operaciones pero **no necesitan persistir datos realmente**. Todo el estado es **transitorio** y se mantiene solo durante la ejecución de la saga.

#### **¿Usamos Map o base de datos?**

**Respuesta: NINGUNO** - Para este TP no es necesario.

**Razones:**

1. **ms-catalogo**: Retorna datos aleatorios hardcodeados (array en memoria).
2. **ms-pagos**: Simula procesamiento, no persiste pagos reales.
3. **ms-inventario**: Simula actualización, no mantiene stock real.
4. **ms-compras**: Simula registro, no guarda compras reales.

#### **Estado durante la ejecución**

El **único lugar** donde se mantiene estado temporal es en el **Orquestador**:

```typescript
// En SagaService.ejecutarSagaCompra()
const transaccionesCompletadas: TransaccionCompletada[] = [];
// ↑ Array temporal que vive solo durante la ejecución de UNA saga
```

Este array:
- ✅ Se crea cuando inicia una saga
- ✅ Almacena qué pasos se completaron
- ✅ Se usa para saber qué compensar si hay error
- ✅ Se descarta cuando termina la saga (éxito o fallo)

#### **Si quisieras agregar persistencia (OPCIONAL - no requerido):**

**Opción 1: Map en memoria (desarrollo/testing)**
```typescript
// En cada servicio
class PagosService {
  private pagos: Map<string, any> = new Map();
  
  procesarPago(...) {
    const id = this.generarTransaccionId();
    this.pagos.set(id, { usuario, monto, fecha: new Date() });
    return id;
  }
  
  compensarPago(id: string) {
    this.pagos.delete(id);
  }
}
```

**Desventajas del Map:**
- ❌ Se pierde al reiniciar el servicio
- ❌ No escala con múltiples instancias
- ❌ No hay persistencia real

**Opción 2: Base de datos (producción real)**
```typescript
// MongoDB, PostgreSQL, etc.
class PagosService {
  async procesarPago(...) {
    const pago = await db.pagos.insert({ usuario, monto, estado: 'procesado' });
    return pago.id;
  }
  
  async compensarPago(id: string) {
    await db.pagos.update(id, { estado: 'reembolsado' });
  }
}
```

#### **Para este TP: Recomendación**

**NO agregues persistencia**. La consigna pide:
- ✅ Simular las operaciones
- ✅ Retornar respuestas aleatorias (200/409)
- ✅ Implementar compensaciones
- ✅ Orquestación de la saga

**NO pide:**
- ❌ Guardar datos en base de datos
- ❌ Mantener estado entre peticiones
- ❌ Crear un sistema CRUD completo

### Flujo de Memoria Simplificado

```
PETICIÓN 1:
┌─────────────────────────────────────┐
│ POST /comprar (usuario: juan)       │
│                                     │
│ Orquestador crea:                   │
│ transaccionesCompletadas = []       │
│                                     │
│ Ejecuta saga → ÉXITO                │
│ transaccionesCompletadas se descarta│
│                                     │
│ Retorna: { success: true }          │
└─────────────────────────────────────┘

PETICIÓN 2 (completamente independiente):
┌─────────────────────────────────────┐
│ POST /comprar (usuario: maria)      │
│                                     │
│ Orquestador crea NUEVO:             │
│ transaccionesCompletadas = []       │
│                                     │
│ Ejecuta saga → FALLO en inventario  │
│ Compensa pagos                      │
│ transaccionesCompletadas se descarta│
│                                     │
│ Retorna: { success: false }         │
└─────────────────────────────────────┘
```

### Estado Stateless

Cada microservicio es **stateless** (sin estado):
- No recuerdan peticiones anteriores
- Cada petición es independiente
- No hay sesiones ni contexto compartido
- Perfecto para escalabilidad horizontal

Esto significa que puedes tener **múltiples instancias** de cada microservicio sin problemas de sincronización.

### Ejemplo de Flujo Real con Código

**Escenario: Usuario hace una compra**

```typescript
// 1. Cliente envía petición
POST http://localhost:3000/comprar
Body: { "usuario": "juan", "productoId": 1, "cantidad": 2 }

// 2. SagaController recibe y valida
sagaController.comprar(req, res)
  ↓
// 3. SagaService inicia la saga
const transaccionesCompletadas = []; // ← Array temporal creado aquí

// 4. Paso 1: Obtener producto
producto = await microservicesService.obtenerProducto(1)
// ms-catalogo responde: { id: 1, nombre: "Laptop", precio: 1200 }
// NO se agrega a transaccionesCompletadas (no requiere compensación)

// 5. Paso 2: Procesar pago
pagoId = await microservicesService.procesarPago(2400, "juan")
// ms-pagos responde 200: { transaccionId: "PAY-1234" }
transaccionesCompletadas.push({
  servicio: 'pagos',
  datos: { transaccionId: "PAY-1234", monto: 2400 }
}); // ← Se guarda para posible compensación

// 6. Paso 3: Actualizar inventario
await microservicesService.actualizarInventario(1, 2)
// ms-inventario responde 409: { success: false, message: "Sin stock" }
// ❌ ERROR DETECTADO

// 7. Inicia compensación
// transaccionesCompletadas = [{ servicio: 'pagos', datos: {...} }]
// Recorre en orden inverso (solo hay pagos)

await microservicesService.compensar('pagos', { transaccionId: "PAY-1234", monto: 2400 })
// ms-pagos/compensar responde 200: { success: true, message: "Reembolsado" }

// 8. Retorna al cliente
res.status(409).json({
  success: false,
  message: "Transacción fallida - Todas las operaciones fueron revertidas",
  error: "Stock insuficiente",
  detalles: {
    producto: "Laptop",
    cantidad: 2,
    transaccionesRevertidas: 1
  }
});

// 9. transaccionesCompletadas se descarta (fin de función)
// El garbage collector de Node.js lo elimina de memoria
```

### Visualización de Memoria Durante la Ejecución

```
INICIO DE SAGA
Memory: [
  orquestador: {
    transaccionesCompletadas: []  // Array vacío
  }
]

DESPUÉS DE PASO 2 (Pago exitoso)
Memory: [
  orquestador: {
    transaccionesCompletadas: [
      { servicio: 'pagos', datos: { transaccionId: 'PAY-1234', monto: 2400 } }
    ]
  }
]

DESPUÉS DE PASO 3 (Inventario exitoso)
Memory: [
  orquestador: {
    transaccionesCompletadas: [
      { servicio: 'pagos', datos: { transaccionId: 'PAY-1234', monto: 2400 } },
      { servicio: 'inventario', datos: { productoId: 1, cantidad: 2 } }
    ]
  }
]

FIN DE SAGA (Éxito o Fallo)
Memory: [
  orquestador: {}  // transaccionesCompletadas ya no existe
]
```

### ¿Qué pasa con múltiples peticiones simultáneas?

```typescript
// Usuario 1 hace compra → Crea su propio transaccionesCompletadas_1
// Usuario 2 hace compra → Crea su propio transaccionesCompletadas_2

// Son completamente independientes, no interfieren entre sí
// Cada ejecución de función tiene su propio scope/contexto
```

Node.js maneja esto automáticamente con su **event loop** y **call stack**:
- Cada petición HTTP crea un nuevo contexto de ejecución
- Las variables locales son independientes por petición
- No hay riesgo de "pisar" datos entre usuarios

### Diagrama de Secuencia Detallado

```
Cliente          Orquestador       Catálogo    Pagos    Inventario    Compras
  |                   |                |          |          |            |
  |--- POST /comprar -|                |          |          |            |
  |                   |                |          |          |            |
  |                   |-- GET /producto/1 ------>|          |            |
  |                   |<------- 200 OK -----------|          |            |
  |                   | (Laptop, $1200)           |          |            |
  |                   |                           |          |            |
  |                   |-- POST /transaccion ------|--------->|            |
  |                   |    {monto: 2400}          |          |            |
  |                   |<------- 200 OK -----------|----------|            |
  |                   | (pagoId: PAY-123)         |          |            |
  |                   | [GUARDA en array]         |          |            |
  |                   |                           |          |            |
  |                   |-- POST /transaccion ------|----------|-------->   |
  |                   |    {productoId: 1}        |          |            |
  |                   |<------- 200 OK -----------|----------|--------|   |
  |                   | (stock actualizado)       |          |            |
  |                   | [GUARDA en array]         |          |            |
  |                   |                           |          |            |
  |                   |-- POST /transaccion ------|----------|------------|---->
  |                   |    {usuario: juan}        |          |            |
  |                   |<------- 200 OK -----------|----------|------------|----
  |                   | (compraId: COMP-456)      |          |            |
  |                   | [GUARDA en array]         |          |            |
  |                   |                           |          |            |
  |<--- 200 OK -------|                           |          |            |
  |  {success: true}  |                           |          |            |
  |                   | [DESCARTA array]          |          |            |
```

**Caso con FALLO:**

```
Cliente          Orquestador       Catálogo    Pagos    Inventario    Compras
  |                   |                |          |          |            |
  |--- POST /comprar -|                |          |          |            |
  |                   |                |          |          |            |
  |                   |-- GET /producto -------->|          |            |
  |                   |<------- 200 OK ----------|          |            |
  |                   |                          |          |            |
  |                   |-- POST /transaccion -----|--------->|            |
  |                   |<------- 200 OK ----------|----------|            |
  |                   | [GUARDA: pagos]          |          |            |
  |                   |                          |          |            |
  |                   |-- POST /transaccion -----|----------|-------->   |
  |                   |<------- 409 CONFLICT ----|----------|--------|   |
  |                   | ❌ SIN STOCK             |          |            |
  |                   |                          |          |            |
  |                   | 🔄 INICIA COMPENSACIÓN   |          |            |
  |                   | [LEE array: tiene pagos] |          |            |
  |                   |                          |          |            |
  |                   |-- POST /compensar -------|--------->|            |
  |                   |    {pagoId: PAY-123}     |          |            |
  |                   |<------- 200 OK ----------|----------|            |
  |                   | (reembolso procesado)    |          |            |
  |                   |                          |          |            |
  |<--- 409 CONFLICT -|                          |          |            |
  | {success: false}  |                          |          |            |
  | transacciones     |                          |          |            |
  | revertidas: 1     |                          |          |            |
  |                   | [DESCARTA array]         |          |            |
```

### Resumen: ¿Map, Base de Datos o Nada?

| Componente | ¿Necesita persistencia? | ¿Qué usa? | Justificación |
|------------|-------------------------|-----------|---------------|
| **ms-catalogo** | ❌ NO | Array hardcodeado | Solo retorna datos de ejemplo |
| **ms-pagos** | ❌ NO | Nada (simula) | Solo simula procesamiento |
| **ms-inventario** | ❌ NO | Nada (simula) | Solo simula actualización |
| **ms-compras** | ❌ NO | Nada (simula) | Solo simula registro |
| **Orquestador** | ❌ NO | Array temporal | Solo durante ejecución de una saga |

### ¿Cuándo SÍ usar Map o BD?

**Usa Map cuando:**
- Quieras hacer pruebas y ver qué datos se "guardaron"
- Necesites debugging más avanzado
- Quieras implementar consultas tipo "ver todas las compras"
- Es un proyecto de desarrollo/staging

**Usa Base de Datos cuando:**
- Es un sistema real de producción
- Necesitas auditoría y trazabilidad
- Múltiples instancias del servicio deben compartir datos
- Requieres persistencia entre reinicios

**Para este TP: Usa NADA** ✅
- La consigna no lo requiere
- Mantiene el código simple (KISS)
- Cumple con todos los requisitos
- El foco está en la **orquestación de la saga**, no en persistencia

---

## Resumen de Implementación

✅ **Carpeta `shared/`** con utilidades comunes (aplicando DRY)  
✅ **4 microservicios independientes** (Catálogo, Pagos, Inventario, Compras)  
✅ **1 orquestador** que coordina el flujo  
✅ **Arquitectura en capas** (Controllers, Services, Config)  
✅ **Respuestas aleatorias** en pagos, inventario y compras  
✅ **Compensaciones automáticas** en caso de fallo  
✅ **Simulación de latencia** para realismo (código compartido)  
✅ **Logs detallados** para seguimiento  
✅ **Respuesta clara al cliente** (éxito o fallo)  
✅ **Principios SOLID** aplicados en toda la arquitectura  

El sistema cumple completamente con los requisitos de la consigna sin agregar funcionalidades extras, y además sigue las mejores prácticas de desarrollo con código limpio y sin duplicación.
