import { useNavigate } from 'react-router-dom';
import React from 'react';
import '../../styles/Sidebar.css';

const Sidebar = ({ user, logout }) => {

  const navigate = useNavigate();
    return (
        <div className="sidebar">
            <h2 className="sidebar-logo"> AeroBooking</h2>

            <div className="sidebar-user">
                 {user?.email}
            </div>

            <nav className="sidebar-menu">
               <button onClick={() => navigate("/home")}>
                Inicio
               </button>
                <button onClick={() => navigate("/mis-reservas")}>
                    Mis Reservas
                </button>

                {user?.rol === 'ADMIN' && (
                    <>
                        <button onClick={() => navigate("/admin/dashboard")}>
                            Dashboard
                        </button>
                        <button onClick={() => navigate("/admin/usuarios")}>
                            Usuarios
                        </button>
                        <button onClick={() => navigate("/admin/aerolineas")}>
                            Aerolíneas
                        </button>
                        <button onClick={() => navigate("/admin/vuelos")}>
                            Vuelos
                        </button>
                        <button onClick={() => navigate("/admin/aviones")}>
                         Aviones
                        </button>
                        <button onClick={() => navigate("/admin/tripulantes")}>
                         Tripulación
                        </button>
                    </>
                )}
                
            </nav>

            <button onClick={logout} className="sidebar-logout">
                Cerrar sesión
            </button>

              

        </div>
    );
};

export default Sidebar;