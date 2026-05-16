// services/adminService.js
import apiService from './apiService';

const adminService = {
    // ==================== ESTADÍSTICAS ====================
    
    /**
     * Obtener estadísticas del sistema
     * @returns {Promise} Estadísticas generales
     */
    getEstadisticas: async () => {
        return apiService.authGet('/admin/estadisticas');
    },

    // ==================== GESTIÓN DE USUARIOS ====================
    
    /**
     * Listar todos los usuarios
     * @returns {Promise} Lista de usuarios
     */
    listarUsuarios: async () => {
        return apiService.authGet('/admin/usuarios');
    },
    
    /**
     * Obtener usuario por ID
     * @param {number} id - ID del usuario
     * @returns {Promise} Datos del usuario
     */
    obtenerUsuario: async (id) => {
        return apiService.authGet(`/admin/usuarios/${id}`);
    },
    
    /**
     * Activar/Desactivar usuario
     * @param {number} id - ID del usuario
     * @returns {Promise} Usuario actualizado
     */
    toggleUsuarioEstado: async (id) => {
        return apiService.authPut(`/admin/usuarios/${id}/estado`);
    },
    
    /**
     * Eliminar usuario por ID
     * @param {number} id - ID del usuario
     * @returns {Promise} Mensaje de confirmación
     */
    eliminarUsuario: async (id) => {
        return apiService.authDelete(`/admin/usuarios/${id}`);
    },
    
    /**
     * Eliminar usuario por email
     * @param {string} email - Email del usuario
     * @returns {Promise} Mensaje de confirmación
     */
    eliminarUsuarioPorEmail: async (email) => {
        return apiService.authDelete(`/admin/usuarios/email/${email}`);
    },

    // ==================== GESTIÓN DE AEROLÍNEAS ====================
    
    /**
     * Listar todas las aerolíneas
     * @returns {Promise} Lista de aerolíneas
     */
    listarAerolineas: async () => {
        return apiService.authGet('/admin/aerolineas');
    },
    
    /**
     * Obtener aerolínea por ID
     * @param {number} id - ID de la aerolínea
     * @returns {Promise} Datos de la aerolínea
     */
    obtenerAerolinea: async (id) => {
        return apiService.authGet(`/admin/aerolineas/${id}`);
    },
    
    /**
     * Crear nueva aerolínea
     * @param {Object} data - Datos de la aerolínea { nombreAerolinea, codigoIata }
     * @returns {Promise} Aerolínea creada
     */
    crearAerolinea: async (data) => {
        return apiService.authPost('/admin/aerolineas', data);
    },
    
    /**
     * Actualizar aerolínea
     * @param {number} id - ID de la aerolínea
     * @param {Object} data - Datos actualizados
     * @returns {Promise} Aerolínea actualizada
     */
    actualizarAerolinea: async (id, data) => {
        return apiService.authPut(`/admin/aerolineas/${id}`, data);
    },
    
    /**
     * Eliminar aerolínea por ID
     * @param {number} id - ID de la aerolínea
     * @returns {Promise} Mensaje de confirmación
     */
    eliminarAerolinea: async (id) => {
        return apiService.authDelete(`/admin/aerolineas/${id}`);
    },
    
    /**
     * Eliminar aerolínea por código IATA
     * @param {string} codigoIata - Código IATA de la aerolínea
     * @returns {Promise} Mensaje de confirmación
     */
    eliminarAerolineaPorCodigo: async (codigoIata) => {
        return apiService.authDelete(`/admin/aerolineas/codigo/${codigoIata}`);
    },

    // ==================== GESTIÓN DE AVIONES ====================
    
    /**
     * Listar todos los aviones
     * @returns {Promise} Lista de aviones
     */
    listarAviones: async () => {
        return apiService.authGet('/admin/aviones');
    },
    
    /**
     * Listar aviones por aerolínea
     * @param {number} idAerolinea - ID de la aerolínea
     * @returns {Promise} Lista de aviones de la aerolínea
     */
    listarAvionesPorAerolinea: async (idAerolinea) => {
        return apiService.authGet(`/admin/aviones/aerolinea/${idAerolinea}`);
    },
    
    /**
     * Obtener avión por ID
     * @param {number} id - ID del avión
     * @returns {Promise} Datos del avión
     */
    obtenerAvion: async (id) => {
        return apiService.authGet(`/admin/aviones/${id}`);
    },
    
    /**
     * Obtener estadísticas del avión
     * @param {number} id - ID del avión
     * @returns {Promise} Estadísticas del avión
     */
    obtenerEstadisticasAvion: async (id) => {
        return apiService.authGet(`/admin/aviones/${id}/estadisticas`);
    },
    
    /**
     * Crear nuevo avión
     * @param {Object} data - Datos del avión { modelo, capacidad, idAerolinea }
     * @returns {Promise} Avión creado
     */
    crearAvion: async (data) => {
        return apiService.authPost('/admin/aviones', data);
    },
    
    /**
     * Actualizar avión
     * @param {number} id - ID del avión
     * @param {Object} data - Datos actualizados
     * @returns {Promise} Avión actualizado
     */
    actualizarAvion: async (id, data) => {
        return apiService.authPut(`/admin/aviones/${id}`, data);
    },
    
    /**
     * Eliminar avión
     * @param {number} id - ID del avión
     * @returns {Promise} Mensaje de confirmación
     */
    eliminarAvion: async (id) => {
        return apiService.authDelete(`/admin/aviones/${id}`);
    },

    // ==================== GESTIÓN DE VUELOS ====================
    
    /**
     * Listar todos los vuelos
     * @returns {Promise} Lista de vuelos
     */
    listarVuelos: async () => {
        return apiService.authGet('/admin/vuelos');
    },
    
    /**
     * Obtener vuelo por ID
     * @param {number} id - ID del vuelo
     * @returns {Promise} Datos del vuelo
     */
    obtenerVuelo: async (id) => {
        return apiService.authGet(`/admin/vuelos/${id}`);
    },
    
    /**
     * Obtener vuelo por número
     * @param {string} numeroVuelo - Número del vuelo
     * @returns {Promise} Datos del vuelo
     */
    obtenerVueloPorNumero: async (numeroVuelo) => {
        return apiService.authGet(`/admin/vuelos/numero/${numeroVuelo}`);
    },
    
    /**
     * Crear nuevo vuelo
     * @param {Object} data - Datos del vuelo
     * @returns {Promise} Vuelo creado
     */
    crearVuelo: async (data) => {
        return apiService.authPost('/admin/vuelos', data);
    },
    
    /**
     * Actualizar vuelo
     * @param {number} id - ID del vuelo
     * @param {Object} data - Datos actualizados
     * @returns {Promise} Vuelo actualizado
     */
    actualizarVuelo: async (id, data) => {
        return apiService.authPut(`/admin/vuelos/${id}`, data);
    },
    
    /**
     * Eliminar vuelo
     * @param {number} id - ID del vuelo
     * @returns {Promise} Mensaje de confirmación
     */
    eliminarVuelo: async (id) => {
        return apiService.authDelete(`/admin/vuelos/${id}`);
    },
    
    /**
     * Cambiar estado del vuelo
     * @param {number} id - ID del vuelo
     * @param {string} estado - Estado (P, V, A, C)
     * @returns {Promise} Vuelo actualizado
     */
    cambiarEstadoVuelo: async (id, estado) => {
        return apiService.authPut(`/admin/vuelos/${id}/estado?estado=${estado}`);
    },
    
    /**
     * Agregar tarifa a un vuelo
     * @param {number} idVuelo - ID del vuelo
     * @param {Object} data - Datos de la tarifa { clase, precio }
     * @returns {Promise} Tarifa creada
     */
    agregarTarifa: async (idVuelo, data) => {
        return apiService.authPost(`/admin/vuelos/${idVuelo}/tarifas`, data);
    },

    // ==================== GESTIÓN DE TRIPULACIÓN ====================
    
    /**
     * Listar todos los tripulantes
     * @returns {Promise} Lista de tripulantes
     */
    listarTripulantes: async () => {
        return apiService.authGet('/admin/tripulacion');
    },
    
    /**
     * Listar tripulantes por aerolínea
     * @param {number} idAerolinea - ID de la aerolínea
     * @returns {Promise} Lista de tripulantes de la aerolínea
     */
    listarTripulantesPorAerolinea: async (idAerolinea) => {
        return apiService.authGet(`/admin/tripulacion/aerolinea/${idAerolinea}`);
    },
    
    /**
     * Listar tripulantes por cargo
     * @param {string} cargo - Cargo del tripulante
     * @returns {Promise} Lista de tripulantes por cargo
     */
    listarTripulantesPorCargo: async (cargo) => {
        return apiService.authGet(`/admin/tripulacion/cargo/${cargo}`);
    },
    
    /**
     * Obtener tripulante por ID
     * @param {number} id - ID del tripulante
     * @returns {Promise} Datos del tripulante
     */
    obtenerTripulante: async (id) => {
        return apiService.authGet(`/admin/tripulacion/${id}`);
    },
    
    /**
     * Obtener estadísticas del tripulante
     * @param {number} id - ID del tripulante
     * @returns {Promise} Estadísticas del tripulante
     */
    obtenerEstadisticasTripulante: async (id) => {
        return apiService.authGet(`/admin/tripulacion/${id}/estadisticas`);
    },
    
    /**
     * Crear nuevo tripulante
     * @param {Object} data - Datos del tripulante { nombre, cargo, idAerolinea }
     * @returns {Promise} Tripulante creado
     */
    crearTripulante: async (data) => {
        return apiService.authPost('/admin/tripulacion', data);
    },
    
    /**
     * Actualizar tripulante
     * @param {number} id - ID del tripulante
     * @param {Object} data - Datos actualizados
     * @returns {Promise} Tripulante actualizado
     */
    actualizarTripulante: async (id, data) => {
        return apiService.authPut(`/admin/tripulacion/${id}`, data);
    },
    
    /**
     * Eliminar tripulante
     * @param {number} id - ID del tripulante
     * @returns {Promise} Mensaje de confirmación
     */
    eliminarTripulante: async (id) => {
        return apiService.authDelete(`/admin/tripulacion/${id}`);
    }
};

export default adminService;