import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); // Added loading state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);  // Set loading to true when request starts
    setError(''); // Clear previous errors

    try {
      const response = await axios.post('http://localhost:5000/superadmin', { email, pass });
      if (response.data.message === 'Login successful') {
        setEmail('');  // Reset email and password fields on successful login
        setPass('');
        navigate('/AdminDashboard');
      }
    } catch (error) {
      setLoading(false);  // Set loading to false after request completes
      setError(error.response?.data?.message || 'Email/Password is wrong'); // Update error message
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg p-4 rounded" style={{ width: '400px' }}>
        <h2 className="text-center">Admin-Login</h2>
        {error && <div className="alert alert-danger">{error}</div>}
        <form onSubmit={handleLogin} className="w-100">
          <div className="mb-3">
            <label><strong>Email</strong></label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label><strong>Password</strong></label>
            <input
              type="password"
              className="form-control"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100"
            disabled={loading}  // Disable button while loading
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLogin;
