# API de Servicios y Reservas

Aplicación desarrollada con **Node.js, Express y MongoDB Atlas**, utilizando **Mongoose** para gestionar servicios y reservas de un sistema de turnos.

Implementa una API REST con arquitectura en capas, validaciones mediante **Zod** y manejo centralizado de errores. Incorpora vistas con **Handlebars** y comunicación en tiempo real mediante **Socket.IO**.

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

La aplicación se conecta a MongoDB antes de iniciar el servidor. Opcionalmente, puede configurarse `DNS_SERVER` si el entorno requiere un servidor DNS alternativo.

## Arquitectura

El proyecto organiza sus responsabilidades mediante el flujo:

**Routes → Controllers → Services → Repositories → DAO → Models**

- **Routes:** definen los endpoints y aplican validaciones de identificadores.
- **Controllers:** gestionan las solicitudes y respuestas HTTP.
- **Services:** implementan la lógica de negocio y ejecutan las validaciones.
- **Repositories:** establecen la interfaz entre servicios y DAO.
- **DAO:** realizan las operaciones de persistencia mediante Mongoose.
- **Models:** definen los esquemas de MongoDB.
- **Validators:** contienen los esquemas de validación con Zod.

Se incluyen middlewares para el manejo centralizado de errores, vistas Handlebars y eventos Socket.IO.

## Recursos

**Services:** `name`, `description`, `duration`, `price`, `category`, `available`.

**Bookings:** `clientName`, `clientEmail`, `date`, `time`, `status`, `services`.

Los estados permitidos para las reservas son:

- `pendiente`
- `confirmada`
- `cancelada`

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
| GET | `/api/services` | Listar servicios con filtros, paginación y ordenamiento |
| GET | `/api/services/:id` | Obtener servicio por ID |
| POST | `/api/services` | Crear servicio |
| PUT | `/api/services/:id` | Actualizar servicio |
| DELETE | `/api/services/:id` | Eliminar servicio |

#### Filtros, paginación y ordenamiento

El endpoint `GET /api/services` admite los siguientes parámetros opcionales:

| Parámetro | Descripción | Valor predeterminado |
|---|---|---|
| `category` | Filtrar por categoría | Sin filtro |
| `available` | Filtrar por disponibilidad (`true` o `false`) | Sin filtro |
| `page` | Número de página, entero positivo | `1` |
| `limit` | Resultados por página, entre 1 y 100 | `10` |
| `sortBy` | Campo de ordenamiento: `name`, `duration`, `price` o `category` | `price` |
| `order` | Orden ascendente (`asc`) o descendente (`desc`) | `asc` |

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

Este ejemplo representa una búsqueda sin resultados. Los metadatos se calculan dinámicamente según los filtros y los documentos disponibles.

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

Al agregar un servicio que ya está asociado a una reserva, se incrementa su propiedad `quantity`.

El endpoint `GET /api/bookings/:bid` utiliza **`populate()` de Mongoose** para devolver la información de los servicios asociados, además de sus cantidades.

## Validaciones con Zod

Se utilizan esquemas de **Zod** para validar los datos antes de realizar operaciones de escritura en MongoDB.

Las validaciones incluyen:

- Creación y actualización de servicios.
- Creación y actualización de reservas.
- Formato de correo electrónico, fecha y hora.
- Estados permitidos para las reservas.
- Identificadores de servicios asociados.
- Cantidades enteras positivas.
- Parámetros `bid` y `sid` al agregar servicios a una reserva.

Las actualizaciones parciales permiten modificar campos individuales, pero rechazan solicitudes sin campos válidos para actualizar.

Los datos inválidos generan respuestas HTTP `400` con mensajes descriptivos.

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
  "date": "2026-11-25",
  "time": "10:00",
  "status": "pendiente",
  "services": []
}
```

También es posible crear una reserva con servicios asociados:

```json
{
  "clientName": "Cliente Prueba",
  "clientEmail": "cliente@email.com",
  "date": "2026-11-25",
  "time": "10:00",
  "status": "pendiente",
  "services": [
    {
      "service": "REEMPLAZAR_POR_OBJECTID_VALIDO",
      "quantity": 2
    }
  ]
}
```

El identificador del ejemplo debe reemplazarse por el `_id` real de un servicio existente y disponible.

## Vistas con Handlebars

La aplicación incorpora vistas renderizadas desde el servidor utilizando datos de MongoDB.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/views/services` | Visualizar el catálogo de servicios |
| GET | `/views/availability` | Visualizar reservas y registrar nuevas reservas |

Las vistas reutilizan las capas existentes de la aplicación, sin consultas directas a la base de datos.

## Comunicación en tiempo real

Se utiliza **Socket.IO** para actualizar las vistas sin necesidad de recargar el navegador.

La aplicación permite:

- Actualizar el catálogo ante la creación, modificación o eliminación de servicios.
- Actualizar la lista de reservas al registrar una nueva reserva.
- Crear reservas desde la vista de disponibilidad mediante Socket.IO.
- Mostrar mensajes de error cuando una operación no supera las validaciones.

Cuando se crea una reserva mediante `POST /api/bookings`, el servidor emite el evento `bookingCreated`, que es recibido por los clientes conectados.

### Cómo probar la actualización en tiempo real

1. Iniciar el servidor con `npm run dev`.
2. Abrir `http://localhost:8080/views/availability` en el navegador.
3. En Postman, realizar una solicitud `POST` a `http://localhost:8080/api/bookings`, seleccionando **Body → raw → JSON**.
4. Enviar el siguiente cuerpo:

```json
{
  "clientName": "Prueba Tiempo Real",
  "clientEmail": "prueba@example.com",
  "date": "2026-11-25",
  "time": "14:30",
  "status": "pendiente",
  "services": []
}
```

5. Verificar que Postman devuelva `201 Created`.
6. Comprobar que la nueva reserva aparezca automáticamente en `/views/availability`, sin recargar la página.

Esta prueba demuestra la integración entre la API REST, MongoDB, Socket.IO y Handlebars.

## Manejo de errores

La API utiliza los siguientes códigos HTTP:

| Código | Descripción |
|---|---|
| 200 | Operación exitosa |
| 201 | Recurso creado |
| 400 | Datos, parámetros o identificadores inválidos |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |

Las respuestas de error siguen un formato unificado:

```json
{
  "error": "Servicio no encontrado"
}
```

Los errores de validación incluyen información sobre los campos inválidos.

## Pruebas

Los endpoints fueron probados mediante **Postman**, verificando:

- Operaciones CRUD de servicios y reservas.
- Filtros, paginación y ordenamiento.
- Metadatos y enlaces de navegación.
- Validaciones con Zod y respuestas HTTP `400`.
- Validación de identificadores MongoDB.
- Asociación de servicios con cantidades.
- Recuperación de reservas mediante `populate()`.
- Manejo de recursos inexistentes y servicios no disponibles.

También se verificaron las vistas con **Handlebars** y las actualizaciones en tiempo real mediante **Socket.IO**.

Los datos se almacenan en **MongoDB Atlas**, sin utilizar archivos JSON como sistema de persistencia.