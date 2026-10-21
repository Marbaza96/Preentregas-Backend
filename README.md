# API de Servicios y Reservas

API REST desarrollada con **Node.js y Express** para gestionar servicios y reservas de un sistema de turnos.

Implementa una arquitectura en capas y persistencia de datos mediante archivos JSON utilizando FileSystem (`fs/promises`).

## Instalación y ejecución

Instalar las dependencias:

```bash
npm install
```

Iniciar el servidor:

```bash
npm start
```

Ejecutar en modo desarrollo:

```bash
npm run dev
```

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto, tomando como referencia `.env.example`:

```env
PORT=8080
NODE_ENV=development
```

La configuración se gestiona desde `src/config/env.config.js` mediante `dotenv`. Si las variables no están definidas, se utilizan los valores predeterminados.

## Estructura del proyecto

```text
src/
├── config/
│   └── env.config.js
├── controllers/
│   ├── services.controller.js
│   └── bookings.controller.js
├── dao/
│   ├── services.dao.js
│   └── bookings.dao.js
├── data/
│   ├── services.json
│   └── bookings.json
├── middlewares/
│   └── errorHandler.js
├── repositories/
│   ├── services.repository.js
│   └── bookings.repository.js
├── routes/
│   ├── services.router.js
│   └── bookings.router.js
├── services/
│   ├── services.service.js
│   └── bookings.service.js
├── utils/
│   └── AppError.js
├── validators/
│   ├── services.validator.js
│   ├── bookings.validator.js
│   └── id.validator.js
├── app.js
└── server.js
```

## Arquitectura

El proyecto separa las responsabilidades mediante el siguiente flujo:

**Router → Controller → Service → Repository → DAO → JSON**

- **Routes:** definen los endpoints de la API.
- **Controllers:** reciben las solicitudes HTTP y gestionan las respuestas.
- **Services:** implementan la lógica de negocio y las validaciones.
- **Repositories:** conectan la lógica de negocio con la persistencia.
- **DAO:** realizan las operaciones de lectura y escritura en archivos JSON.

Se incluyen validadores para los datos recibidos y un middleware global para el manejo de errores.

## Recursos

**Services:** `id`, `name`, `description`, `duration`, `price`, `category`, `available`.

**Bookings:** `id`, `clientName`, `clientEmail`, `date`, `time`, `status`, `services`.

Los servicios asociados a una reserva se representan mediante un arreglo de objetos con las propiedades `service` (ID del servicio) y `quantity` (cantidad).

Los identificadores se generan automáticamente y las actualizaciones permiten modificar parcialmente los campos autorizados.

## Endpoints

### Services

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/services` | Listar servicios |
| GET | `/api/services/:id` | Obtener servicio por ID |
| POST | `/api/services` | Crear servicio |
| PUT | `/api/services/:id` | Actualizar servicio |
| DELETE | `/api/services/:id` | Eliminar servicio |

El endpoint GET admite filtros opcionales por `category` y `available`.

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

Al agregar un servicio a una reserva, se comprueba su existencia. Si ya está asociado, se incrementa su cantidad.

## Ejemplos de creación

### Crear un servicio

**POST** `/api/services`

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

### Crear una reserva

**POST** `/api/bookings`

```json
{
  "clientName": "Cliente Prueba",
  "clientEmail": "cliente@email.com",
  "date": "2026-10-25",
  "time": "10:00",
  "status": "pendiente",
  "services": []
}
```

## Códigos de estado HTTP

| Código | Descripción |
|---|---|
| 200 | Operación exitosa |
| 201 | Recurso creado |
| 400 | Datos inválidos |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |

Las respuestas de error utilizan el formato:

```json
{
  "error": "Servicio no encontrado"
}
```

## Pruebas

Los endpoints pueden probarse mediante **Postman**, utilizando como URL base:

```text
http://localhost:8080
```

La API permite consultar, crear, actualizar y eliminar recursos, filtrar servicios, asociarlos a reservas y comprobar las validaciones y el manejo de errores.

Los cambios realizados se almacenan en los archivos JSON correspondientes.