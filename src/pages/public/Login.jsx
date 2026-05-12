import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { validateLogin } from '../../utils/validations';
import '../../styles/Login.css';

// Versión sin react-router-dom
const Login = () => {
    // Estados del formulario
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState(null);

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (serverError) setServerError('');
    };

    // Manejar envío del formulario con fetch
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const validationErrors = validateLogin(formData.email, formData.password);
        if (Object.keys(validationErrors).length > 0) {
            setErrors(validationErrors);
            return;
        }
        
        setIsLoading(true);
        setServerError('');
        
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ 
                    email: formData.email, 
                    password: formData.password 
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Error al iniciar sesión');
            }

            // Guardar token
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify({ 
                email: data.email, 
                rol: data.rol 
            }));

            setUserData(data);
            setIsLoggedIn(true);
            
        } catch (error) {
            setServerError(error.message || 'Error de conexión');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setIsLoggedIn(false);
        setUserData(null);
        setFormData({ email: '', password: '' });
    };

    // Si ya inició sesión, mostrar bienvenida
    if (isLoggedIn) {
        return (
            <div className="login-container">
                <div className="login-card">
                    <div className="login-header">
                        <h1> Sistema de Boletos Aéreos</h1>
                        <h2>¡Bienvenido!</h2>
                    </div>
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <p><strong>Email:</strong> {userData?.email}</p>
                        <p><strong>Rol:</strong> {userData?.rol === 'ADMIN' ? 'Administrador' : 'Usuario'}</p>
                        <button onClick={handleLogout} className="btn-login">
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1> Sistema de Boletos Aéreos</h1>
                    <h2>Iniciar Sesión</h2>
                </div>

                {serverError && (
                    <div className="alert alert-error">
                        {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="ejemplo@correo.com"
                            className={errors.email ? 'error' : ''}
                            disabled={isLoading}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Contraseña</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="******"
                            className={errors.password ? 'error' : ''}
                            disabled={isLoading}
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>

                    <button type="submit" className="btn-login" disabled={isLoading}>
                        {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                    </button>
                </form>

                <div className="login-footer">
                <p>
               ¿No tienes cuenta?{' '}
               <Link to="/registro" className="link-registro">
                Regístrate aquí
               </Link>
             </p>
           </div>           
            </div>
        </div>
    );
};

export default Login;