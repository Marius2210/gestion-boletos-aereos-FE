import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/common/Sidebar';
import adminService from '../../services/adminService';
import '../../styles/Admin.css';

const UsuariosAdmin = () => {
    const { user, logout } = useAuth();
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        cargarUsuarios();
    }, []);

    const cargarUsuarios = async () => {
        try {
            const data = await adminService.listarUsuarios();
            setUsuarios(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const toggleEstado = async (id, activo) => {
        if (window.confirm(`¿Estás seguro de ${activo ? 'desactivar' : 'activar'} este usuario?`)) {
            try {
                await adminService.toggleUsuarioEstado(id);
                cargarUsuarios(); // Recargar lista
            } catch (err) {
                alert(err.message);
            }
        }
    };

    const eliminarUsuario = async (id, email) => {
        if (window.confirm(`¿Estás seguro de eliminar al usuario ${email}?`)) {
            try {
                await adminService.eliminarUsuario(id);
                cargarUsuarios();
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
                <h1>Gestión de Usuarios</h1>
                
                <table className="admin-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Email</th>
                            <th>Rol</th>
                            <th>Estado</th>
                            <th>Nombre</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {usuarios.map(usuario => (
                            <tr key={usuario.idUsuario}>
                                <td>{usuario.idUsuario}</td>
                                <td>{usuario.email}</td>
                                <td>{usuario.rol}</td>
                                <td>
                                    <span className={`badge ${usuario.activo ? 'active' : 'inactive'}`}>
                                        {usuario.activo ? 'Activo' : 'Inactivo'}
                                    </span>
                                </td>
                                <td>{usuario.pasajero?.nombreCompleto || '-'}</td>
                                <td>
                                    <button 
                                        className="btn-toggle"
                                        onClick={() => toggleEstado(usuario.idUsuario, usuario.activo)}
                                    >
                                        {usuario.activo ? 'Desactivar' : 'Activar'}
                                    </button>
                                    {usuario.rol !== 'ADMIN' && (
                                        <button 
                                            className="btn-delete"
                                            onClick={() => eliminarUsuario(usuario.idUsuario, usuario.email)}
                                        >
                                            Eliminar
                                        </button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default UsuariosAdmin;