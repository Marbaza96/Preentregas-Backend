import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const servicesPath = path.join(__dirname, "../data/services.json");




class ServicesDAO {


    //Obtener todos los servicios
    async getAll() {
        try {
            const data = await fs.readFile(servicesPath, "utf-8");
            return JSON.parse(data);

        } catch (error) {
            if (error.code === "ENOENT") {
                await fs.writeFile(
                    servicesPath,
                    JSON.stringify([], null, 2)
                );
                return [];
            }

            throw error;
        }
    }

    //Obtener un servicio por su ID
    async getById(id) {
        const services = await this.getAll();
        return services.find((service) => service.id === id) || null;
    }

    // Guardar arreglo completo de servicios en el archivo JSON
    async saveAll(services) {
        await fs.writeFile(
            servicesPath,
            JSON.stringify(services, null, 2)
        );

        return services;
    }

    // Crear un nuevo servicio
    async create(service) {
        const services = await this.getAll();

        services.push(service);

        await this.saveAll(services);

        return service;
    }

    // Actualizar un servicio existente
    async update(id, updatedService) {
        const services = await this.getAll();

        const index = services.findIndex((service) => service.id === id);

        if (index === -1) {
            return null;
        }

        services[index] = {
            ...services[index],
            ...updatedService,
            id: services[index].id
        };

        await this.saveAll(services);

        return services[index];
    }

    // Eliminar un servicio por su ID
    async delete(id) {
        const services = await this.getAll();

        const serviceToDelete = services.find(
            (service) => service.id === id
        );

        if (!serviceToDelete) {
            return null;
        }

        const updatedServices = services.filter(
            (service) => service.id !== id
        );

        await this.saveAll(updatedServices);

        return serviceToDelete;
    }

}

export default ServicesDAO;