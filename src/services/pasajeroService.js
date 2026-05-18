import apiService from './apiService';

const pasajeroService = {
    // Obtener pasajero por email
    obtenerPasajeroPorEmail: async (email) => {
        return apiService.authGet(`/pasajeros/email/${email}`);
    }
};

export default pasajeroService;