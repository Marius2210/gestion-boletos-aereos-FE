import { useNavigate, Link } from 'react-router-dom';
import React, { useState } from 'react';
import '../../styles/Registro.css';


const Registro = () => {
    const [formData, setFormData] = useState({
        nombreCompleto: '',
        numPasaporte: '',
        fechaNac: '',
        nacionalidad: '',
        email: '',
        numTelefono: '',
        password: '',
        confirmPassword: ''
    });
    
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [serverError, setServerError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [showLogin, setShowLogin] = useState(false);

    const navigate = useNavigate();

    // Manejar cambios en los inputs
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Limpiar error del campo
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
        if (serverError) setServerError('');
        if (successMessage) setSuccessMessage('');
    };

    // Validar formulario
    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.nombreCompleto) {
            newErrors.nombreCompleto = 'El nombre completo es obligatorio';
        } else if (formData.nombreCompleto.length < 3) {
            newErrors.nombreCompleto = 'El nombre debe tener al menos 3 caracteres';
        }
        
        if (!formData.numPasaporte) {
            newErrors.numPasaporte = 'El número de pasaporte es obligatorio';
        } else if (formData.numPasaporte.length < 6) {
            newErrors.numPasaporte = 'El pasaporte debe tener al menos 6 caracteres';
        }
        
        if (!formData.fechaNac) {
            newErrors.fechaNac = 'La fecha de nacimiento es obligatoria';
        } else {
            const fechaNac = new Date(formData.fechaNac);
            const hoy = new Date();
            const edad = hoy.getFullYear() - fechaNac.getFullYear();
            if (edad < 18) {
                newErrors.fechaNac = 'Debes ser mayor de 18 años';
            }
            if (fechaNac > hoy) {
                newErrors.fechaNac = 'La fecha no puede ser futura';
            }
        }
        
        if (!formData.nacionalidad) {
            newErrors.nacionalidad = 'La nacionalidad es obligatoria';
        }
        
        if (!formData.email) {
            newErrors.email = 'El email es obligatorio';
        } else {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(formData.email)) {
                newErrors.email = 'Ingrese un email válido';
            }
        }
        
        if (!formData.numTelefono) {
            newErrors.numTelefono = 'El teléfono es obligatorio';
        } else if (formData.numTelefono.length < 8) {
            newErrors.numTelefono = 'El teléfono debe tener al menos 8 dígitos';
        }
        
        if (!formData.password) {
            newErrors.password = 'La contraseña es obligatoria';
        } else if (formData.password.length < 6) {
            newErrors.password = 'La contraseña debe tener al menos 6 caracteres';
        }
        
        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Las contraseñas no coinciden';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Enviar registro
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        setIsLoading(true);
        setServerError('');
        setSuccessMessage('');
        
      try {
    const response = await fetch('/api/usuarios/registrar', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            nombreCompleto: formData.nombreCompleto,
            numPasaporte: formData.numPasaporte,
            fechaNac: formData.fechaNac ? `${formData.fechaNac}T00:00:00` : null,
            nacionalidad: formData.nacionalidad,
            email: formData.email,
            numTelefono: formData.numTelefono,
            password: formData.password
        })
    });

    
    const dataText = await response.text();

    if (!response.ok) {
       
        let errorMessage = dataText;
        try {
            const errorJson = JSON.parse(dataText);
            errorMessage = errorJson.error || errorJson.message || dataText;
        } catch (e) {
            
        }
        throw new Error(errorMessage || 'Error al registrar usuario');
    }

    setSuccessMessage(dataText || '¡Registro exitoso! Ahora puedes iniciar sesión.');
    
    // Limpiar formulario
    setFormData({
        nombreCompleto: '',
        numPasaporte: '',
        fechaNac: '',
        nacionalidad: '',
        email: '',
        numTelefono: '',
        password: '',
        confirmPassword: ''
    });
    
    setTimeout(() => {
        setShowLogin(true);
    }, 2000);
    
} catch (error) {
    
    setServerError(error.message || 'Error de conexión con el servidor');
} finally {
    setIsLoading(false);
}
    };

    
    if (showLogin) {
        return (
            <div className="registro-container">
                <div className="registro-card">
                    <div className="registro-header">
                        <h1> Sistema de Boletos Aéreos</h1>
                        <h2>¡Registro Exitoso!</h2>
                    </div>
                    <div className="success-message-box">
                        <p>Tu cuenta ha sido creada correctamente.</p>
                        <p>Ya puedes iniciar sesión con tu email y contraseña.</p>
                        <button 
                            className="btn-registro"
                            onClick={() => navigate('/login')}
                        >
                            Ir al Login
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="registro-container">
            <div className="registro-card">
                <div className="registro-header">
                    <h1> Sistema de Boletos Aéreos</h1>
                    <h2>Crear Cuenta</h2>
                    <p>Regístrate para comenzar a reservar vuelos</p>
                </div>

                {serverError && (
                    <div className="alert alert-error">
                        {serverError}
                    </div>
                )}

                {successMessage && (
                    <div className="alert alert-success">
                        {successMessage}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="registro-form">
                    {/* Nombre Completo */}
                    <div className="form-group">
                        <label htmlFor="nombreCompleto">Nombre Completo *</label>
                        <input
                            type="text"
                            id="nombreCompleto"
                            name="nombreCompleto"
                            value={formData.nombreCompleto}
                            onChange={handleChange}
                            placeholder="Ej: Juan Carlos Pérez Gómez"
                            className={errors.nombreCompleto ? 'error' : ''}
                            disabled={isLoading}
                        />
                        {errors.nombreCompleto && <span className="error-message">{errors.nombreCompleto}</span>}
                    </div>

                    <div className="form-row">
                        {/* Pasaporte */}
                        <div className="form-group">
                            <label htmlFor="numPasaporte">Número de Pasaporte *</label>
                            <input
                                type="text"
                                id="numPasaporte"
                                name="numPasaporte"
                                value={formData.numPasaporte}
                                onChange={handleChange}
                                placeholder="Ej: AB123456"
                                className={errors.numPasaporte ? 'error' : ''}
                                disabled={isLoading}
                            />
                            {errors.numPasaporte && <span className="error-message">{errors.numPasaporte}</span>}
                        </div>

                        {/* Fecha Nacimiento */}
                        <div className="form-group">
                            <label htmlFor="fechaNac">Fecha de Nacimiento *</label>
                            <input
                                type="date"
                                id="fechaNac"
                                name="fechaNac"
                                value={formData.fechaNac}
                                onChange={handleChange}
                                className={errors.fechaNac ? 'error' : ''}
                                disabled={isLoading}
                            />
                            {errors.fechaNac && <span className="error-message">{errors.fechaNac}</span>}
                        </div>
                    </div>

                    <div className="form-row">
                        {/* Nacionalidad */}
                        <div className="form-group">
                            <label htmlFor="nacionalidad">Nacionalidad *</label>
                            <select
                                id="nacionalidad"
                                name="nacionalidad"
                                value={formData.nacionalidad}
                                onChange={handleChange}
                                className={errors.nacionalidad ? 'error' : ''}
                                disabled={isLoading}
                            >
                                <option value="">Selecciona tu nacionalidad</option>
                                <option value="Salvadoreña">Salvadoreña</option>
                                <option value="Guatemalteca">Guatemalteca</option>
                                <option value="Hondureña">Hondureña</option>
                                <option value="Nicaragüense">Nicaragüense</option>
                                <option value="Costarricense">Costarricense</option>
                                <option value="Panameña">Panameña</option>
                                <option value="Mexicana">Mexicana</option>
                                <option value="Estadounidense">Estadounidense</option>
                                <option value="Española">Española</option>
                                <option value="Otra">Otra</option>
                            </select>
                            {errors.nacionalidad && <span className="error-message">{errors.nacionalidad}</span>}
                        </div>

                        {/* Teléfono */}
                        <div className="form-group">
                            <label htmlFor="numTelefono">Teléfono *</label>
                            <input
                                type="tel"
                                id="numTelefono"
                                name="numTelefono"
                                value={formData.numTelefono}
                                onChange={handleChange}
                                placeholder="Ej: 70123456"
                                className={errors.numTelefono ? 'error' : ''}
                                disabled={isLoading}
                            />
                            {errors.numTelefono && <span className="error-message">{errors.numTelefono}</span>}
                        </div>
                    </div>

                    {/* Email */}
                    <div className="form-group">
                        <label htmlFor="email">Correo Electrónico *</label>
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

                    <div className="form-row">
                        {/* Contraseña */}
                        <div className="form-group">
                            <label htmlFor="password">Contraseña *</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Mínimo 6 caracteres"
                                className={errors.password ? 'error' : ''}
                                disabled={isLoading}
                            />
                            {errors.password && <span className="error-message">{errors.password}</span>}
                        </div>

                        {/* Confirmar Contraseña */}
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Confirmar Contraseña *</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                placeholder="Repite tu contraseña"
                                className={errors.confirmPassword ? 'error' : ''}
                                disabled={isLoading}
                            />
                            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                        </div>
                    </div>

                    <button type="submit" className="btn-registro" disabled={isLoading}>
                        {isLoading ? 'Registrando...' : 'Registrarse'}
                    </button>
                </form>

                <div className="registro-footer">
                    <p>
                        ¿Ya tienes una cuenta?{' '}
                        <button 
                     className="link-login"
                     onClick={() => navigate('/login')}
                       >
                     Inicia Sesión aquí
                     </button>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Registro;