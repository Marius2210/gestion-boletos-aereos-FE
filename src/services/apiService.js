// URL base del backend Spring Boot
const API_URL = '/api';

// Obtener token del localStorage
const getToken = () => localStorage.getItem('token');

// Peticiones GET autenticadas
const authGet = async (endpoint) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
        }
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.message || 'Error en la petición');
    }
    
    return response.json();
};

// Peticiones POST autenticadas
const authPost = async (endpoint, data) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.message || 'Error en la petición');
    }
    
    return response.json();
};

// Peticiones PUT autenticadas
const authPut = async (endpoint, data) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.message || 'Error en la petición');
    }
    
    return response.json();
};

// Peticiones DELETE autenticadas
const authDelete = async (endpoint) => {
    const response = await fetch(`${API_URL}${endpoint}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
        }
    });
    
    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.message || 'Error en la petición');
    }
    
    return response.json();
};

const apiService = {
    getToken,
    authGet,
    authPost,
    authPut,
    authDelete
};

export default apiService;