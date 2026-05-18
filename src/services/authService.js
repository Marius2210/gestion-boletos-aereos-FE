// URL base del backend Spring Boot
const API_URL = 'http://localhost:8080/api';

const authService = {
    // Login usando fetch nativo
    login: async (email, password) => {
        try {
            const response = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al iniciar sesión');
            }

            // Guardar token y datos en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({ 
                email: data.email, 
                rol: data.rol ,
                idPasajero: data.idPasajero,
               nombrePasajero: data.nombrePasajero
            }));

            return { success: true, data };
        } catch (error) {
            return { 
                success: false, 
                error: error.message || 'Error de conexión con el servidor'
            };
        }
    },
    
    // Logout
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
    },
    
    // Obtener usuario actual
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },
    
    // Verificar si está autenticado
    isAuthenticated: () => {
        return localStorage.getItem('token') !== null;
    },
    
    // Verificar si es ADMIN
    isAdmin: () => {
        const user = authService.getCurrentUser();
        return user?.rol === 'ADMIN';
    },
    
    // Obtener token
    getToken: () => {
        return localStorage.getItem('token');
    }
};

export default authService;