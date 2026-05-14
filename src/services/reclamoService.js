import apiService from './apiService';

const reclamoService = {
    // Enviar reclamo
    enviarReclamo: async (idReserva, descripcion) => {
        return apiService.authPost('/reclamos/enviar', {
            idReserva,
            descripcion
        });
    },
    
    // Obtener reclamos por reserva
    obtenerReclamosPorReserva: async (idReserva) => {
        return apiService.authGet(`/reclamos/reserva/${idReserva}`);
    }
};

export default reclamoService;