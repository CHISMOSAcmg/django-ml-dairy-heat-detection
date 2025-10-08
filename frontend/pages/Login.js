import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Button, Form, Container, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError('');
  setLoading(true);
  const result = await login(credentials);
  setLoading(false);
  if (result.success) {
    navigate('/'); // Redirige a la página principal
  } else {
    setError(result.message || "Usuario o contraseña incorrectos");
  }
};


  return (
    <Container
      className="mt-5 shadow-lg p-4 rounded-3"
      style={{
        background: 'rgba(255, 255, 255, 0.95)',
        maxWidth: 400,
        border: '1px solid var(--primary-100)'
      }}
    >
      <h2 className="mb-4 text-center" style={{ color: 'var(--primary-700)' }}>Iniciar sesión</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label style={{ color: 'var(--primary-700)' }}>Usuario</Form.Label>
          <Form.Control
            type="text"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            required
            autoFocus
            style={{ borderColor: 'var(--primary-200)' }}
          />
        </Form.Group>
        <Form.Group className="mb-3">
          <Form.Label style={{ color: 'var(--primary-700)' }}>Contraseña</Form.Label>
          <Form.Control
            type="password"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            required
            style={{ borderColor: 'var(--primary-200)' }}
          />
        </Form.Group>
        {error && <div className="mb-3" style={{ color: 'var(--danger)' }}>{error}</div>}
        <Button
          type="submit"
          className="btn-modern btn-modern-primary w-100"
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Ingresando...
            </>
          ) : (
            "Ingresar"
          )}
        </Button>
      </Form>
    </Container>
  );
};

export default Login;
