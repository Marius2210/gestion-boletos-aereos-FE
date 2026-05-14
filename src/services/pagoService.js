import apiService from './apiService';

const pagoService = {
    // Confirmar pago
    confirmarPago: async (idReserva, monto, metodoPago) => {
        return apiService.authPost('/pagos/confirmar', {
            idReserva,
            monto,
            metodoPago
        });
    },
    
    // Obtener pago por reserva
    obtenerPagoPorReserva: async (idReserva) => {
        return apiService.authGet(`/pagos/reserva/${idReserva}`);
    }
};

export default pagoService;