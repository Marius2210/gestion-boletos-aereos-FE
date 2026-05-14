import React, { useState, useEffect } from 'react';
import vueloService from '../services/vueloService';
import "../styles/MapaAsientos.css";

const MapaAsientos = ({ idVuelo, onSelectAsiento, selectedAsiento }) => {
    const [mapaAsientos, setMapaAsientos] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        cargarMapaAsientos();
    }, [idVuelo]);

    const cargarMapaAsientos = async () => {
        try {
            setLoading(true);
            const data = await vueloService.obtenerMapaAsientos(idVuelo);
            setMapaAsientos(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const getClaseAsiento = (estado, tipo) => {
        if (estado === 'OCUPADO') return 'asiento-ocupado';
        if (estado === 'RESERVADO') return 'asiento-reservado';
        if (tipo === 'VENTANA') return 'asiento-ventana';
        if (tipo === 'PASILLO') return 'asiento-pasillo';
        return 'asiento-centro';
    };

    if (loading) return <div className="mapa-loading">Cargando asientos...</div>;
    if (error) return <div className="mapa-error">{error}</div>;
    if (!mapaAsientos) return null;

    return (
        <div className="mapa-asientos-container">
            <h3>Mapa de Asientos - {mapaAsientos.numeroVuelo}</h3>
            <p className="mapa-info">
                ✈️ Asientos disponibles: {mapaAsientos.asientosDisponibles} | 
                🟢 Disponible | 🟡 Reservado | 🔴 Ocupado
            </p>
            
            <div className="mapa-grid">
                <div className="mapa-leyenda">
                    <span className="leyenda-ventana"> Ventana</span>
                    <span className="leyenda-pasillo"> Pasillo</span>
                    <span className="leyenda-centro"> Centro</span>
                </div>
                
                {Object.entries(mapaAsientos.asientosPorFila || {}).map(([fila, asientos]) => (
                    <div key={fila} className="fila-asientos">
                        <div className="fila-numero">{fila}</div>
                        <div className="asientos-fila">
                            {asientos.map((asiento) => (
                                <button
                                    key={asiento.numeroAsiento}
                                    className={`asiento ${getClaseAsiento(asiento.estado, asiento.tipo)} ${
                                        selectedAsiento === asiento.numeroAsiento ? 'asiento-seleccionado' : ''
                                    }`}
                                    onClick={() => {
                                        if (asiento.estado === 'DISPONIBLE') {
                                            onSelectAsiento(asiento.numeroAsiento);
                                        }
                                    }}
                                    disabled={asiento.estado !== 'DISPONIBLE'}
                                    title={`Asiento ${asiento.numeroAsiento} - ${asiento.tipo} - ${asiento.estado}`}
                                >
                                    {asiento.numeroAsiento}
                                </button>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MapaAsientos;