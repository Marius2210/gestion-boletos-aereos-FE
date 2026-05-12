import { Routes, Route, Navigate } from 'react-router-dom'

import Login from './pages/public/Login'
import Registro from './pages/public/Registro'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />

      <Route path="/login" element={<Login />} />

      <Route path="/registro" element={<Registro />} />
    </Routes>
  )
}

export default App