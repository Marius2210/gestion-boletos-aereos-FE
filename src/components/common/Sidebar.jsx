import React from 'react';
import '../../styles/Sidebar.css';

const Sidebar = ({ user, logout }) => {
    return (
        <div className="sidebar">
            <h2 className="sidebar-logo"> AeroBooking</h2>

            <div className="sidebar-user">
                 {user?.email}
            </div>

            <nav className="sidebar-menu">
                <button> Inicio</button>
                <button> Mis Reservas</button>
                <button> Buscar Vuelos</button>
            </nav>

            <button onClick={logout} className="sidebar-logout">
                Cerrar sesión
            </button>
        </div>
    );
};

export default Sidebar;