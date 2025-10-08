import React, { useEffect, useState, useMemo } from 'react';
import { Table, Button, Container, Spinner, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosConfig';
import { BiCheckDouble, BiRefresh } from 'react-icons/bi';

const razasNombres = {
  SIB: 'Siboney de Cuba',
  MAM: 'Mambi de Cuba',
  TAI: 'Taino',
  CRI: 'Criolla',
  CEB: 'Cebu',
  CRU: 'Cruzamiento',
  CHA: 'Chacuba',
  HOL: 'Holstein'
};

function formatearFecha(fechaIso) {
  if (!fechaIso) return '';
  const fecha = new Date(fechaIso);
  return `${fecha.getDate().toString().padStart(2, '0')}/${(fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()} ${fecha.getHours().toString().padStart(2, '0')}:${fecha.getMinutes().toString().padStart(2, '0')}`;
}

function VacasInseminadas() {
  const [historial, setHistorial] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState(null);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
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

  const vacasInseminadas = useMemo(
    () => historial.filter(v => v.inseminada && !v.gestante),
    [historial]
  );

  const vacasOrdenadas = useMemo(() => {
    let ordenadas = [...vacasInseminadas];
    if (sortConfig.key !== null) {
      ordenadas.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }
    return ordenadas;
  }, [vacasInseminadas, sortConfig]);

  const requestSort = key => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const declararGestante = async (id) => {
    try {
      const fechaActual = new Date().toISOString();
      await api.patch(`/vacas/${id}/`, { gestante: true, fecha_gestacion: fechaActual });
      setHistorial(historial =>
        historial.map(v =>
          v.id === id ? { ...v, gestante: true, fecha_gestacion: fechaActual } : v
        )
      );
    } catch (error) {
      alert('Error al declarar gestante');
    }
  };

  const volverAInseminar = async (id) => {
    try {
      const fechaActual = new Date().toISOString();
      await api.patch(`/vacas/${id}/`, { inseminada: true, gestante: false, fecha_inseminacion: fechaActual });
      setHistorial(historial =>
        historial.map(v =>
          v.id === id ? { ...v, inseminada: true, gestante: false, fecha_inseminacion: fechaActual, fecha_gestacion: null } : v
        )
      );
    } catch (error) {
      alert('Error al volver a inseminar');
    }
  };

  if (cargando) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
        <div>Cargando vacas inseminadas...</div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center" style={{ color: 'var(--primary-700)' }}>
        Vacas Inseminadas (pendiente de diagnóstico)
      </h2>
      <Table className="modern-table" hover responsive>
        <thead>
          <tr>
            <th onClick={() => requestSort('nombre')}>Nombre</th>
            <th onClick={() => requestSort('fecha_inseminacion')}>Fecha inseminación</th>
            <th onClick={() => requestSort('actividad')}>Actividad</th>
            <th onClick={() => requestSort('temperatura')}>Temperatura</th>
            <th onClick={() => requestSort('dias_posparto')}>Días posparto</th>
            <th onClick={() => requestSort('condicion')}>Condición</th>
            <th onClick={() => requestSort('raza')}>Raza</th>
            <th onClick={() => requestSort('parto_asistido')}>Parto asistido</th>
            <th onClick={() => requestSort('prediccion')}>Probabilidad (%)</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {vacasOrdenadas.length === 0 && (
            <tr>
              <td colSpan={10} className="text-center">
                No hay vacas inseminadas pendientes de diagnóstico.
              </td>
            </tr>
          )}
          {vacasOrdenadas.map(v => (
            <tr key={v.id}>
              <td>{v.nombre}</td>
              <td>{formatearFecha(v.fecha_inseminacion)}</td>
              <td>{v.actividad}</td>
              <td>{v.temperatura}</td>
              <td>{v.dias_posparto}</td>
              <td>{v.condicion}</td>
              <td>{razasNombres[v.raza] || v.raza}</td>
              <td>{v.parto_asistido ? "Sí" : "No"}</td>
              <td>{v.prediccion?.toFixed(2)}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="btn-modern me-2"
                  onClick={() => declararGestante(v.id)}
                  title="Declarar gestante"
                >
                  <BiCheckDouble style={{ marginBottom: '3px' }} /> Gestante
                </Button>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="btn-modern"
                  onClick={() => volverAInseminar(v.id)}
                  title="Volver a inseminar"
                >
                  <BiRefresh style={{ marginBottom: '3px' }} /> Volver a inseminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Button
        variant="secondary"
        className="btn-modern mt-3"
        onClick={() => navigate('/dashboard')}
      >
        Volver
      </Button>
    </Container>
  );
}

export default VacasInseminadas;
