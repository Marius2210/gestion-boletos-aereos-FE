import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/common/Sidebar';
import adminService from '../../services/adminService';
import '../../styles/Admin.css';

const AvionesAdmin = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [aviones, setAviones] = useState([]);
    const [aerolineas, setAerolineas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [avionSeleccionado, setAvionSeleccionado] = useState(null);
    const [formData, setFormData] = useState({
        modelo: '',
        capacidad: '',
        idAerolinea: ''
    });

    useEffect(() => {
        if (user?.rol !== 'ADMIN') {
            navigate('/home');
            return;
        }
        cargarDatos();
    }, [user]);

    const cargarDatos = async () => {
        try {
            const [avionesData, aerolineasData] = await Promise.all([
                adminService.listarAviones(),
                adminService.listarAerolineas()
            ]);
            setAviones(avionesData);
            setAerolineas(aerolineasData);
        } catch (err) {
            setError('Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    const abrirModalCrear = () => {
        setModoEdicion(false);
        setAvionSeleccionado(null);
        setFormData({ modelo: '', capacidad: '', idAerolinea: '' });
        setError('');
        setShowModal(true);
    };

    const abrirModalEditar = (avion) => {
        setModoEdicion(true);
        setAvionSeleccionado(avion);
        setFormData({
            modelo: avion.modelo,
            capacidad: avion.capacidad,
            idAerolinea: avion.idAerolinea
        });
        setError('');
        setShowModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
        setError('');
        setFormData({ modelo: '', capacidad: '', idAerolinea: '' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validarFormulario = () => {
        if (!formData.modelo.trim()) {
            setError('El modelo es obligatorio');
            return false;
        }
        if (!formData.capacidad || formData.capacidad <= 0) {
            setError('La capacidad debe ser mayor a 0');
            return false;
        }
        if (!formData.idAerolinea) {
            setError('Selecciona una aerolínea');
            return false;
        }
        return true;
    };

    const handleGuardar = async () => {
        if (!validarFormulario()) return;
        setError('');
        try {
            const data = {
                modelo: formData.modelo.trim(),
                capacidad: parseInt(formData.capacidad),
                idAerolinea: parseInt(formData.idAerolinea)
            };
            if (modoEdicion) {
                await adminService.actualizarAvion(avionSeleccionado.idAvion, data);
                setMensaje('Avión actualizado exitosamente');
            } else {
                await adminService.crearAvion(data);
                setMensaje('Avión creado exitosamente');
            }
            cerrarModal();
            cargarDatos();
        } catch (err) {
            setError('Error al guardar el avión');
        }
    };

    const handleEliminar = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este avión?')) return;
        try {
            await adminService.eliminarAvion(id);
            setMensaje('Avión eliminado exitosamente');
            cargarDatos();
        } catch (err) {
            setError('No se pudo eliminar el avión');
        }
    };

    if (loading) {
        return (
            <div style={{ display: 'flex' }}>
                <Sidebar user={user} logout={logout} />
                <div className="admin-container">
                    <p className="loading">Cargando aviones...</p>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar user={user} logout={logout} />
            <div className="admin-container">

                {/* Header */}
                <div className="admin-header">
                    <h1> Gestión de Aviones</h1>
                    <button className="btn-primary" onClick={abrirModalCrear}>
                        + Nuevo Avión
                    </button>
                </div>

                {/* Mensajes */}
                {mensaje && <div className="success-message">{mensaje}</div>}
                {error && !showModal && <div className="error-message">{error}</div>}

                {/* Estadística rápida */}
                <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '20px' }}>
                    <div className="stat-card">
                        <h3>Total Aviones</h3>
                        <p className="stat-number">{aviones.length}</p>
                    </div>
                    <div className="stat-card success">
                        <h3>Total Aerolíneas</h3>
                        <p className="stat-number">{aerolineas.length}</p>
                    </div>
                    <div className="stat-card warning">
                        <h3>Capacidad Promedio</h3>
                        <p className="stat-number">
                            {aviones.length > 0
                                ? Math.round(aviones.reduce((sum, a) => sum + a.capacidad, 0) / aviones.length)
                                : 0}
                        </p>
                    </div>
                </div>

                {/* Tabla */}
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Modelo</th>
                            <th>Capacidad</th>
                            <th>Aerolínea</th>
                            <th>Código IATA</th>
                            <th>Vuelos Activos</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {aviones.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                                    No hay aviones registrados
                                </td>
                            </tr>
                        ) : (
                            aviones.map((avion) => (
                                <tr key={avion.idAvion}>
                                    <td>{avion.idAvion}</td>
                                    <td><strong>{avion.modelo}</strong></td>
                                    <td>{avion.capacidad} pasajeros</td>
                                    <td>{avion.aerolineaNombre}</td>
                                    <td>
                                        <span className="badge confirmado">{avion.aerolineaCodigoIata}</span>
                                    </td>
                                    <td>{avion.cantidadVuelosActivos ?? 0}</td>
                                    <td>
                                        <button className="btn-edit" onClick={() => abrirModalEditar(avion)}>
                                            ✏️ Editar
                                        </button>
                                        <button className="btn-delete" onClick={() => handleEliminar(avion.idAvion)}>
                                            🗑️ Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Modal Crear/Editar */}
                {showModal && (
                    <div className="modal">
                        <div className="modal-content" style={{ maxWidth: '500px' }}>
                            <h3 style={{ marginTop: 0, marginBottom: '20px' }}>
                                {modoEdicion ? '✏️ Editar Avión' : '➕ Nuevo Avión'}
                            </h3>

                            <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                                <div>
                                    <label style={{ fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                                        Modelo *
                                    </label>
                                    <input
                                        type="text"
                                        name="modelo"
                                        value={formData.modelo}
                                        onChange={handleChange}
                                        placeholder="Ej: Airbus A320"
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                                        Capacidad *
                                    </label>
                                    <input
                                        type="number"
                                        name="capacidad"
                                        value={formData.capacidad}
                                        onChange={handleChange}
                                        placeholder="Ej: 180"
                                        min="1"
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                                        Aerolínea *
                                    </label>
                                    <select
                                        name="idAerolinea"
                                        value={formData.idAerolinea}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                                    >
                                        <option value="">Selecciona una aerolínea</option>
                                        {aerolineas.map((a) => (
                                            <option key={a.idAerolinea} value={a.idAerolinea}>
                                                {a.nombreAerolinea} ({a.codigoIata})
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            </div>

                            {error && <div className="error-message">{error}</div>}

                            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                                <button className="btn-cancel" onClick={cerrarModal} style={{ flex: 1 }}>
                                    Cancelar
                                </button>
                                <button className="btn-save" onClick={handleGuardar} style={{ flex: 1 }}>
                                    {modoEdicion ? 'Actualizar' : 'Crear Avión'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default AvionesAdmin;