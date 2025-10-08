import { useAuth } from '../context/AuthContext';
import { Dropdown } from 'react-bootstrap';

const getInitial = (username) => {
  if (!username) return '';
  return username[0].toUpperCase();
};

const UserMenu = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <Dropdown align="end" className="user-menu-dropdown">
      <Dropdown.Toggle
        variant="light"
        id="dropdown-user"
        className="d-flex align-items-center justify-content-center user-menu-toggle"
        style={{
          background: 'var(--primary-50)',
          border: '2px solid var(--primary-300)',
          borderRadius: '50%',
          padding: 0,
          width: 44,
          height: 44,
          boxShadow: '0 2px 6px rgba(0,0,0,0.08)',
        }}
      >
        <span
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 36,
            height: 36,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary-400), var(--primary-700))',
            color: '#fff',
            fontWeight: 700,
            fontSize: 22,
            lineHeight: '36px',
            userSelect: 'none'
          }}
        >
          {getInitial(user.username)}
        </span>
      </Dropdown.Toggle>
      <Dropdown.Menu
        className="user-menu-dropdown-menu"
        style={{
          minWidth: 220,
          borderRadius: 14,
          boxShadow: '0 6px 24px rgba(0,0,0,0.12)',
          background: 'var(--primary-50)',
          padding: '0.5rem 0',
          overflow: 'hidden'
        }}
      >
        <div className="px-3 py-2 text-center" style={{ borderBottom: '1px solid var(--primary-100)' }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 54,
              height: 54,
              borderRadius: '50%',
              margin: '0 auto 8px auto',
              background: 'linear-gradient(135deg, var(--primary-400), var(--primary-700))',
              color: '#fff',
              fontWeight: 700,
              fontSize: 30,
              lineHeight: '54px',
              userSelect: 'none'
            }}
          >
            {getInitial(user.username)}
          </div>
          <div style={{ fontWeight: 700, color: 'var(--primary-800)', fontSize: 19, lineHeight: 1.1 }}>
            {user.username}
          </div>
          <div style={{ fontSize: 13, color: 'var(--primary-500)', marginBottom: 2 }}>
            {user.role === 'admin' ? 'Administrador' : 'Usuario'}
          </div>
        </div>
        <Dropdown.Divider style={{ margin: '0.5rem 0' }} />
        <div className="px-3 pb-2">
          <Dropdown.Item
            onClick={logout}
            className="text-center"
            style={{
              color: 'var(--danger)',
              fontWeight: 600,
              borderRadius: 8,
              background: 'var(--danger-50, #ffeaea)',
              width: '100%',
              margin: 0,
              padding: '0.5rem 0',
              transition: 'background 0.2s, color 0.2s'
            }}
          >
            Cerrar sesión
          </Dropdown.Item>
        </div>
      </Dropdown.Menu>
      <style>{`
        .user-menu-dropdown .dropdown-toggle:focus, 
        .user-menu-dropdown .dropdown-toggle:active {
          box-shadow: 0 0 0 0.15rem var(--primary-200) !important;
        }
        .user-menu-dropdown-menu .dropdown-item:hover {
          background: var(--danger-100, #ffd6d6);
          color: var(--danger) !important;
        }
      `}</style>
    </Dropdown>
  );
};

export default UserMenu;
