import apiService from './apiService';

const vueloService = {
    // Buscar vuelos disponibles
    buscarVuelos: async (origen, destino, fechaSalida) => {
        return apiService.authPost('/vuelos/disponibles', {
            origen,
            destino,
            fechaSalida: `${fechaSalida}T08:00:00`
        });
    },
    
    // Obtener mapa de asientos del vuelo
    obtenerMapaAsientos: async (idVuelo) => {
        return apiService.authGet(`/vuelos/${idVuelo}/asientos/mapa`);
    },
    
    // Obtener asientos disponibles por tipo
    obtenerAsientosDisponibles: async (idVuelo, tipo = null) => {
        const url = tipo 
            ? `/vuelos/${idVuelo}/asientos/disponibles?tipo=${tipo}`
            : `/vuelos/${idVuelo}/asientos/disponibles`;
        return apiService.authGet(url);
    }
};

export default vueloService;