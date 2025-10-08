import React from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import nubes from '../images/nubes.png';
import { BiBulb, BiChip, BiBarChartAlt2, BiCloud, BiTrendingUp } from 'react-icons/bi';
import { useNavigate } from 'react-router-dom';

function Inicio() {
  const navigate = useNavigate();

  const curiosidades = [
    {
      texto: "El 85% de las vacas muestran celo entre 45-60 días posparto",
      icono: <BiBulb style={{ color: 'var(--primary-500)', fontSize: '2rem', marginBottom: '1rem' }} />
    },
    {
      texto: "La temperatura rectal durante el celo aumenta en 0.5-1°C",
      icono: <BiBarChartAlt2 style={{ color: 'var(--primary-500)', fontSize: '2rem', marginBottom: '1rem' }} />
    },
    {
      texto: "La actividad física se duplica durante el periodo de celo",
      icono: <BiTrendingUp style={{ color: 'var(--primary-500)', fontSize: '2rem', marginBottom: '1rem' }} />
    },
    {
      texto: "La inteligencia artificial puede detectar celos con más del 90% de precisión usando sensores y datos históricos",
      icono: <BiChip style={{ color: 'var(--primary-500)', fontSize: '2rem', marginBottom: '1rem' }} />
    },
    {
      texto: "Los sistemas de monitoreo en la nube permiten alertar en tiempo real sobre cambios en la salud de las vacas",
      icono: <BiCloud style={{ color: 'var(--primary-500)', fontSize: '2rem', marginBottom: '1rem' }} />
    },
    {
      texto: "El uso de IA en ganadería ayuda a reducir los días abiertos y mejorar la eficiencia reproductiva",
      icono: <BiBulb style={{ color: 'var(--primary-500)', fontSize: '2rem', marginBottom: '1rem' }} />
    }
  ];

  const handleComenzarPrediccion = () => {
    navigate('/formulario');
  };

  return (
    <Container
      className="hero-section mt-5"
      style={{
        position: 'relative',
        borderRadius: '16px',
        overflow: 'hidden',
        minHeight: '400px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
      }}
    >
      <div
        className="hero-background"
        style={{
          backgroundImage: `url(${nubes})`,
          backgroundRepeat: 'repeat',
          backgroundSize: 'cover',
          filter: 'blur(4px)',
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          opacity: 0.15,
          zIndex: 0
        }}
      />
      <Row className="hero-content justify-content-center" style={{ position: 'relative', zIndex: 1 }}>
        <Col md={10} className="text-center mb-5">
          <h1 className="display-4 fw-bold mb-4" style={{ color: 'var(--primary-700)' }}>
            Bienvenido a CeloPredictor
          </h1>
          <p className="lead mb-4" style={{ color: 'var(--text-primary)' }}>
            Sistema inteligente para la predicción de celos posparto en vacas lecheras
          </p>
          <Button
            className="btn-modern btn-modern-primary px-5 py-2"
            onClick={handleComenzarPrediccion}
          >
            Comenzar predicción
          </Button>
        </Col>
        <Col md={10}>
          <Row className="g-4">
            {curiosidades.map((curio, index) => (
              <Col key={index} xs={12} sm={6} md={4}>
                <div className="curiosity-card h-100 text-center p-3" style={{
                  background: '#fff',
                  borderRadius: 12,
                  boxShadow: '0 2px 8px rgba(51,102,255,0.07)',
                  minHeight: 140,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {curio.icono}
                  <p className="mb-0" style={{ color: 'var(--text-secondary)', fontSize: 15 }}>{curio.texto}</p>
                </div>
              </Col>
            ))}
          </Row>
        </Col>
      </Row>
    </Container>
  );
}

export default Inicio;
