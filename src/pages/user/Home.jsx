import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import '../../styles/Home.css';

const Home = () => {
    const { user, logout } = useAuth();
    const [showResults, setShowResults] = useState(false);
    const [vuelos, setVuelos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchData, setSearchData] = useState({
        origen: '',
        destino: '',
        fechaSalida: ''
    });
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setSearchData(prev => ({ ...prev, [name]: value }));
        setError('');
    };

    //
  const buscarVuelos = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const token = localStorage.getItem('token');

    try {
        // Construimos la URL con parámetros para un GET, igual que en Postman
        const url = `/api/vuelos/disponibles?origen=${searchData.origen}&destino=${searchData.destino}&fechaSalida=${searchData.fechaSalida}T00:00:00`;

        const response = await fetch(url, {
            method: 'GET', // Cambiado a GET para coincidir con tu prueba exitosa
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });

        if (response.status === 403) {
            throw new Error('Acceso denegado (403). Revisa los permisos de tu usuario en el Backend.');
        }

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Error al buscar vuelos');
        }

        setVuelos(data);
        setShowResults(true);

    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};
    
    //

    if (showResults) {
        return (
            <div className="home-container">
                <div className="navbar">
                    <div className="navbar-brand">✈️ AeroBooking</div>
                    <div className="navbar-user">
                        <span>👤 {user?.email}</span>
                        <button onClick={logout} className="btn-logout">Cerrar Sesión</button>
                    </div>
                </div>
                
                <div className="results-container">
                    <button onClick={() => setShowResults(false)} className="btn-back">
                        ← Nueva Búsqueda
                    </button>
                    
                    <h2>Vuelos Disponibles</h2>
                    
                    {vuelos.length === 0 ? (
                        <p>No hay vuelos disponibles para los criterios seleccionados.</p>
                    ) : (
                        <div className="vuelos-list">
                            {vuelos.map((vuelo) => (
                                <div key={vuelo.idVuelo} className="vuelo-card">
                                    <div className="vuelo-header">
                                        <span className="aerolinea">{vuelo.aerolineaNombre}</span>
                                        <span className="numero-vuelo">{vuelo.numeroVuelo}</span>
                                    </div>
                                    <div className="vuelo-body">
                                        <div className="vuelo-ruta">
                                            <div className="ciudad">
                                                <strong>{vuelo.origen}</strong>
                                                <small>{new Date(vuelo.fechaSalida).toLocaleString()}</small>
                                            </div>
                                            <div className="vuelo-flecha">→</div>
                                            <div className="ciudad">
                                                <strong>{vuelo.destino}</strong>
                                                <small>{new Date(vuelo.fechaLlegada).toLocaleString()}</small>
                                            </div>
                                        </div>
                                        <div className="avion-info">
                                            ✈️ {vuelo.avionModelo} | Capacidad: {vuelo.capacidad}
                                        </div>
                                    </div>
                                    <div className="vuelo-footer">
                                        <div className="tarifas">
                                            {vuelo.tarifas.map((tarifa) => (
                                                <button 
                                                    key={tarifa.idTarifa}
                                                    className="btn-tarifa"
                                                    onClick={() => alert(`Seleccionaste ${tarifa.clase}: $${tarifa.precio}`)}
                                                >
                                                    {tarifa.clase}: ${tarifa.precio}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    return (
        <div className="home-container">
            <div className="navbar">
                <div className="navbar-brand">✈️ AeroBooking</div>
                <div className="navbar-user">
                    <span>👤 {user?.email}</span>
                    <button onClick={logout} className="btn-logout">Cerrar Sesión</button>
                </div>
            </div>
            
            <div className="hero-section">
                <h1>Encuentra tu próximo destino</h1>
                <p>Los mejores precios en boletos aéreos</p>
            </div>
            
            <div className="search-card">
                <form onSubmit={buscarVuelos} className="search-form">
                    <div className="search-row">
                        <div className="search-group">
                            <label>✈️ Origen</label>
                            <input
                                type="text"
                                name="origen"
                                value={searchData.origen}
                                onChange={handleChange}
                                placeholder="Ciudad de origen"
                                list="ciudades"
                            />
                        </div>
                        <div className="search-group">
                            <label>📍 Destino</label>
                            <input
                                type="text"
                                name="destino"
                                value={searchData.destino}
                                onChange={handleChange}
                                placeholder="Ciudad de destino"
                                list="ciudades"
                            />
                            <datalist id="ciudades">
                                <option value="San Salvador" />
                                <option value="Guatemala" />
                                <option value="Houston" />
                                <option value="Madrid" />
                                <option value="Miami" />
                                <option value="Ciudad de México" />
                            </datalist>
                        </div>
                        <div className="search-group">
                            <label>📅 Fecha</label>
                            <input
                                type="date"
                                name="fechaSalida"
                                value={searchData.fechaSalida}
                                onChange={handleChange}
                                min={new Date().toISOString().split('T')[0]}
                            />
                        </div>
                        <button type="submit" className="btn-search" disabled={loading}>
                            {loading ? 'Buscando...' : 'Buscar Vuelos'}
                        </button>
                    </div>
                </form>
                
                {error && <div className="error-message">{error}</div>}
            </div>
        </div>
    );
};

export default Home;