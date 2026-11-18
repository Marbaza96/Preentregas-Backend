# API de Servicios y Reservas

Aplicación desarrollada con **Node.js, Express y MongoDB Atlas**, utilizando **Mongoose** para gestionar servicios y reservas de un sistema de turnos.

Implementa una API REST con arquitectura en capas, validaciones mediante **Zod**, manejo centralizado de errores y prevención de reservas superpuestas. Incorpora vistas con **Handlebars** y comunicación en tiempo real mediante **Socket.IO**.

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

Reemplazar los valores de ejemplo por las credenciales y el clúster de MongoDB Atlas.

Ejecutar el proyecto:

```bash
npm start
```

Para desarrollo:

```bash
npm run dev
```

La aplicación se conecta a MongoDB e inicializa los índices de bloques horarios antes de iniciar el servidor.

Opcionalmente, puede configurarse `DNS_SERVER` si el entorno requiere un servidor DNS alternativo.

## Arquitectura

El proyecto organiza sus responsabilidades mediante el flujo:

**Routes → Controllers → Services → Repositories → DAO → Models**

- **Routes:** definen los endpoints y aplican validaciones de identificadores.
- **Controllers:** gestionan las solicitudes y respuestas HTTP.
- **Services:** implementan la lógica de negocio y las validaciones.
- **Repositories:** establecen la interfaz entre servicios y DAO.
- **DAO:** realizan las operaciones de persistencia mediante Mongoose.
- **Models:** definen los esquemas de MongoDB.
- **Validators:** contienen los esquemas de validación con Zod.

También se incluyen middlewares para el manejo centralizado de errores, vistas Handlebars y eventos Socket.IO.

## Recursos

**Services:** `name`, `description`, `duration`, `price`, `category`, `available`.

**Bookings:** `clientName`, `clientEmail`, `date`, `time`, `status`, `services`.

Los estados permitidos para las reservas son:

- `pendiente`
- `confirmada`
- `cancelada`

Cada elemento del arreglo `services` contiene:

```json
{
  "service": "ObjectId del servicio",
  "quantity": 1
}
```

MongoDB genera automáticamente los identificadores `_id` de los documentos.

El sistema utiliza además una colección de bloques horarios para controlar la disponibilidad de las reservas confirmadas.

## Endpoints

### Services

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/services` | Listar servicios con filtros, paginación y ordenamiento |
| GET | `/api/services/:id` | Obtener servicio por ID |
| POST | `/api/services` | Crear servicio |
| PUT | `/api/services/:id` | Actualizar servicio |
| DELETE | `/api/services/:id` | Eliminar servicio |

### Filtros, paginación y ordenamiento

El endpoint `GET /api/services` admite los siguientes parámetros opcionales:

| Parámetro | Descripción | Predeterminado |
|---|---|---|
| `category` | Filtrar por categoría | Sin filtro |
| `available` | Disponibilidad (`true` o `false`) | Sin filtro |
| `page` | Número de página, entero positivo | `1` |
| `limit` | Resultados por página, entre 1 y 100 | `10` |
| `sortBy` | `name`, `duration`, `price` o `category` | `price` |
| `order` | `asc` o `desc` | `asc` |

Ejemplo:

```http
GET http://localhost:8080/api/services?category=peluqueria&available=true&page=1&limit=5&sortBy=price&order=desc
```

La respuesta incluye los servicios encontrados y metadatos de paginación:

```json
{
  "status": "success",
  "payload": [],
  "totalDocs": 0,
  "totalPages": 0,
  "page": 1,
  "limit": 5,
  "hasPrevPage": false,
  "hasNextPage": false,
  "prevPage": null,
  "nextPage": null,
  "prevLink": null,
  "nextLink": null
}
```

Este ejemplo representa una búsqueda sin resultados. Los metadatos se calculan dinámicamente según los filtros y documentos disponibles.

Los parámetros inválidos generan una respuesta HTTP `400`.

### Bookings

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/bookings` | Listar reservas |
| GET | `/api/bookings/:bid` | Obtener reserva por ID |
| POST | `/api/bookings` | Crear reserva |
| PUT | `/api/bookings/:bid` | Actualizar reserva |
| DELETE | `/api/bookings/:bid` | Eliminar reserva |
| POST | `/api/bookings/:bid/services/:sid` | Agregar servicio a una reserva |

Al crear o actualizar reservas, se verifica que los servicios referenciados existan y estén disponibles.

Si se agrega un servicio que ya está asociado a una reserva, se incrementa su propiedad `quantity`.

Las consultas de reservas utilizan **`populate()` de Mongoose** para recuperar la información de los servicios asociados y sus cantidades.

## Validaciones con Zod

Se utilizan esquemas de **Zod** para validar los datos antes de realizar operaciones de escritura en MongoDB.

Las validaciones incluyen:

- Creación y actualización de servicios y reservas.
- Campos obligatorios y tipos de datos.
- Formato de correo electrónico, fecha y hora.
- Estados permitidos para las reservas.
- Identificadores de servicios asociados.
- Cantidades enteras positivas.
- Validación de identificadores en los endpoints.

Las actualizaciones parciales permiten modificar campos individuales, pero rechazan solicitudes sin campos válidos.

Los datos inválidos generan respuestas HTTP `400` con mensajes descriptivos.

## Control de disponibilidad y prevención de overbooking

El sistema incorpora un mecanismo para evitar reservas confirmadas en horarios superpuestos.

Su funcionamiento incluye:

- Cálculo de la duración total según los servicios asociados y sus cantidades.
- División del intervalo ocupado en bloques de 5 minutos.
- Verificación de disponibilidad antes de confirmar una reserva.
- Transacciones de MongoDB para mantener la consistencia entre reservas y bloques horarios.
- Índice único compuesto por fecha y hora para evitar conflictos ante solicitudes simultáneas.
- Actualización o liberación de bloques al modificar, cancelar o eliminar reservas.

Las reservas **pendientes y canceladas no bloquean horarios**.

Cuando una reserva confirmada se superpone con otra, el sistema rechaza la operación con HTTP `409 Conflict`.

Además, se protege la integridad de los servicios:

- No se permite modificar la duración de un servicio con reservas confirmadas.
- No se permite eliminar servicios asociados a reservas existentes.

Este mecanismo fue verificado mediante pruebas de superposición y solicitudes concurrentes.

## Ejemplos de creación

### POST `/api/services`

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

### POST `/api/bookings`

```json
{
  "clientName": "Cliente Prueba",
  "clientEmail": "cliente@email.com",
  "date": "2027-03-25",
  "time": "10:00",
  "status": "pendiente",
  "services": []
}
```

Ejemplo de reserva confirmada con un servicio asociado:

```json
{
  "clientName": "Cliente Prueba",
  "clientEmail": "cliente@email.com",
  "date": "2027-03-25",
  "time": "11:00",
  "status": "confirmada",
  "services": [
    {
      "service": "REEMPLAZAR_POR_OBJECTID_VALIDO",
      "quantity": 1
    }
  ]
}
```

El identificador debe reemplazarse por el `_id` real de un servicio existente y disponible.

Las reservas confirmadas requieren al menos un servicio asociado y un horario disponible.

## Vistas con Handlebars

La aplicación incorpora vistas renderizadas desde el servidor utilizando datos de MongoDB.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/views/services` | Visualizar el catálogo de servicios |
| GET | `/views/availability` | Visualizar y crear reservas |

La vista de reservas incluye un formulario con datos del cliente, fecha, hora, estado, servicio y cantidad.

Las vistas reutilizan las capas existentes de la aplicación, sin realizar consultas directas a la base de datos.

## Comunicación en tiempo real

Se utiliza **Socket.IO** para mantener actualizadas las vistas sin recargar el navegador.

### Eventos de reservas

| Evento | Función |
|---|---|
| `createBooking` | Recibir una solicitud de creación desde el formulario |
| `bookingCreated` | Notificar una nueva reserva |
| `bookingUpdated` | Notificar la actualización de una reserva |
| `bookingDeleted` | Notificar la eliminación de una reserva |

### Eventos de servicios

| Evento | Función |
|---|---|
| `serviceCreated` | Incorporar un servicio al catálogo |
| `service