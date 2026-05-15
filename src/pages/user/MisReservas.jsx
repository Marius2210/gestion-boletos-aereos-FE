import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/common/Sidebar';
import reservaService from '../../services/reservaService';
import '../../styles/MisReservas.css';

const MisReservas = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    useEffect(() => {
        if (user?.idPasajero) {
            cargarReservas();
        }
    }, [user]);

    // Reemplaza cargarReservas
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

    // Reemplaza handleCancelar
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

    const getEstadoColor = (estado) => {
        switch(estado) {
            case 'CONF': return { color: 'green', texto: 'Confirmada' };
            case 'PEN':  return { color: 'orange', texto: 'Pendiente' };
            case 'CANCELADA': return { color: 'red', texto: 'Cancelada' };
            default: return { color: 'gray', texto: estado };
        }
    };

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar user={user} logout={logout} />
            <div style={{ marginLeft: '250px', width: '100%', padding: '30px' }}>
                <h1>Mis Reservas</h1>

                {mensaje && <div style={{ color: 'green', marginBottom: '15px' }}>{mensaje}</div>}
                {error && <div style={{ color: 'red', marginBottom: '15px' }}>{error}</div>}

                {loading ? (
                    <p>Cargando reservas...</p>
                ) : reservas.length === 0 ? (
                    <div style={{ textAlign: 'center', marginTop: '50px' }}>
                        <p>No tienes reservas aún.</p>
                        <button onClick={() => navigate('/home')} 
                            style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>
                            Buscar Vuelos
                        </button>
                    </div>
                ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                        {reservas.map((reserva) => {
                            const estado = getEstadoColor(reserva.estadoReserva);
                            return (
                                <div key={reserva.idReserva} style={{
                                    border: '1px solid #ddd',
                                    borderRadius: '10px',
                                    padding: '20px',
                                    backgroundColor: 'white',
                                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div>
                                            <h3 style={{ margin: '0 0 10px 0' }}>
                                                ✈️ {reserva.vuelo.origen} → {reserva.vuelo.destino}
                                            </h3>
                                            <p><strong>Código:</strong> {reserva.codigoReserva}</p>
                                            <p><strong>Vuelo:</strong> {reserva.vuelo.numeroVuelo} - {reserva.vuelo.aerolineaNombre}</p>
                                            <p><strong>Fecha de vuelo:</strong> {new Date(reserva.vuelo.fechaSalida).toLocaleString()}</p>
                                            <p><strong>Asiento:</strong> {reserva.asientoPreferencia}</p>
                                            <p><strong>Total:</strong> ${reserva.precioTotal}</p>
                                            <p><strong>Estado:</strong> <span style={{ color: estado.color, fontWeight: 'bold' }}>{estado.texto}</span></p>
                                        </div>
                                        <div>
                                            {reserva.estadoReserva !== 'CANCELADA' && (
                                                <button
                                                    onClick={() => handleCancelar(reserva.codigoReserva)}
                                                    style={{
                                                        padding: '10px 20px',
                                                        backgroundColor: '#dc3545',
                                                        color: 'white',
                                                        border: 'none',
                                                        borderRadius: '5px',
                                                        cursor: 'pointer'
                                                    }}>
                                                    Cancelar Reserva
                                                </button>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MisReservas;