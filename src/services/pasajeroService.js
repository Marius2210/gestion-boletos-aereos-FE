import apiService from './apiService';

const pasajeroService = {
    // Obtener pasajero por email (asumiendo que tienes este endpoint)
    obtenerPasajeroPorEmail: async (email) => {
        // Si no tienes este endpoint, puedes obtenerlo del usuario logueado
        return apiService.authGet(`/pasajeros/email/${email}`);
    }
};

export default pasajeroService;