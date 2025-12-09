# 📮 Guía para Configurar Postman Correctamente

## ✅ Configuración Paso a Paso

### 1. Método HTTP
- Selecciona **POST** en el dropdown de métodos

### 2. URL
```
http://localhost:3000/comprar
```

### 3. Headers (IMPORTANTE)
En la pestaña **Headers**, agrega:

| Key | Value |
|-----|-------|
| `Content-Type` | `application/json` |

**⚠️ IMPORTANTE:** Postman puede agregar automáticamente este header cuando seleccionas "raw" > "JSON", pero verifica que esté presente.

### 4. Body (CRÍTICO)
1. Ve a la pestaña **Body**
2. Selecciona la opción **raw**
3. En el dropdown de la derecha, selecciona **JSON** (no Text, no JavaScript)
4. Ingresa el siguiente JSON:

```json
{
  "usuario": "juan123",
  "productoId": 1,
  "cantidad": 2
}
```

### 5. Verificación Visual

Tu configuración en Postman debería verse así:

```
┌─────────────────────────────────────────┐
│ POST  http://localhost:3000/comprar     │
├─────────────────────────────────────────┤
│ Params | Authorization | Headers | Body│
├─────────────────────────────────────────┤
│ Headers:                                 │
│ Content-Type: application/json           │
├─────────────────────────────────────────┤
│ Body:                                    │
│ ○ none  ○ form-data  ○ x-www-form-url   │
│ ○ binary  ○ GraphQL  ● raw  ○ Text      │
│                                         │
│ [JSON ▼]                                │
│                                         │
│ {                                       │
│   "usuario": "juan123",                 │
│   "productoId": 1,                      │
│   "cantidad": 2                         │
│ }                                       │
└─────────────────────────────────────────┘
```

## ❌ Errores Comunes

### Error 1: "req.body is undefined"
**Causa:** No seleccionaste "raw" > "JSON" o falta el header Content-Type

**Solución:**
- Asegúrate de seleccionar **Body** > **raw** > **JSON**
- Verifica que el header `Content-Type: application/json` esté presente

### Error 2: "Faltan parámetros"
**Causa:** El JSON está mal formateado o faltan campos

**Solución:**
- Verifica que el JSON sea válido (sin comas al final, comillas correctas)
- Asegúrate de incluir los 3 campos: `usuario`, `productoId`, `cantidad`

### Error 3: "Cannot POST /comprar"
**Causa:** El orquestador no está corriendo

**Solución:**
```bash
cd orquestador
npm run dev
```

## 🧪 Ejemplos de Body Válidos

### Ejemplo 1: Compra básica
```json
{
  "usuario": "juan123",
  "productoId": 1,
  "cantidad": 2
}
```

### Ejemplo 2: Otra compra
```json
{
  "usuario": "maria456",
  "productoId": 3,
  "cantidad": 1
}
```

### Ejemplo 3: Compra múltiple
```json
{
  "usuario": "pedro789",
  "productoId": 5,
  "cantidad": 3
}
```

## 📊 Respuestas Esperadas

### ✅ Éxito (HTTP 200)
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

### ❌ Fallo (HTTP 409)
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
  "message": "Faltan parámetros: usuario, productoId, cantidad",
  "recibido": {}
}
```

## 🔍 Verificar en los Logs

Cuando hagas la petición desde Postman, deberías ver en la consola del orquestador:

```
[2024-01-01T12:00:00.000Z] POST /comprar
[Orquestador] Content-Type: application/json
[Orquestador] Body recibido: {
  "usuario": "juan123",
  "productoId": 1,
  "cantidad": 2
}
```

Si ves `Body recibido: undefined`, significa que:
- ❌ No seleccionaste "raw" > "JSON" en Postman
- ❌ Falta el header `Content-Type: application/json`
- ❌ El body está vacío

## 💡 Tips Adicionales

1. **Guardar la Request:** Guarda la petición en Postman para reutilizarla
2. **Variables de Entorno:** Puedes crear variables en Postman para el `usuario`, `productoId`, etc.
3. **Tests:** Agrega tests en Postman para verificar automáticamente las respuestas
4. **Colección:** Crea una colección con todas las peticiones del proyecto

## 🎯 Checklist Rápido

Antes de enviar la petición, verifica:

- [ ] Método: **POST**
- [ ] URL: `http://localhost:3000/comprar`
- [ ] Header: `Content-Type: application/json`
- [ ] Body: Seleccionado **raw** > **JSON**
- [ ] JSON válido con los 3 campos requeridos
- [ ] Orquestador corriendo en puerto 3000

¡Listo! Con esta configuración deberías poder hacer la petición correctamente. 🚀

