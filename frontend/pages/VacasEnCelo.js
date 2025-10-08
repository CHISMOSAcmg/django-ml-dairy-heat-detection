import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Table, Button, Container, Spinner, Alert } from 'react-bootstrap';
import api from '../utils/axiosConfig';
import { BiCheckCircle } from 'react-icons/bi';

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
  const dia = String(fecha.getDate()).padStart(2, '0');
  const mes = String(fecha.getMonth() + 1).padStart(2, '0');
  const anio = fecha.getFullYear();
  const hora = String(fecha.getHours()).padStart(2, '0');
  const minutos = String(fecha.getMinutes()).padStart(2, '0');
  return `${dia}/${mes}/${anio} ${hora}:${minutos}`;
}

function VacasEnCelo(props) {
  const navigate = useNavigate();
  const location = useLocation();

  const [historial, setHistorial] = useState(
    props.historial && props.historial.length > 0
      ? props.historial
      : location.state?.historial || []
  );
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [notificacion, setNotificacion] = useState(null);

  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

  useEffect(() => {
    if (!historial.length) {
      setCargando(true);
      api.get('/vacas/')
        .then(res => {
          setHistorial(res.data);
          setCargando(false);
        })
        .catch(() => {
          setError('Error al cargar los datos');
          setCargando(false);
        });
    }
  }, [historial.length]);

  const vacasFiltradas = useMemo(() => {
    return historial.filter(v => {
      const prediccion = Number(v.prediccion);
      const inseminada = v.inseminada === true;
      return prediccion > 70 && !inseminada;
    });
  }, [historial]);

  const vacasOrdenadas = useMemo(() => {
    let ordenadas = [...vacasFiltradas];
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
  }, [vacasFiltradas, sortConfig]);

  const requestSort = key => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const marcarInseminada = async (id, nombre) => {
    try {
      const fechaActual = new Date().toISOString();
      const response = await api.patch(`/vacas/${id}/`, {
        inseminada: true,
        fecha_inseminacion: fechaActual
      });
      setHistorial(historial =>
        historial.map(v =>
          v.id === id ? { ...v, inseminada: true, fecha_inseminacion: response.data.fecha_inseminacion || fechaActual } : v
        )
      );
      setNotificacion(
        `La vaca "${nombre}" ha sido marcada como inseminada. Mantener bajo vigilancia y confirmar en aproximadamente 21 días que no presente celo; de lo contrario, repetir inseminación.`
      );
      setTimeout(() => setNotificacion(null), 10000);
    } catch (error) {
      alert('Error al marcar como inseminada');
    }
  };

  if (cargando) {
    return (
      <Container className="mt-5 text-center">
        <Spinner animation="border" />
        <div>Cargando vacas...</div>
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
      <h2 className="mb-4 text-center" style={{ color: 'var(--green-dark)' }}>
        Vacas con Posible Celo (&gt; 70%)
      </h2>

      {notificacion && (
        <Alert variant="info" onClose={() => setNotificacion(null)} dismissible>
          {notificacion}
        </Alert>
      )}

      <Table className="modern-table" hover responsive>
        <thead>
          <tr>
            <th onClick={() => requestSort('nombre')} style={{ color: 'var(--green-dark)', cursor: 'pointer' }}>Nombre</th>
            <th onClick={() => requestSort('fecha')} style={{ color: 'var(--green-dark)', cursor: 'pointer' }}>Fecha</th>
            <th onClick={() => requestSort('actividad')} style={{ color: 'var(--green-dark)', cursor: 'pointer' }}>Actividad</th>
            <th onClick={() => requestSort('temperatura')} style={{ color: 'var(--green-dark)', cursor: 'pointer' }}>Temperatura</th>
            <th onClick={() => requestSort('dias_posparto')} style={{ color: 'var(--green-dark)', cursor: 'pointer' }}>Días posparto</th>
            <th onClick={() => requestSort('condicion')} style={{ color: 'var(--green-dark)', cursor: 'pointer' }}>Condición</th>
            <th onClick={() => requestSort('raza')} style={{ color: 'var(--green-dark)', cursor: 'pointer' }}>Raza</th>
            <th onClick={() => requestSort('parto_asistido')} style={{ color: 'var(--green-dark)', cursor: 'pointer' }}>Parto asistido</th>
            <th onClick={() => requestSort('prediccion')} style={{ color: 'var(--green-dark)', cursor: 'pointer' }}>Probabilidad (%)</th>
            <th style={{ color: 'var(--green-dark)' }}>Acción</th>
          </tr>
        </thead>
        <tbody>
          {vacasOrdenadas.map(v => (
            <tr key={v.id}>
              <td>{v.nombre}</td>
              <td>{formatearFecha(v.fecha)}</td>
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
                  className="btn-modern"
                  onClick={() => marcarInseminada(v.id, v.nombre)}
                  title="Marcar como inseminada"
                  style={{ borderColor: 'var(--green-teal)', color: 'var(--green-teal)' }}
                >
                  <BiCheckCircle style={{ marginBottom: '3px' }} /> Inseminada
                </Button>
              </td>
            </tr>
          ))}
          {vacasOrdenadas.length === 0 && (
            <tr>
              <td colSpan={10} className="text-center">
                No hay vacas con probabilidad de celo superior al 70%.
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <Button
        variant="secondary"
        className="btn-modern mt-3"
        onClick={() => navigate(-1)}
        style={{ background: 'var(--green-light)', borderColor: 'var(--green-teal)', color: 'var(--green-dark)' }}
      >
        Volver
      </Button>
    </Container>
  );
}

export default VacasEnCelo;
