# Teoría del Patrón Saga - Trabajo Práctico

## 1. Contexto del Problema

### Conceptos Fundamentales

#### Transacción
Una **transacción** representa una unidad de trabajo que puede incluir varias operaciones. Es un conjunto de acciones que deben ejecutarse de manera conjunta y coherente.

#### Evento
Un **evento** es un cambio de estado sobre una entidad. Representa algo que ha ocurrido en el sistema (por ejemplo, "producto comprado", "pago procesado", "stock actualizado").

#### Comando
Un **comando** encapsula toda la información necesaria para realizar una acción o desencadenar un evento posterior. Es una instrucción que se envía a un servicio para que ejecute una operación específica.

---

## 2. Propiedades ACID

Las transacciones deben cumplir con las propiedades **ACID**:

### **A - Atomicity (Atomicidad)**
- Todas las operaciones de la transacción se completan exitosamente, o ninguna se aplica.
- Es "todo o nada": no puede quedar en un estado intermedio.
- Si falla una operación, todas las anteriores deben revertirse.

### **C - Consistency (Consistencia)**
- La transacción lleva al sistema de un estado válido a otro estado válido.
- Se respetan todas las reglas de integridad y restricciones definidas.
- Los datos siempre permanecen en un estado coherente.

### **I - Isolation (Aislamiento)**
- Las transacciones concurrentes no interfieren entre sí.
- Cada transacción se ejecuta como si fuera la única en el sistema.
- Los cambios de una transacción no son visibles para otras hasta que se completa.

### **D - Durability (Durabilidad)**
- Una vez que la transacción se confirma, los cambios son permanentes.
- Incluso si hay fallos del sistema, los datos persisten.
- Los cambios confirmados sobreviven a reinicios o caídas.

---

## 3. El Desafío en Microservicios

### ¿Por qué ACID es difícil en arquitecturas de microservicios?

En una arquitectura de microservicios, los datos están **distribuidos** entre múltiples servicios independientes:

1. **Bases de datos separadas**: Cada microservicio tiene su propia base de datos (principio de autonomía).

2. **No hay transacciones distribuidas nativas**: No se puede usar un simple `BEGIN TRANSACTION` / `COMMIT` que abarque múltiples bases de datos.

3. **Fallos parciales**: Un servicio puede fallar mientras otros ya completaron su parte de la transacción.

4. **Latencia de red**: La comunicación entre servicios es más lenta y puede fallar.

5. **Consistencia eventual**: Se debe aceptar que los datos no siempre estarán sincronizados inmediatamente.

### Ejemplo del problema

En nuestro sistema de e-commerce:
- El servicio de **pagos** ya cobró al cliente
- El servicio de **inventario** no tiene stock disponible
- ¿Cómo revertimos el pago si ya se procesó en otra base de datos?

**Solución tradicional (monolito)**: 
```sql
BEGIN TRANSACTION;
  UPDATE pagos SET estado = 'procesado';
  UPDATE inventario SET cantidad = cantidad - 1;
  INSERT INTO compras VALUES (...);
COMMIT; -- Si algo falla, todo se revierte automáticamente
```

**Problema en microservicios**: Cada `UPDATE` está en una base de datos diferente, gestionada por un servicio independiente. No hay forma nativa de hacer un `ROLLBACK` global.

---

## 4. El Patrón Saga

### ¿Qué es el Patrón Saga?

El **Patrón Saga** es una solución para gestionar transacciones distribuidas en sistemas de microservicios. 

**Definición**: Una saga es una secuencia de transacciones locales. Cada transacción local actualiza la base de datos de un servicio y publica un evento o mensaje para activar la siguiente transacción local en la saga.

### Características principales:

1. **División de la transacción global**: Se divide en múltiples transacciones locales, cada una gestionada por un microservicio específico.

2. **Compensaciones**: Si una transacción local falla, se ejecutan transacciones compensatorias para deshacer los cambios de las transacciones locales completadas previamente.

3. **Consistencia eventual**: El sistema puede estar temporalmente inconsistente, pero eventualmente llegará a un estado consistente (éxito total o compensación total).

---

## 5. Saga por Orquestación

Existen dos formas de implementar el patrón Saga:
- **Coreografía**: Los servicios se comunican mediante eventos sin un coordinador central.
- **Orquestación**: Un componente central (orquestador) coordina todas las transacciones.

### Orquestación (Nuestro enfoque)

En la **orquestación**, existe un **orquestador central** que:

1. **Coordina el flujo**: Decide qué servicio llamar y en qué orden.
2. **Maneja errores**: Detecta cuándo una transacción local falla.
3. **Ejecuta compensaciones**: Invoca las transacciones compensatorias en orden inverso.
4. **Mantiene el estado**: Lleva registro de qué transacciones se completaron.

### Ventajas de la Orquestación:

- **Simplicidad**: La lógica del flujo está centralizada.
- **Visibilidad**: Es fácil rastrear el estado de la transacción.
- **Control**: El orquestador tiene el control total del proceso.
- **Debugging**: Más fácil depurar y entender el flujo.

### Desventajas:

- **Punto único de falla**: Si el orquestador cae, las sagas no se pueden ejecutar.
- **Acoplamiento**: Los servicios dependen del orquestador.

---

## 6. Compensaciones

### ¿Qué son las compensaciones?

Una **transacción compensatoria** (o compensación) es una operación que deshace el efecto de una transacción local previamente completada.

**Importante**: Las compensaciones no son `ROLLBACK` automáticos, son **operaciones de negocio** que revierten semánticamente el cambio.

### Ejemplos:

| Transacción Original | Compensación |
|---------------------|--------------|
| Procesar pago de $100 | Reembolsar $100 |
| Reducir stock en 1 unidad | Incrementar stock en 1 unidad |
| Registrar compra | Cancelar/eliminar compra |
| Reservar asiento | Liberar asiento |

### Características de las compensaciones:

1. **Idempotentes**: Ejecutar una compensación múltiples veces tiene el mismo efecto que ejecutarla una vez.

2. **Orden inverso**: Se ejecutan en orden inverso al de las transacciones originales.

3. **Siempre exitosas**: Deben estar diseñadas para tener éxito (retornan 200).

4. **Semánticamente correctas**: Deben revertir el efecto de negocio, no necesariamente el estado técnico exacto.

---

## 7. Flujo de la Saga en el Sistema de E-Commerce

### Microservicios del Sistema

#### 1. **ms-catalogo**
- **Responsabilidad**: Gestionar productos y sus detalles.
- **Operación**: Retorna información de un producto con datos aleatorios.
- **Comportamiento**: Siempre responde con status 200 (nunca falla).

#### 2. **ms-pagos**
- **Responsabilidad**: Procesar pagos de clientes.
- **Operaciones**:
  - `/transaccion`: Procesa un pago (200 éxito o 409 fallo aleatorio).
  - `/compensar`: Revierte un pago (reembolso) - siempre 200.

#### 3. **ms-inventario**
- **Responsabilidad**: Gestionar el stock de productos.
- **Operación**: `/transaccion`: Actualiza inventario (200 si hay stock, 409 si no hay).
- **Comportamiento**: Respuestas aleatorias.
- **Rol crítico**: Su fallo obliga a compensar pagos y compras previas.

#### 4. **ms-compras**
- **Responsabilidad**: Persistir las compras realizadas por usuarios.
- **Operaciones**:
  - `/transaccion`: Registra una compra (200 o 409 aleatorio).
  - `/compensar`: Cancela/elimina una compra - siempre 200.

---

## 8. Flujo Completo de la Saga (Orquestación)

### Flujo Normal (Caso de Éxito)

```
1. Usuario selecciona un producto
   → Orquestador llama a ms-catalogo
   → ms-catalogo retorna 200 (siempre)

2. Usuario realiza el pago
   → Orquestador llama a ms-pagos/transaccion
   → ms-pagos retorna 200 (pago exitoso)

3. Se actualiza inventario
   → Orquestador llama a ms-inventario/transaccion
   → ms-inventario retorna 200 (stock actualizado)

4. Se registra la compra
   → Orquestador llama a ms-compras/transaccion
   → ms-compras retorna 200 (compra registrada)

✅ RESULTADO: Transacción exitosa
```

### Flujo con Fallo (Caso de Compensación)

**Ejemplo: Fallo en inventario**

```
1. ms-catalogo → 200 ✅
2. ms-pagos/transaccion → 200 ✅ (pago procesado)
3. ms-inventario/transaccion → 409 ❌ (sin stock)

   ⚠️ FALLO DETECTADO
   
   El orquestador inicia compensaciones en ORDEN INVERSO:
   
   4. ms-pagos/compensar → 200 (reembolso realizado)

❌ RESULTADO: Transacción fallida - Todo compensado
```

**Ejemplo: Fallo en compras**

```
1. ms-catalogo → 200 ✅
2. ms-pagos/transaccion → 200 ✅
3. ms-inventario/transaccion → 200 ✅
4. ms-compras/transaccion → 409 ❌

   ⚠️ FALLO DETECTADO
   
   Compensaciones en ORDEN INVERSO:
   
   5. ms-inventario/compensar → 200 (stock restaurado)
   6. ms-pagos/compensar → 200 (reembolso realizado)

❌ RESULTADO: Transacción fallida - Todo compensado
```

---

## 9. Conexión con TypeScript y Express

### ¿Por qué TypeScript?

- **Tipado estático**: Reduce errores en tiempo de ejecución.
- **Interfaces claras**: Definir contratos entre servicios.
- **Mejor mantenibilidad**: Código más robusto y documentado.
- **Autocompletado**: Mejor experiencia de desarrollo.

### ¿Por qué Express?

- **Framework minimalista**: Fácil de entender y extender.
- **Manejo de rutas HTTP**: Perfecto para crear APIs REST.
- **Middleware**: Facilita logging, manejo de errores, etc.
- **Amplia adopción**: Comunidad grande y documentación extensa.

### Implementación en TypeScript + Express

Cada microservicio es una aplicación Express independiente:

```typescript
// Ejemplo conceptual
import express from 'express';

const app = express();

// Endpoint de transacción
app.post('/transaccion', (req, res) => {
  // Lógica de negocio
  const exito = Math.random() > 0.5;
  res.status(exito ? 200 : 409).json({ ... });
});

// Endpoint de compensación
app.post('/compensar', (req, res) => {
  // Lógica de compensación
  res.status(200).json({ ... });
});
```

El **orquestador** coordina llamadas HTTP a cada microservicio:

```typescript
// Ejemplo conceptual del orquestador
async function ejecutarSaga() {
  try {
    // 1. Obtener producto
    await llamarCatalogo();
    
    // 2. Procesar pago
    await llamarPagos();
    transaccionesCompletadas.push('pagos');
    
    // 3. Actualizar inventario
    await llamarInventario();
    transaccionesCompletadas.push('inventario');
    
    // 4. Registrar compra
    await llamarCompras();
    
    return { exito: true };
    
  } catch (error) {
    // Compensar en orden inverso
    await compensarTransacciones();
    return { exito: false };
  }
}
```

---

## 10. Requisitos Técnicos Adicionales

### Simulación de Latencia y Errores

Para hacer el sistema más realista, se debe simular:

1. **Latencia de red**: Delays artificiales entre llamadas a microservicios.
2. **Fallos aleatorios**: Respuestas 409 con probabilidad aleatoria.

**Librerías útiles**:
- Para latencia: `setTimeout`, `sleep`, o librerías como `delay`
- Para aleatoriedad: `Math.random()`

### Principios de Desarrollo

El código debe cumplir con:

1. **KISS (Keep It Simple, Stupid)**: Mantener el código simple y directo.
2. **DRY (Don't Repeat Yourself)**: No duplicar lógica.
3. **SOLID**: Principios de diseño orientado a objetos.
4. **Clean Code**: Código legible, bien nombrado y mantenible.

### Respuesta al Cliente

El sistema debe indicar claramente al cliente:
- ✅ **Transacción exitosa**: Todos los pasos se completaron.
- ❌ **Transacción fallida**: Hubo un error y se ejecutaron las compensaciones.

---

## Resumen

El **Patrón Saga con Orquestación** permite manejar transacciones distribuidas en microservicios mediante:

1. Un **orquestador central** que coordina el flujo.
2. **Transacciones locales** en cada microservicio.
3. **Compensaciones** que revierten cambios en caso de fallo.
4. **Consistencia eventual** en lugar de ACID estricto.

Este enfoque es esencial para construir sistemas distribuidos robustos que puedan manejar fallos parciales y mantener la integridad del negocio.
