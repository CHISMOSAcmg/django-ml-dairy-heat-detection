import React, { useState, useEffect } from 'react';
import { Card, Button, Row, Col, Container, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { FaSearch, FaSyringe, FaBaby } from 'react-icons/fa';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import api from '../utils/axiosConfig';

ChartJS.register(ArcElement, Tooltip, Legend);

function Dashboard() {
  const navigate = useNavigate();
  const [vacas, setVacas] = useState([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    api.get('/vacas/')
      .then(res => {
        setVacas(res.data);
        setCargando(false);
      })
      .catch(() => setCargando(false));
  }, []);

  const cantidad = vacas.length;
  const posiblesCelo = vacas.filter(v => Number(v.prediccion) > 70 && !v.inseminada);
  const inseminadas = vacas.filter(v => v.inseminada && !v.gestante);
  const gestantes = vacas.filter(v => v.gestante);
  const otras = cantidad - (posiblesCelo.length + inseminadas.length + gestantes.length);

  const promedio = cantidad > 0
    ? (vacas.reduce((acc, v) => acc + Number(v.prediccion || 0), 0) / cantidad).toFixed(2)
    : '0.00';

  const data = {
    labels: ['Posible Celo', 'Inseminadas', 'Gestantes', 'Otras'],
    datasets: [
      {
        label: 'Cantidad de vacas',
        data: [posiblesCelo.length, inseminadas.length, gestantes.length, otras],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)',
          'rgba(54, 162, 235, 0.6)',
          'rgba(255, 206, 86, 0.6)',
          'rgba(201, 203, 207, 0.6)'
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(201, 203, 207, 1)'
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'bottom' },
      tooltip: { enabled: true },
    },
  };

  if (cargando) {
    return (
      <div style={{ textAlign: 'center', marginTop: '2rem' }}>
        <Spinner animation="border" role="status" />
        <div>Cargando datos...</div>
      </div>
    );
  }

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={12}>
          <Card className="text-center shadow mb-4">
            <Card.Body>
              <Card.Title as="h4" className="mb-3">
                Panel reproductivo general
              </Card.Title>
              <Row className="mb-4">
                {[{
                  title: 'Vacas estudiadas',
                  value: cantidad,
                  variant: 'light'
                }, {
                  title: 'Vacas con posible celo',
                  value: posiblesCelo.length,
                  variant: 'light'
                }, {
                  title: 'Vacas inseminadas',
                  value: inseminadas.length,
                  variant: 'light'
                }, {
                  title: 'Vacas gestantes',
                  value: gestantes.length,
                  variant: 'light'
                }, {
                  title: 'Promedio de predicción',
                  value: `${promedio}%`,
                  variant: 'light',
                  md: 4
                }].map(({ title, value, variant, md }, idx) => (
                  <Col key={idx} xs={12} md={md || 2}>
                    <Card bg={variant} className="mb-2">
                      <Card.Body>
                        <Card.Subtitle className="mb-1 text-muted">{title}</Card.Subtitle>
                        <Card.Text style={{ fontSize: '2rem', fontWeight: 'bold' }}>{value}</Card.Text>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              <Row className="mb-3">
                <Col md={4} className="mb-2">
                  <Button
                    variant="success"
                    size="lg"
                    className="w-100 btn-modern"
                    style={{ fontWeight: 'bold', letterSpacing: '1px' }}
                    onClick={() => navigate('/vacas-en-celo')}
                  >
                    <FaSearch style={{ marginRight: '8px' }} />
                    Vacas con posible celo
                    <span className="badge bg-light text-dark ms-2">{posiblesCelo.length}</span>
                  </Button>
                </Col>
                <Col md={4} className="mb-2">
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-100 btn-modern"
                    style={{ fontWeight: 'bold', letterSpacing: '1px' }}
                    onClick={() => navigate('/vacas-inseminadas')}
                  >
                    <FaSyringe style={{ marginRight: '8px' }} />
                    Vacas inseminadas
                    <span className="badge bg-light text-dark ms-2">{inseminadas.length}</span>
                  </Button>
                </Col>
                <Col md={4} className="mb-2">
                  <Button
                    variant="warning"
                    size="lg"
                    className="w-100 btn-modern"
                    style={{ fontWeight: 'bold', letterSpacing: '1px' }}
                    onClick={() => navigate('/vacas-gestantes')}
                  >
                    <FaBaby style={{ marginRight: '8px' }} />
                    Vacas gestantes
                    <span className="badge bg-light text-dark ms-2">{gestantes.length}</span>
                  </Button>
                </Col>
              </Row>

              <Row className="mt-4 justify-content-center">
                <Col md={6}>
                  <Pie data={data} options={options} />
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Dashboard;
