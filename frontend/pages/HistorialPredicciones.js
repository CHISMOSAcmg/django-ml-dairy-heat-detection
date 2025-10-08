import React, { useEffect, useState } from 'react';
import { Container, Table, Spinner, Alert, Button, Form, Row, Col, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosConfig';

function HistorialPredicciones() {
  const [historial, setHistorial] = useState([]);
  const [filtrado, setFiltrado] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('fecha');
  const [sortAsc, setSortAsc] = useState(false);
  const [vacaModal, setVacaModal] = useState(null);
  const [filtroNombre, setFiltroNombre] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    api.get('/vacas/')
      .then(res => {
        setHistorial(res.data);
        setCargando(false);
      })
      .catch(() => {
        setError('Error al cargar los datos');
        setCargando(false);
      });
  }, []);

  useEffect(() => {
    const filtradoLower = filtroNombre.toLowerCase();
    const filtradoData = historial.filter(vaca =>
      vaca.nombre.toLowerCase().includes(filtradoLower)
    );
    setFiltrado(filtradoData);
  }, [filtroNombre, historial]);

  const ordenar = (col) => {
    if (sortBy === col) setSortAsc(!sortAsc);
    else {
      setSortBy(col);
      setSortAsc(true);
    }
  };

  const historialOrdenado = [...filtrado].sort((a, b) => {
    if (a[sortBy] < b[sortBy]) return sortAsc ? -1 : 1;
    if (a[sortBy] > b[sortBy]) return sortAsc ? 1 : -1;
    return 0;
  });

  const formatearFecha = (fechaIso) => {
    if (!fechaIso) return 'No';
    return new Date(fechaIso).toLocaleString();
  };

  // Función para determinar si una vaca puede ser reevaluada
  const puedeReevaluar = (vaca) => {
     if (!vaca) return false; // Protege contra null o undefined
  return !(vaca.inseminada || vaca.gestante);
};

  const handleEliminar = () => {
    if (!vacaModal) return;
    if (window.confirm(`¿Eliminar vaca "${vacaModal.nombre}"?`)) {
      api.delete(`/vacas/${vacaModal.id}/`)
        .then(() => {
          setHistorial(historial.filter(v => v.id !== vacaModal.id));
          setVacaModal(null);
        })
        .catch(() => alert('No se pudo eliminar el registro.'));
    }
  };

  const handleReevaluar = () => {
    if (!vacaModal) return;
    if (!puedeReevaluar(vacaModal)) {
      alert('Esta vaca ya ha sido inseminada o está gestante y no puede ser reevaluada.');
      return;
    }
    navigate('/formulario', { state: { vaca: vacaModal } });
  };

  if (cargando) return (
    <Container fluid className="d-flex justify-content-center align-items-center" style={{ height: '80vh' }}>
      <Spinner animation="border" />
    </Container>
  );
  if (error) return (
    <Container fluid><Alert variant="danger">{error}</Alert></Container>
  );

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center" style={{ color: 'var(--primary-700)' }}>Historial de Predicciones</h2>

      {/* Filtro */}
      <Row className="mb-3 justify-content-center">
        <Col xs={12} md={6}>
          <Form.Control
            type="text"
            placeholder="Buscar por nombre de vaca"
            value={filtroNombre}
            onChange={e => setFiltroNombre(e.target.value)}
            autoComplete="off"
          />
        </Col>
      </Row>

      {/* Tabla con encabezados centrados y hover destacado */}
      <Table className="modern-table" hover responsive>
        <thead>
          <tr>
            {['Nombre', 'Fecha de predicción', 'Probabilidad (%)', 'Estado reproductivo'].map((colName, idx) => (
              <th
                key={idx}
                onClick={() => ordenar(colName.toLowerCase().replace(/ /g, '_'))}
                style={{ cursor: 'pointer', padding: '16px 24px', whiteSpace: 'normal', textAlign: 'center' }}
                className={sortBy === colName.toLowerCase().replace(/ /g, '_') ? (sortAsc ? 'sorted-asc' : 'sorted-desc') : ''}
              >
                {colName} {sortBy === colName.toLowerCase().replace(/ /g, '_') ? (sortAsc ? '▲' : '▼') : ''}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {historialOrdenado.map(registro => (
            <tr
              key={registro.id}
              onDoubleClick={() => setVacaModal(registro)}
              style={{ cursor: 'pointer' }}
              title="Doble clic para ver detalles"
              className="table-row-hover"
            >
              <td style={{ whiteSpace: 'normal', padding: '16px 24px', textAlign: 'center' }}>{registro.nombre}</td>
              <td style={{ whiteSpace: 'normal', padding: '16px 24px', textAlign: 'center' }}>{formatearFecha(registro.fecha)}</td>
              <td style={{ whiteSpace: 'normal', padding: '16px 24px', textAlign: 'center' }}>{registro.prediccion?.toFixed(2)}</td>
              <td style={{ whiteSpace: 'normal', padding: '16px 24px', textAlign: 'center' }}>
                {registro.gestante
                  ? `Gestante desde ${formatearFecha(registro.fecha_gestacion)}`
                  : registro.inseminada
                    ? `Inseminada el ${formatearFecha(registro.fecha_inseminacion)}`
                    : 'No inseminada'}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal compacto y bien distribuido */}
      <Modal show={!!vacaModal} onHide={() => setVacaModal(null)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Detalles de {vacaModal?.nombre}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {vacaModal && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <div><strong>Nombre:</strong> {vacaModal.nombre}</div>
              <div><strong>Fecha de predicción:</strong> {formatearFecha(vacaModal.fecha)}</div>
              <div><strong>Actividad Física:</strong> {vacaModal.actividad}</div>
              <div><strong>Temperatura corporal:</strong> {vacaModal.temperatura}</div>
              <div><strong>Días posparto:</strong> {vacaModal.dias_posparto}</div>
              <div><strong>Condición corporal:</strong> {vacaModal.condicion}</div>
              <div><strong>Raza:</strong> {vacaModal.raza}</div>
              <div><strong>Parto asistido:</strong> {vacaModal.parto_asistido ? 'Sí' : 'No'}</div>
              <div><strong>Probabilidad de celo(%):</strong> {vacaModal.prediccion?.toFixed(2)}</div>
              <div><strong>Inseminada:</strong> {vacaModal.inseminada ? `Sí, el ${formatearFecha(vacaModal.fecha_inseminacion)}` : 'No'}</div>
              <div><strong>Gestante:</strong> {vacaModal.gestante ? `Sí, desde ${formatearFecha(vacaModal.fecha_gestacion)}` : 'No'}</div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="d-flex justify-content-between">
          <div>
            <Button variant="outline-danger" onClick={handleEliminar}>Eliminar</Button>{' '}
            <Button
  variant="outline-primary"
  onClick={handleReevaluar}
  disabled={!vacaModal || !puedeReevaluar(vacaModal)}
  title={
    vacaModal
      ? puedeReevaluar(vacaModal)
        ? `Reevaluar ${vacaModal.nombre}`
        : 'Esta vaca ya está inseminada o gestante y no puede ser reevaluada.'
      : 'Seleccione una vaca'
  }
>
  Reevaluar
</Button>
          </div>
          <Button variant="secondary" onClick={() => setVacaModal(null)}>Cerrar</Button>
        </Modal.Footer>
      </Modal>

      {/* Estilos adicionales */}
      <style type="text/css">{`
        .modern-table thead th {
          text-align: center !important;
        }
        .table-row-hover:hover {
          background-color: var(--primary-100);
          cursor: pointer;
          transition: background-color 0.2s ease;
        }
        .modal-body {
          padding-top: 1rem;
          padding-bottom: 1rem;
        }
        .modal-content {
          max-width: 700px;
          margin: auto;
        }
      `}</style>
    </Container>
  );
}

export default HistorialPredicciones;
