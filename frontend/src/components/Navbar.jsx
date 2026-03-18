import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav style={{ padding: '1rem', borderBottom: '1px solid #ddd', background: '#000000',
      color: '#fff'
     }}>
      <div className="container" style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
        <Link to="/" style={{ fontWeight: 600, fontSize: 18 }}>
          MERN Shop
        </Link>
        <div style={{ flex: 1 }} />
        <Link to="/" style={{ marginRight: 12 }}>
          Products
        </Link>
        <Link to="/cart" style={{ marginRight: 12 }}>
          Cart
        </Link>
        {user ? (
          <>
            <Link to="/profile" style={{ marginRight: 12 }}>
              {user.name}
            </Link>
            {user.role === 'admin' && (
              <Link to="/admin" style={{ marginRight: 12 }}>
                Admin
              </Link>
            )}
            <button onClick={handleLogout} style={{ padding: '0.35rem 0.75rem' }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ marginRight: 12 }}>
              Login
            </Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}
