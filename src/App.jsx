import { Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/public/Login'
import Registro from './pages/public/Registro'
import Home from './pages/user/Home'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />

      <Route path="/registro" element={<Registro />} />

      {/* Ruta Privada del Usuario */}
      <Route path="/home" element={<Home />} />

      
    </Routes>
  )
}

export default App