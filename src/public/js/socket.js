const socket = io();

socket.on("connect", () => {
    console.log("Conectado a Socket.IO:", socket.id);
});

socket.on("disconnect", () => {
    console.log("Desconectado de Socket.IO");
});

socket.on("bookingCreated", (booking) => {
    console.log("Nueva reserva creada:", booking);

    const bookingsList = document.getElementById("bookings-list");

    if (!bookingsList) return;

    // Evitar agregar una reserva que ya aparece en el listado
    const bookingId = String(booking._id);

    const bookingExists = Array.from(
        bookingsList.querySelectorAll("[data-booking-id]")
    ).some((element) => element.dataset.bookingId === bookingId);

    if (bookingExists) return;

    // Eliminar el mensaje de lista vacía cuando llega una reserva
    const emptyMessage = document.getElementById("empty-message");

    if (emptyMessage) {
        emptyMessage.remove();
    }

    const article = document.createElement("article");

    article.dataset.bookingId = bookingId;

    const title = document.createElement("h3");
    title.textContent = `Reserva de ${booking.clientName}`;

    const date = document.createElement("p");
    date.textContent = `Fecha: ${booking.date}`;

    const time = document.createElement("p");
    time.textContent = `Hora: ${booking.time}`;

    const status = document.createElement("p");
    status.textContent = `Estado: ${booking.status}`;

    const services = document.createElement("p");
    services.textContent =
        `Servicios asociados: ${booking.services.length}`;

    article.append(title, date, time, status, services);

    bookingsList.append(article, document.createElement("hr"));
});


const bookingForm = document.getElementById("booking-form");
const bookingMessage = document.getElementById("booking-message");

if (bookingForm) {
    bookingForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(bookingForm);

        const serviceId = formData.get("service");
        const quantity = Number(formData.get("quantity"));

        const selectedServices = serviceId
            ? [{ service: serviceId, quantity }]
            : [];

        const bookingData = {
            clientName: formData.get("clientName").trim(),
            clientEmail: formData.get("clientEmail").trim(),
            date: formData.get("date"),
            time: formData.get("time"),
            status: formData.get("status"),
            services: selectedServices
        };

        bookingMessage.textContent = "Creando reserva...";

        socket.timeout(5000).emit(
            "createBooking",
            bookingData,
            (error, response) => {
                if (error) {
                    bookingMessage.textContent =
                        "No se recibió respuesta del servidor. Verificá la conexión.";
                    return;
                }

                if (response?.status === "success") {
                    bookingMessage.textContent =
                        "Reserva creada correctamente.";

                    bookingForm.reset();
                } else {
                    bookingMessage.textContent =
                        response?.message || "No se pudo crear la reserva.";
                }
            }
        );
    });
}


// Mantener actualizado el selector de servicios
const serviceSelect = document.getElementById("service");

// Buscar una opción por el ID del servicio
const findServiceOption = (serviceId) => {
    return Array.from(serviceSelect.options).find(
        (option) => option.value === String(serviceId)
    );
};

// Agregar o actualizar un servicio disponible
const syncServiceOption = (service) => {
    const existingOption = findServiceOption(service._id);

    // Quitar servicios que ya no están disponibles
    if (!service.available) {
        existingOption?.remove();
        return;
    }

    // Actualizar el nombre si el servicio ya existe
    if (existingOption) {
        existingOption.textContent = service.name;
        return;
    }

    // Incorporar un nuevo servicio disponible
    const option = document.createElement("option");
    option.value = String(service._id);
    option.textContent = service.name;

    serviceSelect.appendChild(option);
};

// Eliminar un servicio del selector
const removeServiceOption = (service) => {
    const existingOption = findServiceOption(service._id);

    existingOption?.remove();
};

// Escuchar los cambios del catálogo
if (serviceSelect) {
    socket.on("serviceCreated", syncServiceOption);
    socket.on("serviceUpdated", syncServiceOption);
    socket.on("serviceDeleted", removeServiceOption);
}

