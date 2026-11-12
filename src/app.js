
import express from "express";
import servicesRouter from "./routes/services.router.js";
import bookingsRouter from "./routes/bookings.router.js";
import viewsRouter from "./routes/views.router.js";
import errorHandler from "./middlewares/errorHandler.js";
import { engine } from "express-handlebars";
import path from "path";
import AppError from "./utils/AppError.js";


const app = express();
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.resolve("src/views"));
app.use(express.static(path.resolve("src/public")));

app.use(express.json());
app.use("/api/services", servicesRouter);
app.use("/api/bookings", bookingsRouter);
app.use("/views", viewsRouter);

// Manejar rutas inexistentes
app.use((req, res, next) => {
    next(new AppError("Ruta no encontrada", 404));
});

// Middleware global de errores
app.use(errorHandler);


export default app;







