import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [mobile, setMobile] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    setLoading(true);  
    
    try {
      await axios.post('http://localhost:5000/login', { email, pass, mobile }, { withCredentials: true });
      
      alert('Login successful!');
      setLoading(false); 
      navigate('/'); 
    } catch (error) {
      setLoading(false);  
      setError(error.response?.data?.message || 'Error during login');  
    }
  };

  const handleLogout = () => {
    // Clear the cookie by sending a logout request to the server (you can implement this on the backend if needed)
    axios.post('http://localhost:5000/logout', {}, { withCredentials: true })
      .then(() => {
        alert('Logged out successfully!');
        navigate('/');  // Redirect to homepage after logout
      })
      .catch((err) => {
        console.error(err);
        alert('Error during logout');
      });
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg p-4 rounded" style={{ width: '400px', borderRadius: '1rem' }}>
        <h2 className='text-center'>User-Login</h2>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin} className='w-100'>
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

          <div className="mb-3">
            <label><strong>Mobile</strong></label>
            <input
              type="text"
              className="form-control"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <hr />
        <a href="/Singup">Don't have an account? Register here</a>

        <div className="text-center mt-3">
          <button onClick={handleLogout} className="btn btn-danger w-100">Logout</button>
        </div>
      </div>
    </div>
  );
};

export default Login;