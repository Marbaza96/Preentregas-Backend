# API de Servicios y Reservas

Proyecto desarrollado en Node.js para gestionar servicios y reservas de un sistema de turnos mediante una API REST con Express.

La aplicación utiliza una arquitectura organizada en rutas, controladores y managers, separando las responsabilidades de cada componente. Los datos se almacenan en archivos JSON mediante FileSystem, permitiendo realizar operaciones de consulta, creación, actualización y eliminación de servicios y reservas.

## Instalación

Clonar el repositorio e instalar las dependencias:

```bash
npm install
```

## Ejecución

Para ejecutar el proyecto:

```bash
npm start
```

Para ejecutar el proyecto en modo desarrollo:

```bash
npm run dev
```

El servidor se ejecuta en el puerto configurado en las variables de entorno.

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto tomando como referencia `.env.example`.

```env
PORT=8080
NODE_ENV=development
```

Las variables utilizadas son:

- `PORT`: puerto en el que se ejecuta el servidor.
- `NODE_ENV`: entorno de ejecución de la aplicación.

La configuración se administra desde `src/config/env.config.js`, utilizando dotenv.

## Estructura del proyecto

```text
src/
├── config/
│   └── env.config.js
├── controllers/
│   ├── services.controller.js
│   └── bookings.controller.js
├── data/
│   ├── services.json
│   └── bookings.json
├── managers/
│   ├── ServiceManager.js
│   └── BookingManager.js
├── routes/
│   ├── services.router.js
│   └── bookings.router.js
├── app.js
└── server.js

.env
.env.example
.gitignore
package.json
package-lock.json
README.md
```

## Arquitectura de la aplicación

El proyecto organiza sus funcionalidades en diferentes componentes para separar responsabilidades y facilitar el mantenimiento del código.

### Routes

Los archivos de rutas definen los endpoints disponibles y relacionan cada petición HTTP con su controlador correspondiente.

- `services.router.js`: rutas para gestionar servicios.
- `bookings.router.js`: rutas para gestionar reservas.

### Controllers

Los controladores reciben las peticiones HTTP, procesan los parámetros necesarios, llaman a los métodos de los managers y devuelven las respuestas correspondientes.

También administran los códigos de estado HTTP y el manejo de errores.

- `services.controller.js`: controlador de servicios.
- `bookings.controller.js`: controlador de reservas.

### Managers

Los managers contienen la lógica de gestión de los recursos y las operaciones necesarias para trabajar con los datos almacenados.

- `ServiceManager.js`: gestión de servicios.
- `BookingManager.js`: gestión de reservas.

### Persistencia de datos

La aplicación utiliza archivos JSON para almacenar la información.

- `services.json`: almacena los servicios.
- `bookings.json`: almacena las reservas.

Las operaciones de lectura y escritura se realizan mediante FileSystem utilizando métodos asíncronos.

### Configuración del servidor

- `app.js`: configura Express, el middleware para procesar JSON y las rutas de la API.
- `server.js`: inicia el servidor utilizando el puerto configurado.
- `env.config.js`: carga y valida las variables de entorno.

## Recursos

### Services

Cada servicio representa una prestación disponible dentro del sistema de turnos y reservas.

Cada servicio contiene las siguientes propiedades:

- `id`: identificador único.
- `name`: nombre del servicio.
- `description`: descripción del servicio.
- `duration`: duración del servicio.
- `price`: precio del servicio.
- `category`: categoría a la que pertenece.
- `available`: disponibilidad del servicio.

### Bookings

Cada reserva representa un turno registrado dentro del sistema.

Cada reserva contiene las siguientes propiedades:

- `id`: identificador único.
- `clientName`: nombre del cliente.
- `clientEmail`: correo electrónico del cliente.
- `date`: fecha de la reserva.
- `time`: horario de la reserva.
- `status`: estado de la reserva.
- `services`: servicios asociados a la reserva.

Los servicios asociados se almacenan mediante su ID y cantidad:

```json
{
    "service": 1,
    "quantity": 1
}
```

## API REST

### Services

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/services` | Obtener todos los servicios |
| GET | `/api/services/:id` | Obtener un servicio por ID |
| POST | `/api/services` | Crear un servicio |
| PUT | `/api/services/:id` | Actualizar un servicio |
| DELETE | `/api/services/:id` | Eliminar un servicio |

El listado de servicios permite aplicar filtros opcionales mediante los query params `category` y `available`.

### Ejemplos de peticiones HTTP - Services

**Obtener todos los servicios:**

```http
GET http://localhost:8080/api/services
```

**Obtener un servicio por ID:**

```http
GET http://localhost:8080/api/services/1
```

**Obtener servicios filtrados:**

```http
GET http://localhost:8080/api/services?category=peluqueria&available=true
```

**Crear un servicio:**

```http
POST http://localhost:8080/api/services
Content-Type: application/json

{
    "name": "Peinado",
    "description": "Servicio de peinado",
    "duration": 30,
    "price": 1100,
    "category": "peluqueria",
    "available": true
}
```

**Actualizar un servicio:**

```http
PUT http://localhost:8080/api/services/1
Content-Type: application/json

{
    "price": 1200,
    "available": false
}
```

**Eliminar un servicio:**

```http
DELETE http://localhost:8080/api/services/1
```

### Bookings

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/bookings` | Obtener todas las reservas |
| GET | `/api/bookings/:bid` | Obtener una reserva por ID |
| POST | `/api/bookings` | Crear una reserva |
| PUT | `/api/bookings/:id` | Actualizar una reserva |
| POST | `/api/bookings/:bid/services/:sid` | Agregar un servicio a una reserva |
| DELETE | `/api/bookings/:id` | Eliminar una reserva |

### Ejemplos de peticiones HTTP - Bookings

**Obtener todas las reservas:**

```http
GET http://localhost:8080/api/bookings
```

**Obtener una reserva por ID:**

```http
GET http://localhost:8080/api/bookings/1
```

**Crear una reserva:**

```http
POST http://localhost:8080/api/bookings
Content-Type: application/json

{
    "clientName": "Cliente Prueba",
    "clientEmail": "cliente@email.com",
    "date": "2026-10-15",
    "time": "10:00",
    "status": "pendiente"
}
```

**Agregar un servicio a una reserva:**

```http
POST http://localhost:8080/api/bookings/1/services/1
```

**Actualizar una reserva:**

```http
PUT http://localhost:8080/api/bookings/1
Content-Type: application/json

{
    "time": "14:30",
    "status": "confirmada"
}
```

**Eliminar una reserva:**

```http
DELETE http://localhost:8080/api/bookings/1
```

## Códigos de estado HTTP

La API utiliza códigos de estado HTTP para indicar el resultado de las operaciones.

| Código | Descripción |
|---|---|
| 200 | Operación realizada correctamente |
| 201 | Recurso creado correctamente |
| 400 | Datos inválidos o solicitud incorrecta |
| 404 | Recurso no encontrado |
| 500 | Error interno del servidor |

Los errores se devuelven mediante respuestas JSON con un mensaje descriptivo.

Ejemplo:

```json
{
    "error": "Servicio no encontrado"
}
```

## Pruebas de la API

Los endpoints pueden probarse utilizando Postman o cualquier cliente HTTP compatible.

Para realizar las pruebas:

1. Iniciar el servidor con `npm run dev`.
2. Seleccionar el método HTTP correspondiente.
3. Ingresar la URL del endpoint.
4. Cuando corresponda, enviar los datos en formato JSON.
5. Verificar el código de estado y la respuesta obtenida.

Las operaciones realizadas se reflejan en los archivos JSON utilizados para la persistencia de datos.