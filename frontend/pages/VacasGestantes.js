import React, { useEffect, useState, useMemo } from 'react';
import { Table, Container, Spinner, Alert, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import api from '../utils/axiosConfig';

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

function VacasGestantes() {
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

  const vacasGestantes = useMemo(
    () => historial.filter(v => v.gestante),
    [historial]
  );

  const vacasOrdenadas = useMemo(() => {
    let ordenadas = [...vacasGestantes];
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
  }, [vacasGestantes, sortConfig]);

  const requestSort = key => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  if (cargando) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
        <div>Cargando vacas gestantes...</div>
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
        Vacas Gestantes
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
          </tr>
        </thead>
        <tbody>
          {vacasOrdenadas.length === 0 && (
            <tr>
              <td colSpan={9} className="text-center">
                No hay vacas gestantes actualmente.
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

export default VacasGestantes;
