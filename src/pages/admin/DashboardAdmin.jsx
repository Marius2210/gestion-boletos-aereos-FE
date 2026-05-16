import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import Sidebar from '../../components/common/Sidebar';
import adminService from '../../services/adminService';
import '../../styles/Admin.css';

const DashboardAdmin = () => {
    const { user, logout } = useAuth();
    const [estadisticas, setEstadisticas] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        cargarEstadisticas();
    }, []);

    const cargarEstadisticas = async () => {
        try {
            const data = await adminService.getEstadisticas();
            setEstadisticas(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div>Cargando...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div style={{ display: 'flex' }}>
            <Sidebar user={user} logout={logout} />
            <div className="admin-container">
                <h1>Panel de Administración</h1>
                
                <div className="stats-grid">
                    <div className="stat-card">
                        <h3>Total Reservas</h3>
                        <p className="stat-number">{estadisticas?.totalReservas || 0}</p>
                    </div>
                    <div className="stat-card success">
                        <h3>Reservas Confirmadas</h3>
                        <p className="stat-number">{estadisticas?.reservasConfirmadas || 0}</p>
                    </div>
                    <div className="stat-card danger">
                        <h3>Reservas Canceladas</h3>
                        <p className="stat-number">{estadisticas?.reservasCanceladas || 0}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Vuelos Activos</h3>
                        <p className="stat-number">{estadisticas?.vuelosActivos || 0}</p>
                    </div>
                    <div className="stat-card">
                        <h3>Total Pagos</h3>
                        <p className="stat-number">{estadisticas?.totalPagos || 0}</p>
                    </div>
                    <div className="stat-card warning">
                        <h3>Total Reclamos</h3>
                        <p className="stat-number">{estadisticas?.totalReclamos || 0}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DashboardAdmin;