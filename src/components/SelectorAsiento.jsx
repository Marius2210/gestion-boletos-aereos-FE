import React, { useState, useEffect } from 'react';
import MapaAsientos from './MapaAsientos';
import vueloService from '../services/vueloService';
import "../styles/SelectorAsiento.css";

const SelectorAsiento = ({ idVuelo, onConfirmarAsiento, asientoInicial }) => {
    const [selectedAsiento, setSelectedAsiento] = useState(asientoInicial || '');
    const [asientosVentana, setAsientosVentana] = useState([]);
    const [showMapa, setShowMapa] = useState(false);

    useEffect(() => {
        if (idVuelo) {
            cargarAsientosPorTipo();
        }
    }, [idVuelo]);

    const cargarAsientosPorTipo = async () => {
        try {
            const ventana = await vueloService.obtenerAsientosDisponibles(idVuelo, 'VENTANA');
            setAsientosVentana(ventana.slice(0, 5));
        } catch (err) {
            console.error(err);
        }
    };

    const handleSelectAsiento = (asiento) => {
        setSelectedAsiento(asiento);
    };

    const handleConfirmar = () => {
        if (selectedAsiento) {
            onConfirmarAsiento(selectedAsiento);
        }
    };

    return (
        <div className="selector-asiento">
            <div className="asiento-rapido">
                <label>Asientos recomendados (ventana):</label>
                <div className="asientos-recomendados">
                    {asientosVentana.map(asiento => (
                        <button
                            key={asiento.numeroAsiento}
                            className={`asiento-recomendado ${selectedAsiento === asiento.numeroAsiento ? 'selected' : ''}`}
                            onClick={() => handleSelectAsiento(asiento.numeroAsiento)}
                        >
                            {asiento.numeroAsiento}
                        </button>
                    ))}
                </div>
            </div>

            <button 
                type="button" 
                className="btn-mapa"
                onClick={() => setShowMapa(!showMapa)}
            >
                {showMapa ? 'Ocultar Mapa' : 'Ver Mapa Completo'}
            </button>

            {showMapa && (
                <MapaAsientos 
                    idVuelo={idVuelo}
                    onSelectAsiento={handleSelectAsiento}
                    selectedAsiento={selectedAsiento}
                />
            )}

            <div className="asiento-seleccionado">
                <label>Asiento seleccionado:</label>
                <input 
                    type="text" 
                    value={selectedAsiento} 
                    readOnly
                    placeholder="Selecciona un asiento"
                    className="asiento-input"
                />
            </div>

            <button 
                className="btn-confirmar-asiento"
                onClick={handleConfirmar}
                disabled={!selectedAsiento}
            >
                Confirmar Asiento
            </button>
        </div>
    );
};

export default SelectorAsiento;