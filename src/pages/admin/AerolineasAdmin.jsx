import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/common/Sidebar';
import adminService from '../../services/adminService';
import '../../styles/Admin.css';

const AerolineasAdmin = () => {
    const { user, logout } = useAuth();
    const [aerolineas, setAerolineas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editando, setEditando] = useState(null);
    const [formData, setFormData] = useState({
        nombreAerolinea: '',
        codigoIata: ''
    });

    useEffect(() => {
        cargarAerolineas();
    }, []);

    const cargarAerolineas = async () => {
        try {
            const data = await adminService.listarAerolineas();
            setAerolineas(data);
        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value.toUpperCase()
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editando) {
                await adminService.actualizarAerolinea(editando.idAerolinea, formData);
            } else {
                await adminService.crearAerolinea(formData);
            }
            setShowModal(false);
            setEditando(null);
            setFormData({ nombreAerolinea: '', codigoIata: '' });
            cargarAerolineas();
        } catch (err) {
            alert(err.message);
        }
    };

    const eliminarAerolinea = async (id, nombre) => {
        if (window.confirm(`¿Eliminar aerolínea "${nombre}"?`)) {
            try {
                await adminService.eliminarAerolinea(id);
                cargarAerolineas();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    if (loading) return <div>Cargando...</div>;

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar user={user} logout={logout} />
            <div className="admin-container">
                <div className="admin-header">
                    <h1>Gestión de Aerolíneas</h1>
                    <button className="btn-primary" onClick={() => setShowModal(true)}>
                        + Nueva Aerolínea
                    </button>
                </div>

                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Código IATA</th>
                            <th>Nombre</th>
                            <th>Aviones</th>
                            <th>Tripulantes</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {aerolineas.map(aerolinea => (
                            <tr key={aerolinea.idAerolinea}>
                                <td>{aerolinea.idAerolinea}</td>
                                <td>{aerolinea.codigoIata}</td>
                                <td>{aerolinea.nombreAerolinea}</td>
                                <td>{aerolinea.cantidadAviones || 0}</td>
                                <td>{aerolinea.cantidadTripulantes || 0}</td>
                                <td>
                                    <button 
                                        className="btn-edit"
                                        onClick={() => {
                                            setEditando(aerolinea);
                                            setFormData({
                                                nombreAerolinea: aerolinea.nombreAerolinea,
                                                codigoIata: aerolinea.codigoIata
                                            });
                                            setShowModal(true);
                                        }}
                                    >
                                        Editar
                                    </button>
                                    <button 
                                        className="btn-delete"
                                        onClick={() => eliminarAerolinea(aerolinea.idAerolinea, aerolinea.nombreAerolinea)}
                                    >
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Modal para crear/editar */}
                {showModal && (
                    <div className="modal">
                        <div className="modal-content">
                            <h2>{editando ? 'Editar' : 'Nueva'} Aerolínea</h2>
                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label>Nombre:</label>
                                    <input
                                        type="text"
                                        name="nombreAerolinea"
                                        value={formData.nombreAerolinea}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Código IATA (3 letras):</label>
                                    <input
                                        type="text"
                                        name="codigoIata"
                                        value={formData.codigoIata}
                                        onChange={handleChange}
                                        maxLength="3"
                                        pattern="[A-Z]{3}"
                                        required
                                    />
                                </div>
                                <div className="modal-buttons">
                                    <button type="submit" className="btn-save">Guardar</button>
                                    <button 
                                        type="button" 
                                        className="btn-cancel"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditando(null);
                                            setFormData({ nombreAerolinea: '', codigoIata: '' });
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AerolineasAdmin;