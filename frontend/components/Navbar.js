// src/components/Navbar.js
import React from 'react';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import UserMenu from './UserMenu';

// Importa los iconos que necesites
import { 
  FaChartLine,      // Icono para Modelo de Predicción
  FaHistory,        // Icono para Historial
  FaTachometerAlt,  // Icono para Panel Informativo
  FaFileExport,     // Icono para Reportes
  FaUsersCog        // Icono para Gestión de Usuarios
} from 'react-icons/fa';

function AppNavbar() {
  const { user } = useAuth();
  return (
    <Navbar bg="primary" variant="dark" expand="md">
      <Container>
        <Navbar.Brand as={Link} to="/">CeloPredictor</Navbar.Brand>
        <Navbar.Toggle aria-controls="main-navbar-nav" />
        <Navbar.Collapse id="main-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/formulario" className="d-flex align-items-center">
              <FaChartLine className="me-2" />
              <span>Modelo de Predicción</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/historial" className="d-flex align-items-center">
              <FaHistory className="me-2" />
              <span>Historial de Predicciones</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/dashboard" className="d-flex align-items-center">
              <FaTachometerAlt className="me-2" />
              <span>Panel Informativo</span>
            </Nav.Link>
            <Nav.Link as={Link} to="/reportes" className="d-flex align-items-center">
              <FaFileExport className="me-2" />
              <span>Reportes a Excel</span>
            </Nav.Link>
            {/* Solo visible para admins */}
            {user && user.role === 'admin' && (
              <Nav.Link as={Link} to="/admin/users" className="d-flex align-items-center">
                <FaUsersCog className="me-2" />
                <span>Gestión de Usuarios</span>
              </Nav.Link>
            )}
          </Nav>
          <div className="ms-auto">
            <UserMenu />
          </div>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default AppNavbar;
