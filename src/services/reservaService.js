import apiService from './apiService';

const reservaService = {
    // Crear reserva
    crearReserva: async (idVuelo, idPasajero, asientoPreferencia, idTarifa) => {
        return apiService.authPost('/reservas/crear', {
            idVuelo,
            idPasajero,
            asientoPreferencia,
            idTarifa
        });
    },
    
    // Obtener reserva por código
    obtenerReserva: async (codigoReserva) => {
        return apiService.authGet(`/reservas/${codigoReserva}`);
    },
    
    // Cancelar reserva
    cancelarReserva: async (codigoReserva) => {
        return apiService.authPut(`/reservas/cancelar/${codigoReserva}`);
    }
};

export default reservaService;