import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'

import Login from './pages/public/Login'
import Registro from './pages/public/Registro'
import Home from './pages/user/Home'
import CrearReserva from './pages/user/CrearReserva'
import MisReservas from './pages/user/MisReservas'
import DashboardAdmin from './pages/admin/DashboardAdmin'
import UsuariosAdmin from './pages/admin/UsuariosAdmin'
import AerolineasAdmin from './pages/admin/AerolineasAdmin'
import VuelosAdmin from './pages/admin/VuelosAdmin'
import AvionesAdmin from './pages/admin/AvionesAdmin'
import TripulantesAdmin from './pages/admin/TripulantesAdmin'
import ProtectedRoute from './components/common/ProtectedRoute'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" element={<Login />} />
      <Route path="/registro" element={<Registro />} />

      {/* Rutas protegidas de Usuario */}
      <Route path="/home" element={
        <ProtectedRoute><Home /></ProtectedRoute>
      } />
      <Route path="/crear-reserva" element={
        <ProtectedRoute><CrearReserva /></ProtectedRoute>
      } />
      <Route path="/mis-reservas" element={
        <ProtectedRoute><MisReservas /></ProtectedRoute>
      } />

      {/* Rutas protegidas de Administrador */}
      <Route path="/admin/dashboard" element={
        <ProtectedRoute requiereAdmin={true}><DashboardAdmin /></ProtectedRoute>
      } />
      <Route path="/admin/usuarios" element={
        <ProtectedRoute requiereAdmin={true}><UsuariosAdmin /></ProtectedRoute>
      } />
      <Route path="/admin/aerolineas" element={
        <ProtectedRoute requiereAdmin={true}><AerolineasAdmin /></ProtectedRoute>
      } />
      <Route path="/admin/vuelos" element={
        <ProtectedRoute requiereAdmin={true}><VuelosAdmin /></ProtectedRoute>
      } />
      <Route path="/admin/aviones" element={
        <ProtectedRoute requiereAdmin={true}><AvionesAdmin /></ProtectedRoute>
      } />
      <Route path="/admin/tripulantes" element={
        <ProtectedRoute requiereAdmin={true}><TripulantesAdmin /></ProtectedRoute>
      } />
    </Routes>
  )
}

export default App