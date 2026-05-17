import { Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/public/Login'
import Registro from './pages/public/Registro'
import Home from './pages/user/Home'
import CrearReserva from './pages/user/CrearReserva'
import MisReservas from './pages/user/MisReservas'
// Componentes de Administrador
import DashboardAdmin from './pages/admin/DashboardAdmin'
import UsuariosAdmin from './pages/admin/UsuariosAdmin'
import AerolineasAdmin from './pages/admin/AerolineasAdmin'
import VuelosAdmin from './pages/admin/VuelosAdmin'
import AvionesAdmin from './pages/admin/AvionesAdmin'
import TripulantesAdmin from './pages/admin/TripulantesAdmin'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />

      <Route path="/registro" element={<Registro />} />

      {/* Ruta Privada del Usuario */}
      <Route path="/home" element={<Home />} />

      {/* ruta de crear una reserva */}
      <Route path="/crear-reserva" element={<CrearReserva />} />

       {/* ruta para ver la reservas */}
      <Route path="/mis-reservas" element={<MisReservas />} /> 

      {/* Rutas de Administrador */}
      <Route path="/admin/dashboard" element={<DashboardAdmin />} />
      <Route path="/admin/usuarios" element={<UsuariosAdmin />} />
      <Route path="/admin/aerolineas" element={<AerolineasAdmin />} />
      <Route path="/admin/vuelos" element={<VuelosAdmin />} />
      <Route path="/admin/aviones" element={<AvionesAdmin />} />
      <Route path="/admin/tripulantes" element={<TripulantesAdmin />} />
      
    </Routes>
  )
}

export default App