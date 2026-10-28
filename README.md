# API de Servicios y Reservas

API REST desarrollada con **Node.js, Express y MongoDB Atlas**, utilizando **Mongoose** para gestionar servicios y reservas de un sistema de turnos.

Implementa una arquitectura en capas, validaciones de datos y manejo centralizado de errores.

## Instalación y ejecución

Instalar las dependencias:

```bash
npm install
```

Crear un archivo `.env` en la raíz del proyecto, tomando como referencia `.env.example`:

```env
PORT=8080
NODE_ENV=development
MONGO_URI=mongodb+srv://USUARIO:PASSWORD@CLUSTER.mongodb.net/turnos_reservas
```

Reemplazar los valores de ejemplo por las credenciales y el cluster de MongoDB Atlas.

Ejecutar el proyecto:

```bash
npm start
```

Para desarrollo:

```bash
npm run dev
```

La aplicación se conecta a MongoDB antes de iniciar el servidor. Opcionalmente, puede configurarse `DNS_SERVER` si el entorno requiere un servidor DNS alternativo.

## Arquitectura

El proyecto organiza sus responsabilidades mediante el flujo:

**Routes → Controllers → Services → Repositories → DAO → MongoDB**

- **Routes:** definen los endpoints y validan los identificadores.
- **Controllers:** gestionan las solicitudes y respuestas HTTP.
- **Services:** implementan la lógica de negocio.
- **Repositories:** conectan los servicios con los DAO.
- **DAO:** realizan las operaciones de persistencia mediante Mongoose.
- **Models:** definen los esquemas de MongoDB.

Incluye validadores de entrada, middleware global de errores y modelos independientes para `services`, `bookings` y `messages`.

## Recursos

**Services:** `name`, `description`, `duration`, `price`, `category`, `available`.

**Bookings:** `clientName`, `clientEmail`, `date`, `time`, `status`, `services`.

Cada elemento del arreglo `services` de una reserva contiene:

```json
{
  "service": "ObjectId del servicio",
  "quantity": 1
}
```

MongoDB genera automáticamente los identificadores `_id` de los documentos.

## Endpoints

### Services

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/services` | Listar servicios |
| GET | `/api/services/:id` | Obtener servicio por ID |
| POST | `/api/services` | Crear servicio |
| PUT | `/api/services/:id` | Actualizar servicio |
| DELETE | `/api/services/:id` | Eliminar servicio |

El listado admite filtros opcionales por `category` y `available`.

Ejemplo:

```http
GET http://localhost:8080/api/services?category=peluqueria&available=true
```

### Bookings

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/bookings` | Listar reservas |
| GET | `/api/bookings/:bid` | Obtener reserva por ID |
| POST | `/api/bookings` | Crear reserva |
| PUT | `/api/bookings/:bid` | Actualizar reserva |
| DELETE | `/api/bookings/:bid` | Eliminar reserva |
| POST | `/api/bookings/:bid/services/:sid` | Agregar servicio a una reserva |

Al crear o actualizar reservas, se verifica que los servicios referenciados existan. Al agregar un servicio ya asociado, se incrementa su cantidad.

## Ejemplos de creación

**POST `/api/services`**

```json
{
  "name": "Peinado",
  "description": "Servicio de peinado",
  "duration": 40,
  "price": 1100,
  "category": "peluqueria",
  "available": true
}
```

**POST `/api/bookings`**

```json
{
  "clientName": "Cliente Prueba",
  "clientEmail": "cliente@email.com",
  "date": "2026-11-10",
  "time": "10:00",
  "status": "pendiente",
  "services": []
}
```

## Manejo de errores

La API utiliza los siguientes códigos HTTP:

| Código | Descripción |
|---|---|
| 200 | Operación exitosa |
| 201 | Recurso creado |
| 400 | Datos o identificadores inválidos |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |

Las respuestas de error siguen el formato:

```json
{
  "error": "Servicio no encontrado"
}
```

## Pruebas

Los endpoints fueron probados mediante **Postman**, verificando operaciones CRUD, filtros, validaciones de ObjectId, referencias entre servicios y reservas y manejo de errores.

Los datos se almacenan en **MongoDB Atlas**, sin utilizar archivos JSON como sistema de persistencia.