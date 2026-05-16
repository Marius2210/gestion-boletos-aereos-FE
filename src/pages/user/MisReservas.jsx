import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/common/Sidebar';
import reservaService from '../../services/reservaService';
import pagoService from '../../services/pagoService';
import '../../styles/MisReservas.css';

const MisReservas = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    // Estados para el modal de pago
    const [reservaAPagar, setReservaAPagar] = useState(null);
    const [numeroTarjeta, setNumeroTarjeta] = useState('');
    const [fechaExp, setFechaExp] = useState('');
    const [cvv, setCvv] = useState('');
    const [loadingPago, setLoadingPago] = useState(false);

    useEffect(() => {
        if (user?.idPasajero) {
            cargarReservas();
        }
    }, [user]);

    const cargarReservas = async () => {
        try {
            const data = await reservaService.obtenerReservasPorPasajero(user.idPasajero);
            setReservas(data);
        } catch (err) {
            setError('No se pudieron cargar las reservas');
        } finally {
            setLoading(false);
        }
    };

    const handleCancelar = async (codigoReserva) => {
        if (!window.confirm('¿Estás seguro de cancelar esta reserva?')) return;
        try {
            await reservaService.cancelarReserva(codigoReserva);
            setMensaje('Reserva cancelada exitosamente');
            cargarReservas();
        } catch (err) {
            setError('No se pudo cancelar la reserva');
        }
    };

    const handlePagar = async () => {
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
        setLoadingPago(true);
        setError('');
        try {
            await pagoService.confirmarPago(
                reservaAPagar.idReserva,
                reservaAPagar.precioTotal,
                'TARJETA_CREDITO'
            );
            setMensaje('¡Pago realizado exitosamente!');
            setReservaAPagar(null);
            setNumeroTarjeta('');
            setFechaExp('');
            setCvv('');
            cargarReservas();
        } catch (err) {
            setError('No se pudo procesar el pago');
        } finally {
            setLoadingPago(false);
        }
    };

    const getEstadoBadge = (estado) => {
        switch(estado) {
            case 'CONF': return <span className="estado-badge estado-confirmada">Confirmada</span>;
            case 'PEN':  return <span className="estado-badge estado-pendiente">Pendiente</span>;
            case 'CANCELADA': return <span className="estado-badge estado-cancelada">Cancelada</span>;
            default: return <span className="estado-badge">{estado}</span>;
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar user={user} logout={logout} />
            <div className="mis-reservas-container">
                <h1 className="mis-reservas-header">✈️ Mis Reservas</h1>

                <div className="mis-reservas-content">
                    {mensaje && <div className="mensaje-exito">{mensaje}</div>}
                    {error && !reservaAPagar && <div className="mensaje-error">{error}</div>}

                    {loading ? (
                        <p className="loading-text">Cargando reservas...</p>
                    ) : reservas.length === 0 ? (
                        <div className="sin-reservas">
                            <p>No tienes reservas aún.</p>
                            <button onClick={() => navigate('/home')} className="btn-buscar-vuelos">
                                Buscar Vuelos
                            </button>
                        </div>
                    ) : (
                        <div className="reservas-list">
                            {reservas.map((reserva) => (
                                <div key={reserva.idReserva} className="reserva-card">
                                    <div className="reserva-card-header">
                                        <span className="reserva-ruta">
                                            ✈️ {reserva.vuelo.origen} → {reserva.vuelo.destino}
                                        </span>
                                        <span className="reserva-aerolinea">
                                            {reserva.vuelo.aerolineaNombre}
                                        </span>
                                    </div>
                                    <div className="reserva-card-body">
                                        <div className="reserva-info">
                                            <p><strong>Código:</strong> {reserva.codigoReserva}</p>
                                            <p><strong>Vuelo:</strong> {reserva.vuelo.numeroVuelo}</p>
                                            <p><strong>Fecha:</strong> {new Date(reserva.vuelo.fechaSalida).toLocaleString()}</p>
                                            <p><strong>Asiento:</strong> {reserva.asientoPreferencia}</p>
                                            <p><strong>Total:</strong> ${reserva.precioTotal}</p>
                                            <p><strong>Estado:</strong> {getEstadoBadge(reserva.estadoReserva)}</p>
                                        </div>
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                            {reserva.estadoReserva === 'PEN' && (
                                                <>
                                                    <button
                                                        onClick={() => { setReservaAPagar(reserva); setError(''); setMensaje(''); }}
                                                        className="btn-pagar-reserva">
                                                        💳 Pagar
                                                    </button>
                                                    <button
                                                        onClick={() => handleCancelar(reserva.codigoReserva)}
                                                        className="btn-cancelar">
                                                        Cancelar
                                                    </button>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modal de pago */}
            {reservaAPagar && (
                <div style={{
                    position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
                    backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex',
                    justifyContent: 'center', alignItems: 'center', zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white', borderRadius: '12px',
                        padding: '30px', width: '400px',
                        boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
                    }}>
                        <h3 style={{ marginTop: 0 }}>💳 Pagar Reserva</h3>
                        <p><strong>Código:</strong> {reservaAPagar.codigoReserva}</p>
                        <p><strong>Ruta:</strong> {reservaAPagar.vuelo.origen} → {reservaAPagar.vuelo.destino}</p>
                        <p><strong>Monto:</strong> ${reservaAPagar.precioTotal}</p>

                        <div style={{ marginTop: '15px' }}>
                            <label style={{ fontWeight: '600', display: 'block', marginBottom: '5px' }}>
                                Número de tarjeta
                            </label>
                            <input
                                type="text"
                                placeholder="**** **** **** 1234"
                                value={numeroTarjeta}
                                onChange={(e) => setNumeroTarjeta(e.target.value)}
                                maxLength={16}
                                style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                            />
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontWeight: '600', display: 'block', marginBottom: '5px' }}>
                                        Fecha exp.
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="MM/AA"
                                        value={fechaExp}
                                        onChange={(e) => setFechaExp(e.target.value)}
                                        maxLength={5}
                                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                                    />
                                </div>
                                <div style={{ flex: 1 }}>
                                    <label style={{ fontWeight: '600', display: 'block', marginBottom: '5px' }}>
                                        CVV
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="123"
                                        value={cvv}
                                        onChange={(e) => setCvv(e.target.value)}
                                        maxLength={3}
                                        style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                                    />
                                </div>
                            </div>
                        </div>

                        {error && <div style={{ color: 'red', margin: '10px 0', fontSize: '14px' }}>{error}</div>}

                        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                            <button
                                onClick={() => { setReservaAPagar(null); setError(''); }}
                                style={{ flex: 1, padding: '10px', borderRadius: '6px', border: '1px solid #ddd', cursor: 'pointer', background: 'white' }}>
                                Cancelar
                            </button>
                            <button
                                onClick={handlePagar}
                                disabled={loadingPago}
                                style={{ flex: 1, padding: '10px', backgroundColor: '#667eea', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}>
                                {loadingPago ? 'Procesando...' : `Pagar $${reservaAPagar.precioTotal}`}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default MisReservas;