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

    // Eliminar el mensaje de lista vacía cuando llega una reserva
    const emptyMessage = document.getElementById("empty-message");

    if (emptyMessage) {
        emptyMessage.remove();
    }

    const article = document.createElement("article");

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