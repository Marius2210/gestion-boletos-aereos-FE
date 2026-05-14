import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SelectorAsiento from '../../components/SelectorAsiento';
import reservaService from '../../services/reservaService';
import pagoService from '../../services/pagoService';
import pasajeroService from '../../services/pasajeroService';
import '../../styles/CrearReserva.css';
import Sidebar from '../../components/common/Sidebar';

const CrearReserva = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [vuelo, setVuelo] = useState(null);
    const [pasajero, setPasajero] = useState(null);
    const [asientoSeleccionado, setAsientoSeleccionado] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Selección de asiento, 2: Confirmación, 3: Pago
    const [reserva, setReserva] = useState(null);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    //estados para las validaciones 
const [numeroTarjeta, setNumeroTarjeta] = useState('');
const [fechaExp, setFechaExp] = useState('');
const [cvv, setCvv] = useState('');

    useEffect(() => {
        const vueloData = sessionStorage.getItem('vueloSeleccionado');
        if (!vueloData) {
            navigate('/home');
            return;
        }
        setVuelo(JSON.parse(vueloData));
    }, []);

    useEffect(() => {
        if (user) {
            console.log('User cargado:', user);
            setPasajero({
                idPasajero: user.idPasajero,
                nombreCompleto: user.nombrePasajero
            });
        }
    }, [user]);


    const handleConfirmarAsiento = async (asiento) => {
        setAsientoSeleccionado(asiento);
        setStep(2);
    };

    const handleCrearReserva = async () => {
        if (!pasajero || !vuelo || !asientoSeleccionado) {
            setError('Faltan datos para crear la reserva');
            return;
        }

         // ← Agrega aquí
    console.log('Datos a enviar:', {
        idVuelo: vuelo.idVuelo,
        idPasajero: pasajero.idPasajero,
        asientoSeleccionado,
        idTarifa: vuelo.tarifaSeleccionada.idTarifa
    });

        setLoading(true);
        setError('');

        try {
            const nuevaReserva = await reservaService.crearReserva(
                vuelo.idVuelo,
                pasajero.idPasajero,
                asientoSeleccionado,
                vuelo.tarifaSeleccionada.idTarifa
            );
            setReserva(nuevaReserva);
            setStep(3);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleConfirmarPago = async () => {

     // Validaciones
    if (!numeroTarjeta || numeroTarjeta.length < 16) {
        setError('Ingresa un número de tarjeta válido de 16 dígitos');
        return;
    }
    if (!fechaExp || !/^\d{2}\/\d{2}$/.test(fechaExp)) {
        setError('Ingresa una fecha válida en formato MM/AA');
        return;
    }
    if (!cvv || cvv.length < 3) {
        setError('Ingresa un CVV válido de 3 dígitos');
        return;
    }

        setLoading(true);
        setError('');

        try {
            const pago = await pagoService.confirmarPago(
                reserva.idReserva,
                vuelo.tarifaSeleccionada.precio,
                'TARJETA_CREDITO'
            );
            setSuccess('¡Pago confirmado! Tu reserva ha sido completada.');
            setStep(4);
            
            // Limpiar datos de sesión
            sessionStorage.removeItem('vueloSeleccionado');
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const renderStep = () => {
        switch(step) {
            case 1:
                return (
                    <div className="step-container">
                        <h2>Paso 1: Selecciona tu asiento</h2>
                        {vuelo && (
                            <div className="vuelo-info">
                                <p><strong>{vuelo.aerolineaNombre}</strong> - {vuelo.numeroVuelo}</p>
                                <p>{vuelo.origen} → {vuelo.destino}</p>
                                <p>Fecha: {new Date(vuelo.fechaSalida).toLocaleString()}</p>
                                <p>Tarifa: {vuelo.tarifaSeleccionada.clase} - ${vuelo.tarifaSeleccionada.precio}</p>
                            </div>
                        )}
                        <SelectorAsiento 
                            idVuelo={vuelo?.idVuelo}
                            onConfirmarAsiento={handleConfirmarAsiento}
                        />
                    </div>
                );
            
            case 2:
                return (
                    <div className="step-container">
                        <h2>Paso 2: Confirma tu reserva</h2>
                        <div className="resumen-reserva">
                            <h3>Detalles del vuelo</h3>
                            <p><strong>Aerolínea:</strong> {vuelo?.aerolineaNombre}</p>
                            <p><strong>Vuelo:</strong> {vuelo?.numeroVuelo}</p>
                            <p><strong>Ruta:</strong> {vuelo?.origen} → {vuelo?.destino}</p>
                            <p><strong>Fecha:</strong> {new Date(vuelo?.fechaSalida).toLocaleString()}</p>
                            <p><strong>Asiento:</strong> {asientoSeleccionado}</p>
                            <p><strong>Tarifa:</strong> {vuelo?.tarifaSeleccionada.clase}</p>
                            <p><strong>Precio total:</strong> ${vuelo?.tarifaSeleccionada.precio}</p>
                        </div>
                        <div className="pasajero-info">
                            <h3>Datos del pasajero</h3>
                            <p><strong>Nombre:</strong> {pasajero?.nombreCompleto}</p>
                            <p><strong>Email:</strong> {user?.email}</p>
                        </div>
                        {error && <div className="error-message">{error}</div>}
                        <div className="step-buttons">
                            <button onClick={() => setStep(1)} className="btn-back-step">
                                Volver
                            </button>
                            <button onClick={handleCrearReserva} disabled={loading} className="btn-confirm">
                                {loading ? 'Creando...' : 'Confirmar Reserva'}
                            </button>
                        </div>
                    </div>
                );
            
            case 3:
                return (
                    <div className="step-container">
                        <h2>Paso 3: Realizar pago</h2>
                        <div className="pago-info">
                            <p><strong>Reserva código:</strong> {reserva?.codigoReserva}</p>
                            <p><strong>Monto a pagar:</strong> ${vuelo?.tarifaSeleccionada.precio}</p>
                            <p><strong>Método de pago:</strong> Tarjeta de Crédito</p>
                        </div>
                        <div className="form-pago">
                            <div className="form-group">
                                <label>Número de tarjeta</label>
                                <input type="text" 
                                placeholder="**** **** **** 1234" 
                                value={numeroTarjeta}
                                onChange={(e) => setNumeroTarjeta(e.target.value)}
                                 maxLength={16}
                                />
                            </div>
                            <div className="form-row">
                                <div className="form-group">
                                    <label>Fecha expiración</label>
                                    <input type="text" 
                                    placeholder="MM/AA" 
                                    value={fechaExp}
                                    onChange={(e) => setFechaExp(e.target.value)}
                                     maxLength={5}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>CVV</label>
                                    <input type="text" 
                                    placeholder="123"
                                    value={cvv}
                                    onChange={(e) => setCvv(e.target.value)}
                                    maxLength={3}
                                     />
                                </div>
                            </div>
                        </div>
                        {error && <div className="error-message">{error}</div>}
                        <div className="step-buttons">
                            <button onClick={() => setStep(2)} className="btn-back-step">
                                Volver
                            </button>
                            <button onClick={handleConfirmarPago} disabled={loading} className="btn-pagar">
                                {loading ? 'Procesando...' : 'Pagar $' + vuelo?.tarifaSeleccionada?.precio}
                            </button>
                        </div>
                    </div>
                );
            
            case 4:
                return (
                    <div className="step-container success-container">
                        <div className="success-icon">✓</div>
                        <h2>¡Reserva Confirmada!</h2>
                        <p>Tu reserva ha sido completada exitosamente.</p>
                        <div className="resumen-final">
                            <p><strong>Código de reserva:</strong> {reserva?.codigoReserva}</p>
                            <p><strong>Asiento:</strong> {asientoSeleccionado}</p>
                            <p><strong>Total pagado:</strong> ${vuelo?.tarifaSeleccionada.precio}</p>
                        </div>
                        <button onClick={() => navigate('/home')} className="btn-home">
                            Volver al Inicio
                        </button>
                    </div>
                );
            
            default:
                return null;
        }
    };

    if (!vuelo) {
        return (
            <div style={{ display: 'flex' }}>
                <Sidebar user={user} logout={logout} />
                <div className="crear-reserva-container">
                    <p>Cargando datos del vuelo...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar user={user} logout={logout} />
            <div className="crear-reserva-container">
                {renderStep()}
            </div>
        </div>
    );
};

export default CrearReserva;