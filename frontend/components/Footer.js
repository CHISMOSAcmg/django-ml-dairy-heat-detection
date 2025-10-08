import React from 'react';
import { Container } from 'react-bootstrap';
import { FaUniversity, FaCopyright } from 'react-icons/fa'; // Ejemplo de iconos

function Footer() {
  return (
    <footer className="bg-green-light text-green-dark py-3 mt-5 border-top border-green-teal">
      <Container className="text-center">
        <small>
          <FaCopyright className="me-1" />
          {new Date().getFullYear()} CeloPredictor &middot; Universidad de Camagüey
          <FaUniversity className="ms-2" />
        </small>
      </Container>
    </footer>
  );
}

export default Footer;
