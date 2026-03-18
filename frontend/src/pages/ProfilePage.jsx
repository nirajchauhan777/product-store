import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfile } from '../services/authService';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    getProfile()
      .then((res) => setProfile(res.data))
      .catch((err) => setError(err.response?.data?.message || err.message));
  }, []);

  return (
    <div className="container" style={{ maxWidth: 480 }}>
      <h1>Profile</h1>
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {profile ? (
        <div>
          <p>
            <strong>Name:</strong> {profile.name}
          </p>
          <p>
            <strong>Email:</strong> {profile.email}
          </p>
          <p>
            <strong>Role:</strong> {profile.role}
          </p>
        </div>
      ) : (
        <p>Loading…</p>
      )}
    </div>
  );
}
