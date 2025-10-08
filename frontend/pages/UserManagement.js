import { useEffect, useState } from 'react';
import api from '../utils/axiosConfig';
import { Table, Button, Form, Alert, Modal, Container } from 'react-bootstrap';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [newUser, setNewUser] = useState({
    username: '',
    password: '',
    email: '',
    role: 'user',
    farm: '',
    phone: ''
  });
  const [registerError, setRegisterError] = useState('');
  const [registerSuccess, setRegisterSuccess] = useState('');
  const [editUser, setEditUser] = useState(null);
  const [editError, setEditError] = useState('');
  const [editSuccess, setEditSuccess] = useState('');
  const [showEditModal, setShowEditModal] = useState(false);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/users/');
      setUsers(response.data);
    } catch (error) {
      setUsers([]);
      setRegisterError('No tienes permisos para ver los usuarios o ocurrió un error.');
    }
  };

  // Eliminar usuario
  const handleDelete = async (userId) => {
    if (window.confirm('¿Está seguro que desea eliminar este usuario?')) {
      try {
        await api.delete(`/users/${userId}/`);
        setUsers(users.filter(u => u.id !== userId));
      } catch (err) {
        setRegisterError('Error al eliminar usuario');
      }
    }
  };

  // Abrir modal de edición
  const handleEdit = (user) => {
    setEditUser({
      ...user,
      password: '', // Nunca mostramos ni editamos la contraseña actual
    });
    setEditError('');
    setEditSuccess('');
    setShowEditModal(true);
  };

  // Guardar cambios de edición
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditError('');
    setEditSuccess('');
    try {
      // Prepara el payload, omite password si está vacío
      const payload = {
        username: editUser.username,
        email: editUser.email,
        role: editUser.role,
        farm: editUser.farm,
        phone: editUser.phone,
      };
      if (editUser.password) {
        payload.password = editUser.password;
      }
      await api.patch(`/users/${editUser.id}/`, payload);
      setEditSuccess('Usuario actualizado correctamente');
      setShowEditModal(false);
      fetchUsers();
    } catch (err) {
      setEditError('Error al actualizar usuario');
    }
  };

  // Registrar usuario
  const handleRegister = async (e) => {
    e.preventDefault();
    setRegisterError('');
    setRegisterSuccess('');
    try {
      await api.post('/register/', newUser);
      setRegisterSuccess('Usuario creado correctamente');
      setNewUser({
        username: '',
        password: '',
        email: '',
        role: 'user',
        farm: '',
        phone: ''
      });
      fetchUsers();
    } catch (err) {
      setRegisterError('Error al crear usuario');
    }
  };

  return (
    <Container className="mt-5">
      <h2 className="mb-4 text-center" style={{ color: 'var(--primary-700)' }}>
        Gestión de Usuarios
      </h2>
      <h4 className="mb-3" style={{ color: 'var(--primary-600)' }}>Registrar nuevo usuario</h4>
      <Form onSubmit={handleRegister} className="mb-4" autoComplete="off">
        <Form.Group className="mb-2">
          <Form.Label>Usuario</Form.Label>
          <Form.Control
            type="text"
            name="username"
            value={newUser.username}
            onChange={e => setNewUser({ ...newUser, username: e.target.value })}
            required
            placeholder="Ingrese el nombre de usuario"
            autoComplete="off"
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={newUser.password}
            onChange={e => setNewUser({ ...newUser, password: e.target.value })}
            required
            placeholder="Ingrese la contraseña"
            autoComplete="new-password"
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Email</Form.Label>
          <Form.Control
            type="email"
            name="email"
            value={newUser.email}
            onChange={e => setNewUser({ ...newUser, email: e.target.value })}
            placeholder="Ingrese el email"
            autoComplete="off"
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Rol</Form.Label>
          <Form.Select
            name="role"
            value={newUser.role}
            onChange={e => setNewUser({ ...newUser, role: e.target.value })}
          >
            <option value="user">Usuario</option>
            <option value="admin">Administrador</option>
          </Form.Select>
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Finca</Form.Label>
          <Form.Control
            type="text"
            name="farm"
            value={newUser.farm}
            onChange={e => setNewUser({ ...newUser, farm: e.target.value })}
            placeholder="Ingrese la finca"
            autoComplete="off"
          />
        </Form.Group>
        <Form.Group className="mb-2">
          <Form.Label>Teléfono</Form.Label>
          <Form.Control
            type="text"
            name="phone"
            value={newUser.phone}
            onChange={e => setNewUser({ ...newUser, phone: e.target.value })}
            placeholder="Ingrese el teléfono"
            autoComplete="off"
          />
        </Form.Group>
        <Button className="btn-modern btn-modern-primary" type="submit">Registrar</Button>
        {registerSuccess && <Alert variant="success" className="mt-2">{registerSuccess}</Alert>}
        {registerError && <Alert variant="danger" className="mt-2">{registerError}</Alert>}
      </Form>
      <Table className="modern-table" hover responsive>
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Email</th>
            <th>Rol</th>
            <th>Finca</th>
            <th>Teléfono</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 && (
            <tr>
              <td colSpan={6} className="text-center">No hay usuarios registrados.</td>
            </tr>
          )}
          {users.map(user => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.farm}</td>
              <td>{user.phone}</td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="btn-modern me-2"
                  onClick={() => handleEdit(user)}
                >
                  Editar
                </Button>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="btn-modern"
                  onClick={() => handleDelete(user.id)}
                >
                  Eliminar
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      {/* Modal de edición */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Editar Usuario</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleEditSubmit} autoComplete="off">
          <Modal.Body>
            <Form.Group className="mb-2">
              <Form.Label>Usuario</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={editUser?.username || ''}
                onChange={e => setEditUser({ ...editUser, username: e.target.value })}
                required
                autoComplete="off"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Contraseña (dejar en blanco para no cambiar)</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={editUser?.password || ''}
                onChange={e => setEditUser({ ...editUser, password: e.target.value })}
                placeholder="Nueva contraseña"
                autoComplete="new-password"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={editUser?.email || ''}
                onChange={e => setEditUser({ ...editUser, email: e.target.value })}
                autoComplete="off"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Rol</Form.Label>
              <Form.Select
                name="role"
                value={editUser?.role || 'user'}
                onChange={e => setEditUser({ ...editUser, role: e.target.value })}
              >
                <option value="user">Usuario</option>
                <option value="admin">Administrador</option>
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Finca</Form.Label>
              <Form.Control
                type="text"
                name="farm"
                value={editUser?.farm || ''}
                onChange={e => setEditUser({ ...editUser, farm: e.target.value })}
                autoComplete="off"
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={editUser?.phone || ''}
                onChange={e => setEditUser({ ...editUser, phone: e.target.value })}
                autoComplete="off"
              />
            </Form.Group>
            {editSuccess && <Alert variant="success" className="mt-2">{editSuccess}</Alert>}
            {editError && <Alert variant="danger" className="mt-2">{editError}</Alert>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" className="btn-modern" onClick={() => setShowEditModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" className="btn-modern" type="submit">
              Guardar cambios
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default UserManagement;
