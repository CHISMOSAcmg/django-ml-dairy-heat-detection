import React from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import AppNavbar from './components/Navbar';
import Footer from './components/Footer';
import Inicio from './pages/Inicio';
import FormularioPrediccion from './pages/FormularioPrediccion';
import HistorialPredicciones from './pages/HistorialPredicciones';
import Dashboard from './pages/Dashboard';
import Resultado from './pages/Resultado';
import VacasEnCelo from './pages/VacasEnCelo';
import VacasInseminadas from './pages/VacasInseminadas';
import VacasGestantes from './pages/VacasGestantes';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import UserManagement from './pages/UserManagement';
import './styles/theme.css';
import Reportes from './pages/Reportes';


function AppContent() {
  const location = useLocation();
  const hideNavbarRoutes = ['/login'];

  return (
    <div className="app-wrapper">
      {!hideNavbarRoutes.includes(location.pathname) && <AppNavbar />}
      <main className="app-content">
        <div className="container my-4">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/admin/users"
            element={
              <PrivateRoute roles={['admin']}>
                <UserManagement />
              </PrivateRoute>
            }
          />
          <Route
            path="/"
            element={
              <PrivateRoute>
                <Inicio />
              </PrivateRoute>
            }
          />
          <Route
            path="/formulario"
            element={
              <PrivateRoute>
                <FormularioPrediccion />
              </PrivateRoute>
            }
          />
          <Route
            path="/historial"
            element={
              <PrivateRoute>
                <HistorialPredicciones />
              </PrivateRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/resultado"
            element={
              <PrivateRoute>
                <Resultado />
              </PrivateRoute>
            }
          />
          <Route
            path="/vacas-en-celo"
            element={
              <PrivateRoute>
                <VacasEnCelo />
              </PrivateRoute>
            }
          />
          <Route
            path="/vacas-inseminadas"
            element={
              <PrivateRoute>
                <VacasInseminadas />
              </PrivateRoute>
            }
          />
          <Route
            path="/vacas-gestantes"
            element={
              <PrivateRoute>
                <VacasGestantes />
              </PrivateRoute>
            }
          />
                      <Route path="/reportes" element={
              <PrivateRoute>
                <Reportes />
              </PrivateRoute>
            } />
          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </div>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
