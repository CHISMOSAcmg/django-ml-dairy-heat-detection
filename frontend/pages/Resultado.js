import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Card, Button, Alert } from 'react-bootstrap';

function Resultado() {
  const location = useLocation();
  const navigate = useNavigate();
  const resultado = location.state?.resultado;

  if (!resultado) {
    return (
      <Container className="mt-5">
        <Alert variant="warning">
          No hay resultado para mostrar. Por favor, realiza una predicción primero.
        </Alert>
        <Button variant="primary" onClick={() => navigate('/formulario')}>
          Ir al formulario
        </Button>
      </Container>
    );
  }

  // Extrae la probabilidad de celo y los datos del registro
  const probabilidad = resultado.prediccion ?? resultado?.registro?.prediccion;
  const registro = resultado.registro ?? resultado;

  // Diccionario para mostrar el nombre completo de la raza
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

  let mensaje;
  let alerta;

  if (probabilidad >= 70) {
    mensaje = (
      <span>
        <b>¡Atención!</b> Esta vaca presenta una <b>alta probabilidad de estar en celo</b>.<br />
        <b>Probabilidad estimada: {probabilidad.toFixed(2)}%</b>
      </span>
    );
    alerta = (
      <Alert variant="danger" className="mt-3">
        <b>Recomendación:</b> Revise a la vaca lo antes posible para confirmar el celo y, si corresponde, programe la inseminación artificial. Una detección oportuna puede mejorar la eficiencia reproductiva y la producción de leche.
      </Alert>
    );
  } else {
    mensaje = (
      <span>
        <b>Probabilidad de celo baja:</b> {probabilidad.toFixed(2)}%<br />
        Continúe monitoreando la vaca y revise nuevamente en los próximos días.
      </span>
    );
    alerta = (
      <Alert variant="info" className="mt-3">
        <b>Consejo:</b> Mantenga la observación regular, ya que el celo puede presentarse en otro momento.
      </Alert>
    );
  }

  return (
    <Container className="mt-5">
      <Card className="text-center">
        <Card.Header as="h4">Resultado de Predicción de Celo</Card.Header>
        <Card.Body>
          <Card.Title>{mensaje}</Card.Title>
          <Card.Text>
            <b>Datos del animal:</b><br />
            Nombre: {registro.nombre}<br />
            Actividad: {registro.actividad} pasos/día<br />
            Temperatura: {registro.temperatura} °C<br />
            Días posparto: {registro.dias_posparto}<br />
            Condición corporal: {registro.condicion}<br />
            Raza: {razasNombres[registro.raza] || registro.raza}<br />
            Parto asistido previo: {registro.parto_asistido ? "Sí" : "No"}
          </Card.Text>
          {alerta}
          <Button variant="success" onClick={() => navigate('/historial')} className="mt-3">
            Ver historial
          </Button>
        </Card.Body>
      </Card>
    </Container>
  );
}

export default Resultado;
