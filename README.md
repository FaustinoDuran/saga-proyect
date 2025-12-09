# 🛒 Sistema de Comercio Electrónico con Patrón Saga

## 📋 Descripción del Proyecto

Este proyecto implementa un sistema de comercio electrónico distribuido utilizando una arquitectura de microservicios. El sistema resuelve el problema de coherencia de datos entre microservicios independientes mediante la implementación del **Patrón Saga con Orquestación**.

### Contexto del Problema

En arquitecturas de microservicios, las garantías tradicionales de base de datos (ACID) no se aplican directamente a datos administrados de forma independiente. Este proyecto implementa el patrón Saga para garantizar la consistencia transaccional distribuida.

## 🏗️ Arquitectura

### Patrón Saga con Orquestación

El sistema utiliza un **orquestador central** que coordina el flujo de trabajo entre los microservicios. Cada paso de la transacción puede fallar, y en caso de error, se ejecutan compensaciones en orden inverso para revertir las operaciones completadas.

### Flujo de Transacción

```
1. Usuario selecciona producto → ms-catalogo
2. Realiza el pago → ms-pagos
3. Inventario se actualiza → ms-inventario
4. Actualiza productos comprados → ms-compras
```

Si cualquier paso falla, se ejecutan compensaciones automáticas en orden inverso.

## 📁 Estructura del Proyecto

```
saga-proyect/
├── shared/                    # Código compartido (DRY)
│   ├── types/                # Tipos TypeScript reutilizables
│   │   ├── producto.types.ts
│   │   ├── transaccion.types.ts
│   │   └── response.types.ts
│   └── utils/                # Utilidades comunes
│       └── latencia.util.ts
│
├── ms-catalogo/              # Microservicio de Catálogo
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   └── index.ts
│   └── package.json
│
├── ms-pagos/                 # Microservicio de Pagos
│   ├── src/
│   │   ├── controllers/
│   │   ├── services/
│   │   ├── routes/
│   │   └── index.ts
│   └── package.json
│
├── ms-inventario/            # Microservicio de Inventario
│   ├── src/
│   │   ├── controller/
│   │   ├── services/
│   │   ├── routes/
│   │   └── index.ts
│   └── package.json
│
├── ms-compras/               # Microservicio de Compras
│   ├── src/
│   │   ├── controller/
│   │   ├── services/
│   │   ├── routes/
│   │   └── index.ts
│   └── package.json
│
└── orquestador/              # Orquestador Saga
    ├── src/
    │   ├── controllers/
    │   ├── services/
    │   ├── routes/
    │   ├── config/
    │   └── index.ts
    └── package.json
```

## 🛠️ Tecnologías Utilizadas

- **Node.js** (v18+)
- **TypeScript** (v5.9+)
- **Express** (v5.2+)
- **Axios** - Para comunicación HTTP entre microservicios
- **dotenv** - Gestión de variables de entorno
- **CORS** - Habilitación de CORS

## 📦 Requisitos Previos

- Node.js v18 o superior
- npm v9 o superior
- 5 terminales disponibles (una por cada servicio)

## 🚀 Instalación

### 1. Clonar o descargar el proyecto

```bash
cd saga-proyect
```

### 2. Instalar dependencias en cada microservicio

```bash
# ms-catalogo
cd ms-catalogo
npm install
cd ..

# ms-pagos
cd ms-pagos
npm install
cd ..

# ms-inventario
cd ms-inventario
npm install
cd ..

# ms-compras
cd ms-compras
npm install
cd ..

# orquestador
cd orquestador
npm install
cd ..
```

## ⚙️ Configuración

### Variables de Entorno

Cada microservicio requiere un archivo `.env` en su directorio raíz.

#### `ms-catalogo/.env`
```env
PORT=3001
NODE_ENV=development
SERVICE_NAME=ms-catalogo
```

#### `ms-pagos/.env`
```env
PORT=3002
NODE_ENV=development
SERVICE_NAME=ms-pagos
```

#### `ms-inventario/.env`
```env
PORT=3003
NODE_ENV=development
SERVICE_NAME=ms-inventario
```

#### `ms-compras/.env`
```env
PORT=3004
NODE_ENV=development
SERVICE_NAME=ms-compras
```

#### `orquestador/.env`
```env
PORT=3000
NODE_ENV=development
SERVICE_NAME=orquestador

# URLs de los microservicios
CATALOGO_URL=http://localhost:3001
PAGOS_URL=http://localhost:3002
INVENTARIO_URL=http://localhost:3003
COMPRAS_URL=http://localhost:3004
```

## ▶️ Ejecución

### Ejecución Manual 

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

### Verificación

Deberías ver en cada terminal:

```
✅ [ms-catalogo] Corriendo en puerto 3001
✅ [ms-pagos] Corriendo en puerto 3002
✅ [ms-inventario] Corriendo en puerto 3003
✅ [ms-compras] Corriendo en puerto 3004
🎯 [orquestador] Corriendo en puerto 3000
```

## 📡 Endpoints

### Orquestador

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| `POST` | `/comprar` | Inicia la saga de compra |
| `GET` | `/health` | Health check del orquestador |

### ms-catalogo

| Método | Endpoint | Descripción | Status Code |
|--------|----------|-------------|-------------|
| `GET` | `/producto/:id` | Obtiene información de un producto | 200 |

### ms-pagos

| Método | Endpoint | Descripción | Status Code |
|--------|----------|-------------|-------------|
| `POST` | `/transaccion` | Procesa un pago | 200 o 409 (aleatorio) |
| `POST` | `/compensar` | Compensa (reembolsa) un pago | 200 |

### ms-inventario

| Método | Endpoint | Descripción | Status Code |
|--------|----------|-------------|-------------|
| `POST` | `/transaccion` | Actualiza el inventario | 200 o 409 (aleatorio) |
| `POST` | `/compensar` | Compensa (restaura) el inventario | 200 |

### ms-compras

| Método | Endpoint | Descripción | Status Code |
|--------|----------|-------------|-------------|
| `POST` | `/transaccion` | Registra una compra | 200 o 409 (aleatorio) |
| `POST` | `/compensar` | Compensa (cancela) una compra | 200 |

## 🧪 Ejemplos de Uso

### Ejemplo 1: Realizar una compra (curl)

```bash
curl -X POST http://localhost:3000/comprar \
  -H "Content-Type: application/json" \
  -d '{
    "usuario": "juan123",
    "productoId": 1,
    "cantidad": 2
  }'
```

### Ejemplo 2: Realizar una compra (Postman)

1. Método: `POST`
2. URL: `http://localhost:3000/comprar`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "usuario": "maria456",
  "productoId": 3,
  "cantidad": 1
}
```

> 📖 Para más detalles sobre cómo usar Postman, consulta [GUIA-POSTMAN.md](./GUIA-POSTMAN.md)

## 📊 Respuestas Esperadas

### ✅ Transacción Exitosa (HTTP 200)

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

### ❌ Transacción Fallida (HTTP 409)

```json
{
  "success": false,
  "message": "Transacción fallida - Todas las operaciones fueron revertidas",
  "error": "Stock insuficiente",
  "detalles": {
    "producto": "Laptop",
    "cantidad": 2,
    "transaccionesRevertidas": 1
  }
}
```

### ⚠️ Error de Validación (HTTP 400)

```json
{
  "success": false,
  "message": "Faltan parámetros: usuario, productoId, cantidad"
}
```

## 🔄 Flujo de Compensación

Cuando ocurre un error en cualquier paso de la saga:

1. **Detección del error:** El orquestador detecta el fallo
2. **Registro de transacciones:** Se identifican las operaciones completadas
3. **Compensación inversa:** Se ejecutan compensaciones en orden inverso:
   - Si falla en paso 4 (compras) → Compensa: compras → inventario → pagos
   - Si falla en paso 3 (inventario) → Compensa: inventario → pagos
   - Si falla en paso 2 (pagos) → Compensa: pagos
4. **Respuesta al cliente:** Se informa del fallo y las compensaciones realizadas

## 🎯 Principios de Diseño Aplicados

### SOLID

- **Single Responsibility Principle (SRP):** Cada clase tiene una única responsabilidad
  - Controllers: Manejan peticiones HTTP
  - Services: Contienen lógica de negocio
  - Routes: Definen rutas

- **Open/Closed Principle (OCP):** Abierto a extensión, cerrado a modificación

- **Liskov Substitution Principle (LSP):** Servicios implementan contratos claros

- **Interface Segregation Principle (ISP):** Cada servicio expone solo métodos necesarios

- **Dependency Inversion Principle (DIP):** Controllers dependen de abstracciones (services)

### DRY (Don't Repeat Yourself)

- **Código compartido:** Carpeta `shared/` con tipos y utilidades comunes
- **LatenciaUtil:** Una sola implementación para todos los microservicios
- **Tipos compartidos:** Definiciones únicas evitando duplicación

### KISS (Keep It Simple, Stupid)

- Código directo y fácil de entender
- Sin abstracciones innecesarias
- Lógica clara en cada método

### Código Limpio

- Nombres descriptivos y significativos
- Métodos pequeños con responsabilidad única
- Estructura consistente y predecible
- Logs informativos y organizados

## 📈 Simulación de Latencia y Errores

### Latencia

Todos los microservicios utilizan `LatenciaUtil` para simular latencia de red entre 500ms y 1500ms, proporcionando un comportamiento más realista.

### Errores Aleatorios

- **ms-pagos:** 70% éxito, 30% fallo (status 409)
- **ms-inventario:** 60% éxito, 40% sin stock (status 409)
- **ms-compras:** 80% éxito, 20% fallo (status 409)
- **ms-catalogo:** Siempre éxito (status 200)

## 📝 Scripts Disponibles

Cada microservicio tiene los siguientes scripts:

- `npm run dev` - Ejecuta en modo desarrollo con nodemon
- `npm run build` - Compila TypeScript a JavaScript
- `npm start` - Ejecuta la versión compilada

## 🏛️ Universidad Tecnológica Nacional

**Facultad Regional San Rafael**  
**Ingeniería en Sistemas**  
**Desarrollo de Software**

## 👥 Autores

Araya Valentino, Conforti Angelo, Contreras Facundo, Durán Faustino, Patiño Ignacio y Romero Tomás.

---

**Versión:** 1.0.0  
**Última actualización:** 2024

