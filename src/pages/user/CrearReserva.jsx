import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import SelectorAsiento from '../../components/SelectorAsiento';
import reservaService from '../../services/reservaService';
import '../../styles/CrearReserva.css';
import Sidebar from '../../components/common/Sidebar';

const CrearReserva = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [vuelo, setVuelo] = useState(null);
    const [pasajero, setPasajero] = useState(null);
    const [asientoSeleccionado, setAsientoSeleccionado] = useState('');
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1); // 1: Selección de asiento, 2: Confirmación
    const [error, setError] = useState('');

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
        setLoading(true);
        setError('');
        try {
            await reservaService.crearReserva(
                vuelo.idVuelo,
                pasajero.idPasajero,
                asientoSeleccionado,
                vuelo.tarifaSeleccionada.idTarifa
            );
            sessionStorage.removeItem('vueloSeleccionado');
            navigate('/mis-reservas');
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