import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/common/Sidebar';
import adminService from '../../services/adminService';
import '../../styles/Admin.css';

const TripulantesAdmin = () => {
    const navigate = useNavigate();
    const { user, logout } = useAuth();

    const [tripulantes, setTripulantes] = useState([]);
    const [aerolineas, setAerolineas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [mensaje, setMensaje] = useState('');

    // Modal
    const [showModal, setShowModal] = useState(false);
    const [modoEdicion, setModoEdicion] = useState(false);
    const [tripulanteSeleccionado, setTripulanteSeleccionado] = useState(null);
    const [formData, setFormData] = useState({
        nombre: '',
        cargo: '',
        idAerolinea: ''
    });

    const cargos = ['Piloto', 'Copiloto', 'Sobrecargo'];

    useEffect(() => {
        if (user?.rol !== 'ADMIN') {
            navigate('/home');
            return;
        }
        cargarDatos();
    }, [user]);

    const cargarDatos = async () => {
        try {
            const [tripulantesData, aerolineasData] = await Promise.all([
                adminService.listarTripulantes(),
                adminService.listarAerolineas()
            ]);
            setTripulantes(tripulantesData);
            setAerolineas(aerolineasData);
        } catch (err) {
            setError('Error al cargar los datos');
        } finally {
            setLoading(false);
        }
    };

    const abrirModalCrear = () => {
        setModoEdicion(false);
        setTripulanteSeleccionado(null);
        setFormData({ nombre: '', cargo: '', idAerolinea: '' });
        setError('');
        setShowModal(true);
    };

    const abrirModalEditar = (tripulante) => {
        setModoEdicion(true);
        setTripulanteSeleccionado(tripulante);
        setFormData({
            nombre: tripulante.nombre,
            cargo: tripulante.cargo,
            idAerolinea: tripulante.idAerolinea
        });
        setError('');
        setShowModal(true);
    };

    const cerrarModal = () => {
        setShowModal(false);
        setError('');
        setFormData({ nombre: '', cargo: '', idAerolinea: '' });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const validarFormulario = () => {
        if (!formData.nombre.trim()) {
            setError('El nombre es obligatorio');
            return false;
        }
        if (!formData.cargo) {
            setError('El cargo es obligatorio');
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
                nombre: formData.nombre.trim(),
                cargo: formData.cargo,
                idAerolinea: parseInt(formData.idAerolinea)
            };
            if (modoEdicion) {
                await adminService.actualizarTripulante(tripulanteSeleccionado.idTripulante, data);
                setMensaje('Tripulante actualizado exitosamente');
            } else {
                await adminService.crearTripulante(data);
                setMensaje('Tripulante creado exitosamente');
            }
            cerrarModal();
            cargarDatos();
        } catch (err) {
            setError('Error al guardar el tripulante');
        }
    };

    const handleEliminar = async (id) => {
        if (!window.confirm('¿Estás seguro de eliminar este tripulante?')) return;
        try {
            await adminService.eliminarTripulante(id);
            setMensaje('Tripulante eliminado exitosamente');
            cargarDatos();
        } catch (err) {
            setError('No se pudo eliminar el tripulante');
        }
    };

    const getCargoBadge = (cargo) => {
        const colores = {
            'Piloto': 'confirmado',
            'Copiloto': 'pendiente',
            'Sobrecargo': 'active',
            'Auxiliar de vuelo': 'inactive'
        };
        return <span className={`badge ${colores[cargo] || 'confirmado'}`}>{cargo}</span>;
    };

    if (loading) {
        return (
            <div style={{ display: 'flex' }}>
                <Sidebar user={user} logout={logout} />
                <div className="admin-container">
                    <p className="loading">Cargando tripulantes...</p>
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
                    <h1> Gestión de Tripulación</h1>
                    <button className="btn-primary" onClick={abrirModalCrear}>
                        + Nuevo Tripulante
                    </button>
                </div>

                {/* Mensajes */}
                {mensaje && <div className="success-message">{mensaje}</div>}
                {error && !showModal && <div className="error-message">{error}</div>}

                {/* Estadísticas rápidas */}
                <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', marginBottom: '20px' }}>
                    <div className="stat-card">
                        <h3>Total Tripulantes</h3>
                        <p className="stat-number">{tripulantes.length}</p>
                    </div>
                    <div className="stat-card success">
                        <h3>Pilotos</h3>
                        <p className="stat-number">{tripulantes.filter(t => t.cargo === 'Piloto').length}</p>
                    </div>
                      <div className="stat-card danger">
                      <h3>Copilotos</h3>
                     <p className="stat-number">{tripulantes.filter(t => t.cargo === 'Copiloto').length}</p>
                    </div>
                    <div className="stat-card warning">
                        <h3>Sobrecargos</h3>
                        <p className="stat-number">{tripulantes.filter(t => t.cargo === 'Sobrecargo').length}</p>
                    </div>
                </div>

                {/* Tabla */}
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Nombre</th>
                            <th>Cargo</th>
                            <th>Aerolínea</th>
                            <th>Código IATA</th>
                            <th>Vuelos Asignados</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tripulantes.length === 0 ? (
                            <tr>
                                <td colSpan="7" style={{ textAlign: 'center', padding: '30px', color: '#999' }}>
                                    No hay tripulantes registrados
                                </td>
                            </tr>
                        ) : (
                            tripulantes.map((tripulante) => (
                                <tr key={tripulante.idTripulante}>
                                    <td>{tripulante.idTripulante}</td>
                                    <td><strong>{tripulante.nombre}</strong></td>
                                    <td>{getCargoBadge(tripulante.cargo)}</td>
                                    <td>{tripulante.aerolineaNombre}</td>
                                    <td>
                                        <span className="badge confirmado">{tripulante.aerolineaCodigoIata}</span>
                                    </td>
                                    <td>{tripulante.cantidadVuelosAsignados ?? 0}</td>
                                    <td>
                                        <button className="btn-edit" onClick={() => abrirModalEditar(tripulante)}>
                                            ✏️ Editar
                                        </button>
                                        <button className="btn-delete" onClick={() => handleEliminar(tripulante.idTripulante)}>
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
                                {modoEdicion ? '✏️ Editar Tripulante' : '➕ Nuevo Tripulante'}
                            </h3>

                            <div className="form-grid" style={{ gridTemplateColumns: '1fr' }}>
                                <div>
                                    <label style={{ fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                                        Nombre completo *
                                    </label>
                                    <input
                                        type="text"
                                        name="nombre"
                                        value={formData.nombre}
                                        onChange={handleChange}
                                        placeholder="Ej: Juan Carlos Pérez"
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                                    />
                                </div>
                                <div>
                                    <label style={{ fontWeight: '600', display: 'block', marginBottom: '6px' }}>
                                        Cargo *
                                    </label>
                                    <select
                                        name="cargo"
                                        value={formData.cargo}
                                        onChange={handleChange}
                                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #ddd', boxSizing: 'border-box' }}
                                    >
                                        <option value="">Selecciona un cargo</option>
                                        {cargos.map((c) => (
                                            <option key={c} value={c}>{c}</option>
                                        ))}
                                    </select>
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
                                    {modoEdicion ? 'Actualizar' : 'Crear Tripulante'}
                                </button>
                            </div>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
};

export default TripulantesAdmin;