# API de Servicios y Reservas

Aplicación desarrollada con **Node.js, Express y MongoDB Atlas**, utilizando **Mongoose** para gestionar servicios y reservas de un sistema de turnos.

Implementa una API REST con arquitectura en capas, validaciones y manejo centralizado de errores. Incorpora vistas renderizadas con **Handlebars** y comunicación en tiempo real mediante **Socket.IO**.

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

**Routes → Controllers → Services → Repositories → DAO → Models**

- **Routes:** definen los endpoints y validan los identificadores.
- **Controllers:** gestionan las solicitudes HTTP y renderizan las vistas.
- **Services:** implementan la lógica de negocio.
- **Repositories:** conectan los servicios con los DAO.
- **DAO:** realizan las operaciones de persistencia mediante Mongoose.
- **Models:** definen los esquemas de MongoDB.

Incluye validadores, middleware global de errores, vistas Handlebars y comunicación mediante Socket.IO, manteniendo la API REST existente.

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

## Vistas con Handlebars

La aplicación incorpora vistas renderizadas desde el servidor utilizando datos reales de MongoDB.

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/views/services` | Visualizar el catálogo de servicios |
| GET | `/views/availability` | Visualizar las reservas registradas |

Las vistas reutilizan las capas existentes de la aplicación, sin consultas directas a la base de datos.

## Comunicación en tiempo real

Se utiliza **Socket.IO** para actualizar automáticamente la vista de reservas cuando se registra una nueva reserva.

Al ejecutar `POST /api/bookings` y completar correctamente la creación, el servidor emite el evento `bookingCreated`.

El cliente escucha este evento mediante `public/js/socket.js` y agrega la nueva reserva a la vista `/views/availability` **sin necesidad de recargar la página**.

### Cómo probar la funcionalidad en tiempo real

1. Iniciar el servidor con `npm run dev`.
2. Abrir en el navegador `http://localhost:8080/views/availability` y mantener la página abierta.
3. En Postman, realizar una solicitud **POST** a `http://localhost:8080/api/bookings`, seleccionando **Body → raw → JSON**.
4. Enviar el siguiente cuerpo:

```json
{
  "clientName": "Prueba Tiempo Real",
  "clientEmail": "prueba@example.com",
  "date": "2026-11-25",
  "time": "14:30",
  "status": "pending",
  "services": []
}
```

5. Verificar que Postman devuelva **201 Created**.
6. Comprobar que la nueva reserva aparezca automáticamente en `/views/availability`, sin actualizar el navegador.

Esta prueba demuestra la comunicación entre la API REST, MongoDB, Socket.IO y la vista renderizada con Handlebars.

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
  "status": "pending",
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

También se verificó el renderizado de vistas con **Handlebars** y la actualización en tiempo real mediante **Socket.IO**, creando reservas desde Postman y comprobando su aparición automática en el navegador.

Los datos se almacenan en **MongoDB Atlas**, sin utilizar archivos JSON como sistema de persistencia.
