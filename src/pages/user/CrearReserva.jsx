import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/CrearReserva.css';

const CrearReserva = ({ vueloSeleccionado, onReservaCreada, onCancelar }) => {
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [pasajero, setPasajero] = useState(null);
    const [cargandoPasajero, setCargandoPasajero] = useState(true);
    const [formData, setFormData] = useState({
        idVuelo: vueloSeleccionado?.idVuelo || '',
        idPasajero: '',
        asientoPreferencia: '',
        idTarifa: ''
    });
    const [tarifaSeleccionada, setTarifaSeleccionada] = useState(null);
    const [reservaCreada, setReservaCreada] = useState(null);

    // Cargar información del pasajero autenticado
    useEffect(() => {
        const cargarPasajero = async () => {
            try {
                const token = localStorage.getItem('token');
                
                // Buscar pasajero por email (asumiendo que hay un endpoint)
                // Si no hay endpoint, se puede pedir manualmente
                const response = await fetch(`http://localhost:8080/api/pasajeros/email/${user?.email}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });
                
                if (response.ok) {
                    const data = await response.json();
                    setPasajero(data);
                    setFormData(prev => ({ ...prev, idPasajero: data.idPasajero }));
                }
            } catch (err) {
                console.error('Error al cargar pasajero:', err);
            } finally {
                setCargandoPasajero(false);
            }
        };
        
        cargarPasajero();
    }, [user]);

    // Seleccionar tarifa
    const seleccionarTarifa = (tarifa) => {
        setTarifaSeleccionada(tarifa);
        setFormData(prev => ({ 
            ...prev, 
            idTarifa: tarifa.idTarifa,
            precioTotal: tarifa.precio
        }));
        setError('');
    };

    // Manejar cambio de asiento
    const handleAsientoChange = (e) => {
        setFormData(prev => ({ ...prev, asientoPreferencia: e.target.value }));
    };

    // Crear reserva
    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!formData.idTarifa) {
            setError('Por favor selecciona una tarifa');
            return;
        }
        
        if (!formData.idPasajero) {
            setError('No se encontró información del pasajero');
            return;
        }
        
        setLoading(true);
        setError('');
        
        try {
            const token = localStorage.getItem('token');
            
            const requestBody = {
                idVuelo: formData.idVuelo,
                idPasajero: formData.idPasajero,
                asientoPreferencia: formData.asientoPreferencia || null,
                idTarifa: formData.idTarifa
            };
            
            const response = await fetch('http://localhost:8080/api/reservas/crear', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(requestBody)
            });
            
            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error || 'Error al crear la reserva');
            }
            
            setReservaCreada(data);
            
            if (onReservaCreada) {
                onReservaCreada(data);
            }
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    // Si ya se creó la reserva, mostrar confirmación
    if (reservaCreada) {
        return (
            <div className="crear-reserva-container">
                <div className="reserva-confirmacion-card">
                    <div className="confirmacion-header">
                        <div className="check-icon">✓</div>
                        <h2>¡Reserva Creada Exitosamente!</h2>
                    </div>
                    
                    <div className="confirmacion-info">
                        <div className="info-row">
                            <span className="info-label">Código de Reserva:</span>
                            <span className="info-value code">{reservaCreada.codigoReserva}</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Estado:</span>
                            <span className="info-value status-pen">Pendiente de pago</span>
                        </div>
                        <div className="info-row">
                            <span className="info-label">Precio Total:</span>
                            <span className="info-value price">${reservaCreada.precioTotal}</span>
                        </div>
                    </div>
                    
                    <div className="confirmacion-vuelo">
                        <h3>✈️ Detalles del Vuelo</h3>
                        <div className="vuelo-detalle">
                            <div className="aerolinea">{reservaCreada.vuelo.aerolineaNombre}</div>
                            <div className="vuelo-numero">{reservaCreada.vuelo.numeroVuelo}</div>
                            <div className="ruta">
                                <span>{reservaCreada.vuelo.origen}</span>
                                <span className="flecha">→</span>
                                <span>{reservaCreada.vuelo.destino}</span>
                            </div>
                            <div className="fechas">
                                <div>Salida: {new Date(reservaCreada.vuelo.fechaSalida).toLocaleString()}</div>
                                <div>Llegada: {new Date(reservaCreada.vuelo.fechaLlegada).toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div className="confirmacion-pasajero">
                        <h3>👤 Datos del Pasajero</h3>
                        <div className="pasajero-detalle">
                            <div><strong>Nombre:</strong> {reservaCreada.pasajero.nombreCompleto}</div>
                            <div><strong>Pasaporte:</strong> {reservaCreada.pasajero.numPasaporte}</div>
                            <div><strong>Nacionalidad:</strong> {reservaCreada.pasajero.nacionalidad}</div>
                            {reservaCreada.asientoPreferencia && (
                                <div><strong>Asiento:</strong> {reservaCreada.asientoPreferencia}</div>
                            )}
                        </div>
                    </div>
                    
                    <div className="confirmacion-buttons">
                        <button 
                            className="btn-pagar"
                            onClick={() => alert('Redirigiendo a pago...')}
                        >
                            Proceder al Pago
                        </button>
                        <button 
                            className="btn-cancelar"
                            onClick={onCancelar}
                        >
                            Volver a la búsqueda
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (cargandoPasajero) {
        return (
            <div className="crear-reserva-container">
                <div className="loading-card">
                    <div className="spinner"></div>
                    <p>Cargando información...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="crear-reserva-container">
            <div className="reserva-card">
                <div className="reserva-header">
                    <button className="btn-back" onClick={onCancelar}>← Volver</button>
                    <h2>Completar Reserva</h2>
                </div>
                
                {error && <div className="error-message">{error}</div>}
                
                <form onSubmit={handleSubmit} className="reserva-form">
                    {/* Información del Vuelo */}
                    <div className="seccion">
                        <h3>✈️ Información del Vuelo</h3>
                        <div className="info-box">
                            <div className="vuelo-info">
                                <div className="aerolinea-info">
                                    <span className="aerolinea-nombre">{vueloSeleccionado?.aerolineaNombre}</span>
                                    <span className="vuelo-numero">{vueloSeleccionado?.numeroVuelo}</span>
                                </div>
                                <div className="ruta-info">
                                    <div className="ciudad">
                                        <strong>{vueloSeleccionado?.origen}</strong>
                                        <small>{new Date(vueloSeleccionado?.fechaSalida).toLocaleString()}</small>
                                    </div>
                                    <span className="flecha">→</span>
                                    <div className="ciudad">
                                        <strong>{vueloSeleccionado?.destino}</strong>
                                        <small>{new Date(vueloSeleccionado?.fechaLlegada).toLocaleString()}</small>
                                    </div>
                                </div>
                                <div className="avion-info">
                                    ✈️ {vueloSeleccionado?.avionModelo} | Capacidad: {vueloSeleccionado?.capacidad}
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    {/* Selección de Tarifa */}
                    <div className="seccion">
                        <h3>💰 Selecciona tu Tarifa</h3>
                        <div className="tarifas-grid">
                            {vueloSeleccionado?.tarifas?.map((tarifa) => (
                                <div 
                                    key={tarifa.idTarifa}
                                    className={`tarifa-card ${tarifaSeleccionada?.idTarifa === tarifa.idTarifa ? 'selected' : ''}`}
                                    onClick={() => seleccionarTarifa(tarifa)}
                                >
                                    <div className="tarifa-clase">{tarifa.clase}</div>
                                    <div className="tarifa-precio">${tarifa.precio}</div>
                                    <div className="tarifa-beneficios">
                                        {tarifa.clase === 'Económica' && '✓ Equipaje de mano'}
                                        {tarifa.clase === 'Ejecutiva' && '✓ Equipaje de mano ✓ Comida a bordo'}
                                        {tarifa.clase === 'Primera Clase' && '✓ Todo incluido ✓ Asiento preferencial'}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {/* Datos del Pasajero */}
                    <div className="seccion">
                        <h3>👤 Datos del Pasajero</h3>
                        <div className="pasajero-info-box">
                            <div className="pasajero-row">
                                <span className="label">Nombre completo:</span>
                                <span>{pasajero?.nombreCompleto || user?.email}</span>
                            </div>
                            <div className="pasajero-row">
                                <span className="label">Número de pasaporte:</span>
                                <span>{pasajero?.numPasaporte || 'No registrado'}</span>
                            </div>
                            <div className="pasajero-row">
                                <span className="label">Nacionalidad:</span>
                                <span>{pasajero?.nacionalidad || 'No registrada'}</span>
                            </div>
                        </div>
                    </div>
                    
                    {/* Preferencia de Asiento */}
                    <div className="seccion">
                        <h3>💺 Preferencia de Asiento (Opcional)</h3>
                        <div className="asiento-options">
                            <label className="asiento-option">
                                <input 
                                    type="radio" 
                                    name="asiento" 
                                    value="Ventana"
                                    onChange={handleAsientoChange}
                                />
                                <span>Ventana</span>
                            </label>
                            <label className="asiento-option">
                                <input 
                                    type="radio" 
                                    name="asiento" 
                                    value="Pasillo"
                                    onChange={handleAsientoChange}
                                />
                                <span>Pasillo</span>
                            </label>
                            <label className="asiento-option">
                                <input 
                                    type="radio" 
                                    name="asiento" 
                                    value="Sin preferencia"
                                    onChange={handleAsientoChange}
                                    defaultChecked
                                />
                                <span>Sin preferencia</span>
                            </label>
                        </div>
                    </div>
                    
                    {/* Resumen de Precio */}
                    <div className="seccion resumen">
                        <h3>📋 Resumen</h3>
                        <div className="resumen-box">
                            <div className="resumen-row">
                                <span>Tarifa seleccionada:</span>
                                <span>{tarifaSeleccionada?.clase || 'No seleccionada'}</span>
                            </div>
                            <div className="resumen-row total">
                                <span>Total a pagar:</span>
                                <span>${tarifaSeleccionada?.precio || '0.00'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <div className="form-buttons">
                        <button type="button" className="btn-cancelar" onClick={onCancelar}>
                            Cancelar
                        </button>
                        <button type="submit" className="btn-confirmar" disabled={loading}>
                            {loading ? 'Creando reserva...' : 'Confirmar Reserva'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default CrearReserva;