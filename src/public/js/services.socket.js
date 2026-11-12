
const socket = io();

const servicesList = document.getElementById("services-list");

// Buscar un servicio existente por su ID
const findService = (id) => {
    return Array.from(
        servicesList.querySelectorAll("[data-service-id]")
    ).find((article) => article.dataset.serviceId === String(id));
};

// Crear el elemento HTML de un servicio
const createServiceElement = (service) => {
    const article = document.createElement("article");
    article.dataset.serviceId = String(service._id);

    const fields = [
        ["h3", service.name],
        ["p", `Descripción: ${service.description}`],
        ["p", `Duración: ${service.duration} minutos`],
        ["p", `Precio: $${service.price}`],
        ["p", `Categoría: ${service.category}`],
        ["p", `Disponible: ${service.available ? "Sí" : "No"}`]
    ];

    fields.forEach(([tag, content]) => {
        const element = document.createElement(tag);
        element.textContent = content;
        article.appendChild(element);
    });

    return article;
};

// Mostrar el mensaje cuando no hay servicios
const updateEmptyMessage = () => {
    const hasServices = servicesList.querySelector("[data-service-id]");
    const emptyMessage = document.getElementById("services-empty-message");

    if (!hasServices && !emptyMessage) {
        const message = document.createElement("p");
        message.id = "services-empty-message";
        message.textContent = "No hay servicios registrados.";
        servicesList.appendChild(message);
    }

    if (hasServices && emptyMessage) {
        emptyMessage.remove();
    }
};

// Crear un servicio en el listado
socket.on("serviceCreated", (service) => {
    if (findService(service._id)) return;

    servicesList.appendChild(createServiceElement(service));
    servicesList.appendChild(document.createElement("hr"));

    updateEmptyMessage();
});

// Actualizar un servicio existente
socket.on("serviceUpdated", (service) => {
    const existingService = findService(service._id);

    if (!existingService) return;

    const updatedService = createServiceElement(service);
    existingService.replaceWith(updatedService);

    updateEmptyMessage();
});

// Eliminar un servicio del listado
socket.on("serviceDeleted", (service) => {
    const existingService = findService(service._id);

    if (!existingService) return;

    const separator = existingService.nextElementSibling;

    if (separator?.tagName === "HR") {
        separator.remove();
    }

    existingService.remove();

    updateEmptyMessage();
});
