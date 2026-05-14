import { Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/public/Login'
import Registro from './pages/public/Registro'
import Home from './pages/user/Home'
import CrearReserva from './pages/user/CrearReserva'

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

      
    </Routes>
  )
}

export default App