import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/axiosConfig';

function FormularioPrediccion() {
  const location = useLocation();
  const navigate = useNavigate();
  const vacaParaEditar = location.state?.vaca;

  const [form, setForm] = useState({
    nombre: '',
    actividad: '',
    temperatura: '',
    dias_posparto: '',
    condicion: '',
    raza: '',
    parto_asistido: ''
  });
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState(null);
  const [advertenciaTemp, setAdvertenciaTemp] = useState('');

  useEffect(() => {
    if (vacaParaEditar) {
      setForm({
        nombre: vacaParaEditar.nombre || '',
        actividad: vacaParaEditar.actividad?.toString() || '',
        temperatura: vacaParaEditar.temperatura?.toString() || '',
        dias_posparto: vacaParaEditar.dias_posparto?.toString() || '',
        condicion: vacaParaEditar.condicion?.toString() || '',
        raza: vacaParaEditar.raza || '',
        parto_asistido: vacaParaEditar.parto_asistido ? '1' : '0'
      });
    }
  }, [vacaParaEditar]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));

    if (name === 'temperatura') {
      const tempNum = parseFloat(value);
      if (value !== '' && (tempNum < 37 || tempNum > 39)) {
        setAdvertenciaTemp('Revisar vaca: alta posibilidad de enfermedad. No proceder al ciclo reproductivo hasta que esté saludable.');
      } else {
        setAdvertenciaTemp('');
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setEnviando(true);
    setError(null);

    const tempNum = parseFloat(form.temperatura);
    if (tempNum < 37 || tempNum > 39) {
      setError('Temperatura corporal fuera del rango saludable (37-39 °C). Por favor, revise la vaca antes de proceder.');
      setEnviando(false);
      return;
    }

    const payload = {
    nombre: form.nombre,
    actividad: Number(form.actividad),
    temperatura: Number(form.temperatura),
    dias_posparto: Number(form.dias_posparto),
    condicion: Number(form.condicion),
    raza: form.raza,
    parto_asistido: Number(form.parto_asistido),
  };

  if (vacaParaEditar) {
    api.put(`/vacas/${vacaParaEditar.id}/reevaluar/`, payload)
      .then(res => {
        setEnviando(false);
        navigate('/resultado', { state: { resultado: res.data } });
      })
      .catch(err => {
        setError(err.response?.data || 'Error al actualizar la predicción');
        setEnviando(false);
      });
  } else {
    api.post('/predecir/', payload)
      .then(res => {
        setEnviando(false);
        navigate('/resultado', { state: { resultado: res.data } });
      })
      .catch(err => {
        setError('Error al enviar los datos');
        setEnviando(false);
      });
  }
};

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <h2 className="mb-4 text-center">Modelo de Predicción de Celo</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="nombre">
              <Form.Label>Nombre de la vaca</Form.Label>
              <Form.Control
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                required
                placeholder="Ingrese el nombre"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="actividad">
              <Form.Label>Actividad Física</Form.Label>
              <Form.Control
                type="number"
                name="actividad"
                value={form.actividad}
                onChange={handleChange}
                required
                placeholder="Ingrese el nivel de actividad"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="temperatura">
              <Form.Label>Temperatura corporal (&deg;C)</Form.Label>
              <Form.Control
                type="number"
                name="temperatura"
                value={form.temperatura}
                onChange={handleChange}
                required
                placeholder="Ingrese la temperatura"
                step="0.1"
                min="35"
                max="42"
              />
              {advertenciaTemp && <Alert variant="warning" className="mt-2">{advertenciaTemp}</Alert>}
            </Form.Group>
            <Form.Group className="mb-3" controlId="dias_posparto">
              <Form.Label>Días posparto</Form.Label>
              <Form.Control
                type="number"
                name="dias_posparto"
                value={form.dias_posparto}
                onChange={handleChange}
                required
                placeholder="Ingrese los días posparto"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="condicion">
              <Form.Label>Condición corporal (1-5)</Form.Label>
              <Form.Control
                type="number"
                name="condicion"
                value={form.condicion}
                onChange={handleChange}
                required
                min={1}
                max={5}
                step={0.1}
                placeholder="Ingrese la condición corporal (ej: 3.5)"
              />
            </Form.Group>
            <Form.Group className="mb-4" controlId="raza">
              <Form.Label>Raza</Form.Label>
              <Form.Select
                name="raza"
                value={form.raza}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione una raza</option>
                <option value="SIB">Siboney de Cuba</option>
                <option value="MAM">Mambi de Cuba</option>
                <option value="TAI">Taino</option>
                <option value="CRI">Criolla</option>
                <option value="CEB">Cebu</option>
                <option value="CRU">Cruzamiento</option>
                <option value="CHA">Chacuba</option>
                <option value="HOL">Holstein</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-4" controlId="parto_asistido">
              <Form.Label>¿Tuvo parto asistido previo?</Form.Label>
              <Form.Select
                name="parto_asistido"
                value={form.parto_asistido}
                onChange={handleChange}
                required
              >
                <option value="">Seleccione</option>
                <option value="1">Sí</option>
                <option value="0">No</option>
              </Form.Select>
            </Form.Group>
            <div className="d-grid">
              <Button variant="primary" type="submit" disabled={enviando}>
                {enviando ? <Spinner animation="border" size="sm" /> : (vacaParaEditar ? 'Actualizar Predicción' : 'Predecir Celo')}
              </Button>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}

export default FormularioPrediccion;
