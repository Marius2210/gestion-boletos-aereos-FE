import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children, requiereAdmin = false }) => {
    const { user, loading } = useAuth();

    if (loading) return <p>Cargando...</p>;

    // Si no está autenticado, manda al login
    if (!user) return <Navigate to="/login" />;

    // Si requiere admin y no es admin, manda al home
    if (requiereAdmin && user.rol !== 'ADMIN') return <Navigate to="/home" />;

    return children;
};

export default ProtectedRoute;