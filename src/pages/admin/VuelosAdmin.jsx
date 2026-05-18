import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/common/Sidebar';
import adminService from '../../services/adminService';
import '../../styles/Admin.css';
import '../../styles/VuelosAdmin.css';

const VuelosAdmin = () => {
    const { user, logout } = useAuth();
    const [vuelos, setVuelos] = useState([]);
    const [aviones, setAviones] = useState([]);
    const [aerolineas, setAerolineas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editando, setEditando] = useState(null);
    const [filtro, setFiltro] = useState({
        origen: '',
        destino: '',
        estado: ''
    });
    const [formData, setFormData] = useState({
        numeroVuelo: '',
        origen: '',
        destino: '',
        fechaSalida: '',
        fechaLlegada: '',
        estado: 'P',
        idAvion: '',
        tarifas: [{ clase: '', precio: '' }]
    });
const [showModalTripulacion, setShowModalTripulacion] = useState(false);
const [vueloTripulacion, setVueloTripulacion] = useState(null);
const [tripulantesAsignados, setTripulantesAsignados] = useState([]);
const [tripulantesDisponibles, setTripulantesDisponibles] = useState([]);
const [loadingTripulacion, setLoadingTripulacion] = useState(false);

    useEffect(() => {
        cargarDatos();
    }, []);

    const cargarDatos = async () => {
        try {
            const [vuelosData, avionesData, aerolineasData] = await Promise.all([
                adminService.listarVuelos(),
                adminService.listarAviones(),
                adminService.listarAerolineas()
            ]);
            setVuelos(vuelosData);
            setAviones(avionesData);
            setAerolineas(aerolineasData);
        } catch (err) {
            console.error('Error cargando datos:', err);
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleTarifaChange = (index, field, value) => {
        const nuevasTarifas = [...formData.tarifas];
        nuevasTarifas[index][field] = field === 'precio' ? parseFloat(value) : value;
        setFormData(prev => ({ ...prev, tarifas: nuevasTarifas }));
    };

    const agregarTarifa = () => {
        setFormData(prev => ({
            ...prev,
            tarifas: [...prev.tarifas, { clase: '', precio: '' }]
        }));
    };

    const eliminarTarifa = (index) => {
        if (formData.tarifas.length === 1) {
            alert('Debe haber al menos una tarifa');
            return;
        }
        const nuevasTarifas = formData.tarifas.filter((_, i) => i !== index);
        setFormData(prev => ({ ...prev, tarifas: nuevasTarifas }));
    };

    const resetForm = () => {
        setFormData({
            numeroVuelo: '',
            origen: '',
            destino: '',
            fechaSalida: '',
            fechaLlegada: '',
            estado: 'P',
            idAvion: '',
            tarifas: [{ clase: '', precio: '' }]
        });
        setEditando(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validaciones
        if (!formData.numeroVuelo.trim()) {
            alert('Ingrese el número de vuelo');
            return;
        }
        if (!formData.origen.trim()) {
            alert('Ingrese el origen');
            return;
        }
        if (!formData.destino.trim()) {
            alert('Ingrese el destino');
            return;
        }
        if (!formData.fechaSalida) {
            alert('Ingrese la fecha de salida');
            return;
        }
        if (!formData.fechaLlegada) {
            alert('Ingrese la fecha de llegada');
            return;
        }
        if (!formData.idAvion) {
            alert('Seleccione un avión');
            return;
        }

        // Validar que fechaLlegada sea después de fechaSalida
        if (new Date(formData.fechaLlegada) <= new Date(formData.fechaSalida)) {
            alert('La fecha de llegada debe ser posterior a la fecha de salida');
            return;
        }

        // Validar tarifas
        for (const tarifa of formData.tarifas) {
            if (!tarifa.clase.trim()) {
                alert('Complete el nombre de todas las tarifas');
                return;
            }
            if (!tarifa.precio || tarifa.precio <= 0) {
                alert('Ingrese un precio válido para todas las tarifas');
                return;
            }
        }

        const dataToSend = {
            numeroVuelo: formData.numeroVuelo.toUpperCase(),
            origen: formData.origen,
            destino: formData.destino,
            fechaSalida: formData.fechaSalida,
            fechaLlegada: formData.fechaLlegada,
            estado: formData.estado,
            idAvion: parseInt(formData.idAvion),
            tarifas: formData.tarifas.map(t => ({
                clase: t.clase,
                precio: parseFloat(t.precio)
            }))
        };

        try {
            if (editando) {
                await adminService.actualizarVuelo(editando.idVuelo, dataToSend);
                alert('Vuelo actualizado exitosamente');
            } else {
                await adminService.crearVuelo(dataToSend);
                alert('Vuelo creado exitosamente');
            }
            setShowModal(false);
            resetForm();
            cargarDatos();
        } catch (err) {
            alert(err.message);
        }
    };

    const eliminarVuelo = async (id, numeroVuelo) => {
        if (window.confirm(`¿Estás seguro de eliminar el vuelo ${numeroVuelo}?`)) {
            try {
                await adminService.eliminarVuelo(id);
                alert('Vuelo eliminado exitosamente');
                cargarDatos();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const cambiarEstado = async (id, nuevoEstado) => {
        const estadosTexto = { P: 'Programado', V: 'En Vuelo', A: 'Aterrizado', C: 'Cancelado' };
        if (window.confirm(`¿Cambiar estado a ${estadosTexto[nuevoEstado]}?`)) {
            try {
                await adminService.cambiarEstadoVuelo(id, nuevoEstado);
                alert('Estado actualizado');
                cargarDatos();
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const editarVuelo = (vuelo) => {
        const fechaSalidaLocal = vuelo.fechaSalida ? vuelo.fechaSalida.slice(0, 16) : '';
        const fechaLlegadaLocal = vuelo.fechaLlegada ? vuelo.fechaLlegada.slice(0, 16) : '';

        setFormData({
            numeroVuelo: vuelo.numeroVuelo,
            origen: vuelo.origen,
            destino: vuelo.destino,
            fechaSalida: fechaSalidaLocal,
            fechaLlegada: fechaLlegadaLocal,
            estado: vuelo.estado,
            idAvion: vuelo.idAvion.toString(),
            tarifas: vuelo.tarifas && vuelo.tarifas.length > 0
                ? vuelo.tarifas.map(t => ({ clase: t.clase, precio: t.precio }))
                : [{ clase: '', precio: '' }]
        });
        setEditando(vuelo);
        setShowModal(true);
    };

    const getEstadoTexto = (estado) => {
        const estados = { P: 'Programado', V: 'En Vuelo', A: 'Aterrizado', C: 'Cancelado' };
        return estados[estado] || estado;
    };

    const getAerolineaNombre = (idAvion) => {
        const avion = aviones.find(a => a.idAvion === idAvion);
        return avion?.aerolineaNombre || 'N/A';
    };

    // Filtrar vuelos
    const vuelosFiltrados = vuelos.filter(vuelo => {
        if (filtro.origen && !vuelo.origen.toLowerCase().includes(filtro.origen.toLowerCase())) return false;
        if (filtro.destino && !vuelo.destino.toLowerCase().includes(filtro.destino.toLowerCase())) return false;
        if (filtro.estado && vuelo.estado !== filtro.estado) return false;
        return true;
    });

    const abrirModalTripulacion = async (vuelo) => {
    setVueloTripulacion(vuelo);
    setLoadingTripulacion(true);
    setShowModalTripulacion(true);
    try {
        const [asignados, disponibles] = await Promise.all([
            adminService.obtenerTripulantesVuelo(vuelo.idVuelo),
            adminService.obtenerTripulantesDisponibles(vuelo.idVuelo)
        ]);
        setTripulantesAsignados(asignados);
        setTripulantesDisponibles(disponibles);
    } catch (err) {
        alert('Error al cargar tripulación');
    } finally {
        setLoadingTripulacion(false);
    }
};

const handleAsignarTripulante = async (idTripulante) => {
    try {
        await adminService.asignarTripulantes(vueloTripulacion.idVuelo, [idTripulante]);
        const [asignados, disponibles] = await Promise.all([
            adminService.obtenerTripulantesVuelo(vueloTripulacion.idVuelo),
            adminService.obtenerTripulantesDisponibles(vueloTripulacion.idVuelo)
        ]);
        setTripulantesAsignados(asignados);
        setTripulantesDisponibles(disponibles);
    } catch (err) {
        const errorMensaje = err.message || 'Error al asignar tripulante';
        alert(errorMensaje);
    }
};

const handleRemoverTripulante = async (idTripulante) => {
    if (!window.confirm('¿Remover este tripulante del vuelo?')) return;
    try {
        await adminService.removerTripulanteVuelo(vueloTripulacion.idVuelo, idTripulante);
        const [asignados, disponibles] = await Promise.all([
            adminService.obtenerTripulantesVuelo(vueloTripulacion.idVuelo),
            adminService.obtenerTripulantesDisponibles(vueloTripulacion.idVuelo)
        ]);
        setTripulantesAsignados(asignados);
        setTripulantesDisponibles(disponibles);
    } catch (err) {
        const errorMensaje = err.message || 'Error al remover tripulante';
        alert(errorMensaje);
    }
};

    if (loading) return (
        <div style={{ display: 'flex' }}>
            <Sidebar user={user} logout={logout} />
            <div className="admin-container">
                <div className="loading">Cargando vuelos...</div>
            </div>
        </div>
    );

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar user={user} logout={logout} />

            <div className="admin-container">
                <div className="admin-header">
                    <h1>Gestión de Vuelos</h1>
                    <button className="btn-primary" onClick={() => {
                        resetForm();
                        setShowModal(true);
                    }}>
                        + Nuevo Vuelo
                    </button>
                </div>

                {/* Filtros */}
                <div className="filtros-container">
                    <h3>Filtrar Vuelos</h3>
                    <div className="filtros-grid">
                        <div className="form-group">
                            <label>Origen</label>
                            <input
                                type="text"
                                placeholder="Buscar por origen..."
                                value={filtro.origen}
                                onChange={(e) => setFiltro(prev => ({ ...prev, origen: e.target.value }))}
                            />
                        </div>
                        <div className="form-group">
                            <label>Destino</label>
                            <input
                                type="text"
                                placeholder="Buscar por destino..."
                                value={filtro.destino}
                                onChange={(e) => setFiltro(prev => ({ ...prev, destino: e.target.value }))}
                            />
                        </div>
                        <div className="form-group">
                            <label>Estado</label>
                            <select
                                value={filtro.estado}
                                onChange={(e) => setFiltro(prev => ({ ...prev, estado: e.target.value }))}
                            >
                                <option value="">Todos</option>
                                <option value="P">Programado</option>
                                <option value="V">En Vuelo</option>
                                <option value="A">Aterrizado</option>
                                <option value="C">Cancelado</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label>&nbsp;</label>
                            <button
                                className="btn-primary"
                                onClick={() => setFiltro({ origen: '', destino: '', estado: '' })}
                                style={{ padding: '10px' }}
                            >
                                Limpiar Filtros
                            </button>
                        </div>
                    </div>
                </div>

                {/* Tabla de vuelos */}
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>Nº Vuelo</th>
                            <th>Aerolínea</th>
                            <th>Origen</th>
                            <th>Destino</th>
                            <th>Fecha Salida</th>
                            <th>Estado</th>
                            <th>Tarifas</th>
                            <th>Reservas</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {vuelosFiltrados.length === 0 ? (
                            <tr>
                                <td colSpan="9" style={{ textAlign: 'center' }}>No hay vuelos registrados</td>
                            </tr>
                        ) : (
                            vuelosFiltrados.map(vuelo => (
                                <tr key={vuelo.idVuelo}>
                                    <td><strong>{vuelo.numeroVuelo}</strong></td>
                                    <td>{vuelo.aerolineaNombre || getAerolineaNombre(vuelo.idAvion)}</td>
                                    <td>{vuelo.origen}</td>
                                    <td>{vuelo.destino}</td>
                                    <td>{new Date(vuelo.fechaSalida).toLocaleString()}</td>
                                    <td>
                                        <select
                                            className={`estado-select ${vuelo.estado}`}
                                            value={vuelo.estado}
                                            onChange={(e) => cambiarEstado(vuelo.idVuelo, e.target.value)}
                                        >
                                            <option value="P">Programado</option>
                                            <option value="V">En Vuelo</option>
                                            <option value="A">Aterrizado</option>
                                            <option value="C">Cancelado</option>
                                        </select>
                                    </td>
                                    <td>
                                        <div className="tarifas-list">
                                            {vuelo.tarifas?.map((tarifa, idx) => (
                                                <span key={idx} className="tarifa-badge">
                                                    {tarifa.clase}: ${tarifa.precio}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge pending">
                                            {vuelo.cantidadReservas || 0}
                                        </span>
                                    </td>
                                    <td>
                                        <button
                                            className="btn-edit"
                                            onClick={() => editarVuelo(vuelo)}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={() => eliminarVuelo(vuelo.idVuelo, vuelo.numeroVuelo)}
                                        >
                                            Eliminar
                                        </button>
                                        <button
                                        className="btn-toggle"
                                       onClick={() => abrirModalTripulacion(vuelo)}
                                         >
                                            Tripulación
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>

                {/* Modal para crear/editar vuelo */}
                {showModal && (
                    <div className="modal" onClick={() => setShowModal(false)}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                <h2 style={{ margin: 0 }}>{editando ? 'Editar Vuelo' : 'Nuevo Vuelo'}</h2>
                                <button
                                    onClick={() => {
                                        setShowModal(false);
                                        resetForm();
                                    }}
                                    style={{
                                        background: 'none',
                                        border: 'none',
                                        fontSize: '24px',
                                        cursor: 'pointer',
                                        color: '#999'
                                    }}
                                >
                                    ✕
                                </button>
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                                    gap: '20px',
                                    marginBottom: '20px'
                                }}>
                                    <div className="form-group">
                                        <label>Número de Vuelo *</label>
                                        <input
                                            type="text"
                                            name="numeroVuelo"
                                            value={formData.numeroVuelo}
                                            onChange={handleChange}
                                            placeholder="Ej: AV402"
                                            required
                                            style={{ width: '100%', boxSizing: 'border-box' }}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Estado</label>
                                        <select name="estado" value={formData.estado} onChange={handleChange} style={{ width: '100%' }}>
                                            <option value="P">Programado</option>
                                            <option value="V">En Vuelo</option>
                                            <option value="A">Aterrizado</option>
                                            <option value="C">Cancelado</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label>Origen *</label>
                                        <input
                                            type="text"
                                            name="origen"
                                            value={formData.origen}
                                            onChange={handleChange}
                                            placeholder="Ciudad de origen"
                                            required
                                            style={{ width: '100%', boxSizing: 'border-box' }}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Destino *</label>
                                        <input
                                            type="text"
                                            name="destino"
                                            value={formData.destino}
                                            onChange={handleChange}
                                            placeholder="Ciudad de destino"
                                            required
                                            style={{ width: '100%', boxSizing: 'border-box' }}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Fecha y Hora de Salida *</label>
                                        <input
                                            type="datetime-local"
                                            name="fechaSalida"
                                            value={formData.fechaSalida}
                                            onChange={handleChange}
                                            required
                                            style={{ width: '100%', boxSizing: 'border-box' }}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Fecha y Hora de Llegada *</label>
                                        <input
                                            type="datetime-local"
                                            name="fechaLlegada"
                                            value={formData.fechaLlegada}
                                            onChange={handleChange}
                                            required
                                            style={{ width: '100%', boxSizing: 'border-box' }}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label>Avión *</label>
                                        <select name="idAvion" value={formData.idAvion} onChange={handleChange} required style={{ width: '100%' }}>
                                            <option value="">Seleccione un avión</option>
                                            {aviones.map(avion => (
                                                <option key={avion.idAvion} value={avion.idAvion}>
                                                    {avion.modelo} - {avion.aerolineaNombre} (Cap: {avion.capacidad})
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                {/* Tarifas */}
                                <div className="tarifas-container" style={{ marginBottom: '25px' }}>
                                    <h3 style={{ marginBottom: '15px' }}>Tarifas</h3>
                                    {formData.tarifas.map((tarifa, index) => (
                                        <div key={index} style={{
                                            display: 'flex',
                                            gap: '10px',
                                            marginBottom: '10px',
                                            alignItems: 'center'
                                        }}>
                                            <input
                                                type="text"
                                                placeholder="Clase (Ej: Económica)"
                                                value={tarifa.clase}
                                                onChange={(e) => handleTarifaChange(index, 'clase', e.target.value)}
                                                style={{ flex: 2, padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                                                required
                                            />
                                            <input
                                                type="number"
                                                step="0.01"
                                                placeholder="Precio"
                                                value={tarifa.precio}
                                                onChange={(e) => handleTarifaChange(index, 'precio', e.target.value)}
                                                style={{ flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '6px' }}
                                                required
                                            />
                                            <button
                                                type="button"
                                                onClick={() => eliminarTarifa(index)}
                                                style={{
                                                    background: '#e74c3c',
                                                    color: 'white',
                                                    border: 'none',
                                                    padding: '10px 15px',
                                                    borderRadius: '6px',
                                                    cursor: 'pointer'
                                                }}
                                            >
                                                ✖
                                            </button>
                                        </div>
                                    ))}
                                    <button
                                        type="button"
                                        onClick={agregarTarifa}
                                        style={{
                                            background: '#667eea',
                                            color: 'white',
                                            border: 'none',
                                            padding: '10px 20px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            marginTop: '10px',
                                            fontWeight: '600'
                                        }}
                                    >
                                        + Agregar Tarifa
                                    </button>
                                </div>

                                <div className="modal-buttons" style={{
                                    display: 'flex',
                                    gap: '15px',
                                    justifyContent: 'flex-end',
                                    borderTop: '1px solid #eee',
                                    paddingTop: '20px'
                                }}>
                                    <button type="submit" className="btn-save">
                                        {editando ? 'Actualizar Vuelo' : 'Guardar Vuelo'}
                                    </button>
                                    <button
                                        type="button"
                                        className="btn-cancel"
                                        onClick={() => {
                                            setShowModal(false);
                                            resetForm();
                                        }}
                                    >
                                        Cancelar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
                {showModalTripulacion && (
    <div className="modal">
        <div className="modal-content" style={{ maxWidth: '650px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ margin: 0 }}>👨‍✈️ Tripulación - {vueloTripulacion?.numeroVuelo}</h3>
                <button onClick={() => setShowModalTripulacion(false)}
                    style={{ background: 'none', border: 'none', fontSize: '24px', cursor: 'pointer', color: '#999' }}>
                    ✕
                </button>
            </div>

            {loadingTripulacion ? (
                <p style={{ textAlign: 'center' }}>Cargando...</p>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                    {/* Tripulantes asignados */}
                    <div>
                        <h4 style={{ color: '#333', marginBottom: '10px' }}>
                            ✅ Asignados ({tripulantesAsignados.length})
                        </h4>
                        {tripulantesAsignados.length === 0 ? (
                            <p style={{ color: '#999', fontSize: '14px' }}>No hay tripulantes asignados</p>
                        ) : (
                            tripulantesAsignados.map(t => (
                                <div key={t.idTripulante} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '10px', borderRadius: '8px', border: '1px solid #eee',
                                    marginBottom: '8px', backgroundColor: '#f9f9f9'
                                }}>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>{t.nombre}</p>
                                        <p style={{ margin: 0, color: '#666', fontSize: '12px' }}>{t.cargo}</p>
                                    </div>
                                    <button className="btn-delete" style={{ padding: '4px 10px', fontSize: '12px' }}
                                        onClick={() => handleRemoverTripulante(t.idTripulante)}>
                                        Remover
                                    </button>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Tripulantes disponibles */}
                    <div>
                        <h4 style={{ color: '#333', marginBottom: '10px' }}>
                            ➕ Disponibles ({tripulantesDisponibles.length})
                        </h4>
                        {tripulantesDisponibles.length === 0 ? (
                            <p style={{ color: '#999', fontSize: '14px' }}>No hay tripulantes disponibles</p>
                        ) : (
                            tripulantesDisponibles.map(t => (
                                <div key={t.idTripulante} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '10px', borderRadius: '8px', border: '1px solid #eee',
                                    marginBottom: '8px', backgroundColor: '#f9f9f9'
                                }}>
                                    <div>
                                        <p style={{ margin: 0, fontWeight: '600', fontSize: '14px' }}>{t.nombre}</p>
                                        <p style={{ margin: 0, color: '#666', fontSize: '12px' }}>{t.cargo}</p>
                                    </div>
                                    <button className="btn-edit" style={{ padding: '4px 10px', fontSize: '12px' }}
                                        onClick={() => handleAsignarTripulante(t.idTripulante)}>
                                        Asignar
                                    </button>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}

            <div style={{ marginTop: '20px', textAlign: 'right' }}>
                <button className="btn-cancel" onClick={() => setShowModalTripulacion(false)}>
                    Cerrar
                </button>
            </div>
        </div>
    </div>
)}
            </div>
            
        </div>
    );
};

export default VuelosAdmin;