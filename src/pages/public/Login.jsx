import { Link, useNavigate } from 'react-router-dom'; // Importamos useNavigate
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext'; // Importamos tu contexto
import { validateLogin } from '../../utils/validations';
import '../../styles/Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { setUser, user } = useAuth(); // Extraemos lo necesario del contexto

    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');

    // EFECTO: Si el usuario ya está logueado, mandarlo al Home automáticamente
    useEffect(() => {
        if (user || localStorage.getItem('token')) {
            navigate('/home');
        }
    }, [user, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
        if (serverError) setServerError('');
    };

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
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    email: formData.email, 
                    password: formData.password 
                })
            });

            const dataText = await response.text();
            let data;

            try {
                data = JSON.parse(dataText);
            } catch (e) {
                data = { message: dataText };
            }

            if (!response.ok) {
                throw new Error(data.error || data.message || 'Error al iniciar sesión');
            }

            // 1. Guardar en LocalStorage
            localStorage.setItem('token', data.token);
            const userPayload = { email: data.email, rol: data.rol };
            localStorage.setItem('user', JSON.stringify(userPayload));

            // 2. ACTUALIZAR EL CONTEXTO GLOBAL
            setUser(userPayload); 

            // 3. REDIRIGIR AL HOME
            navigate('/home');
            
        } catch (error) {
            setServerError(error.message || 'Error de conexión');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h1>Sistema de Boletos Aéreos</h1>
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