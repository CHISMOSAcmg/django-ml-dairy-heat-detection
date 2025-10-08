import React, { useState, useEffect } from 'react';
import { Container, Form, Button, Table, Spinner, Alert } from 'react-bootstrap';
import api from '../utils/axiosConfig';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

const opcionesTablas = [
  { key: 'usuarios', label: 'Usuarios' },
  { key: 'vacas_general', label: 'Vacas (todas)' },
  { key: 'vacas_celo', label: 'Vacas en posible celo' },
  { key: 'vacas_gestantes', label: 'Vacas gestantes' },
  { key: 'vacas_inseminadas', label: 'Vacas inseminadas' }
];

const Reportes = () => {
  const [tablaSeleccionada, setTablaSeleccionada] = useState(opcionesTablas[0].key);
  const [datos, setDatos] = useState([]);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      setError('');
      try {
        let response;
        switch (tablaSeleccionada) {
          case 'usuarios':
            response = await api.get('/users/');
            setDatos(response.data);
            break;
          case 'vacas_general':
            response = await api.get('/vacas/');
            setDatos(response.data);
            break;
          case 'vacas_celo':
            response = await api.get('/vacas/');
            setDatos(response.data.filter(v => v.prediccion > 70 && !v.inseminada));
            break;
          case 'vacas_gestantes':
            response = await api.get('/vacas/');
            setDatos(response.data.filter(v => v.gestante));
            break;
          case 'vacas_inseminadas':
            response = await api.get('/vacas/');
            setDatos(response.data.filter(v => v.inseminada && !v.gestante));
            break;
          default:
            setDatos([]);
        }
      } catch (err) {
        setError('Error al cargar los datos');
        setDatos([]);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [tablaSeleccionada]);

  const exportarDatos = () => {
    if (datos.length === 0) return;
    const ws = XLSX.utils.json_to_sheet(datos);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, tablaSeleccionada);
    const wbout = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    saveAs(
      new Blob([wbout], { type: 'application/octet-stream' }),
      `reporte_${tablaSeleccionada}_${new Date().toISOString().slice(0, 10)}.xlsx`
    );
  };

  const renderHeaders = () => {
    switch (tablaSeleccionada) {
      case 'usuarios':
        return (
          <>
            <th>Usuario</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Finca</th>
            <th>Teléfono</th>
          </>
        );
      case 'vacas_general':
        return (
          <>
            <th>Nombre</th>
            <th>Raza</th>
            <th>Temperatura Corporal</th>
            <th>Condición Corporal</th>
            <th>Gestante</th>
            <th>Inseminada</th>
            <th>Probabilidad de celo (%)</th>
            <th>Fecha</th>
          </>
        );
      case 'vacas_celo':
        return (
          <>
            <th>Nombre</th>
            <th>Probabilidad (%)</th>
            <th>Fecha</th>
            <th>Actividad Física</th>
            <th>Temperatura corporal</th>
          </>
        );
      case 'vacas_gestantes':
      case 'vacas_inseminadas':
        return (
          <>
            <th>Nombre</th>
            <th>Fecha inseminación</th>
            <th>Días posparto</th>
            <th>Condición</th>
            <th>Raza</th>
          </>
        );
      default:
        return null;
    }
  };

  const renderRows = () => {
    if (datos.length === 0) {
      return (
        <tr>
          <td colSpan="100%" className="text-center">No hay datos para mostrar.</td>
        </tr>
      );
    }

    switch (tablaSeleccionada) {
      case 'usuarios':
        return datos.map(user => (
          <tr key={user.id}>
            <td>{user.username}</td>
            <td>{user.email}</td>
            <td>{user.role}</td>
            <td>{user.farm}</td>
            <td>{user.phone}</td>
          </tr>
        ));
      case 'vacas_general':
        return datos.map(vaca => (
          <tr key={vaca.id}>
            <td>{vaca.nombre}</td>
            <td>{vaca.raza}</td>
            <td>{vaca.temperatura}</td>
            <td>{vaca.condicion}</td>
            <td>{vaca.gestante ? 'Sí' : 'No'}</td>
            <td>{vaca.inseminada ? 'Sí' : 'No'}</td>
            <td>{vaca.prediccion}</td>
            <td>{vaca.fecha}</td>
          </tr>
        ));
      case 'vacas_celo':
        return datos.map(vaca => (
          <tr key={vaca.id}>
            <td>{vaca.nombre}</td>
            <td>{vaca.prediccion}</td>
            <td>{vaca.fecha}</td>
            <td>{vaca.actividad}</td>
            <td>{vaca.temperatura}</td>
          </tr>
        ));
      case 'vacas_gestantes':
      case 'vacas_inseminadas':
        return datos.map(vaca => (
          <tr key={vaca.id}>
            <td>{vaca.nombre}</td>
            <td>{vaca.fecha}</td>
            <td>{vaca.dias_posparto}</td>
            <td>{vaca.condicion}</td>
            <td>{vaca.raza}</td>
          </tr>
        ));
      default:
        return null;
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center" style={{ color: 'var(--green-dark)' }}>
        Reportes y Exportación de Datos
      </h2>
      <Form.Group className="mb-4" style={{ maxWidth: 350, margin: '0 auto' }}>
        <Form.Label style={{ color: 'var(--green-dark)' }}>Selecciona la tabla a exportar</Form.Label>
        <Form.Select
          value={tablaSeleccionada}
          onChange={e => setTablaSeleccionada(e.target.value)}
          className="mb-2"
          style={{ borderColor: 'var(--green-teal)' }}
        >
          {opcionesTablas.map(op => (
            <option key={op.key} value={op.key}>{op.label}</option>
          ))}
        </Form.Select>
      </Form.Group>
      {error && <Alert variant="danger">{error}</Alert>}
      {cargando ? (
        <div className="text-center"><Spinner animation="border" /></div>
      ) : (
        <>
          <div style={{ overflowX: 'auto' }}>
            <Table className="modern-table" hover responsive>
              <thead>
                <tr>
                  {renderHeaders()}
                </tr>
              </thead>
              <tbody>
                {renderRows()}
              </tbody>
            </Table>
          </div>
          <Button
            className="btn-modern btn-modern-primary mt-3"
            onClick={exportarDatos}
            disabled={datos.length === 0}
            style={{ background: 'var(--green-teal)', borderColor: 'var(--green-teal)', fontWeight: 'bold' }}
          >
            Exportar a Excel
          </Button>
        </>
      )}
    </Container>
  );
};

export default Reportes;
