
import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const CreateAccount= () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [pass, setPass] = useState('');
  const [confirmpass, setConfirmpass] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (pass !== confirmpass) {
      setError('Passwords do not match');
      return;
    }

    try {
      await fetch.post('http://localhost:5000/register', { name, email, mobile, pass, confirmpass });
      alert('Registration successful!');
      navigate('/login');
    } catch (error) {
      setError(error.response?.data?.message || 'Error during registration');
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg p-4 rounded" style={{ width: '400px' }}>
        <h2 className="text-center mb-4">User-Register</h2>
        {error && <div className="error-message  text-danger">{error}</div>}
        <form onSubmit={handleRegister} className='w-100'>
          <div className="mb-3"> 
            <label><strong>Name</strong></label>
            <input
              type="text"
              className="form-control"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label><strong>Email</strong></label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label><strong>Mobile</strong></label>
            <input
              type="text"
              className="form-control"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label> <strong>Password</strong></label>
            <input
              type="password"
              className="form-control"
              value={pass}
              onChange={(e) => setPass(e.target.value)}
            />
          </div>
          <div className="mb-3">
            <label><strong>Confirm Password</strong></label>
            <input
              type="password"
              className="form-control"
              value={confirmpass}
              onChange={(e) => setConfirmpass(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">SignUp</button>
        </form>
        <hr />
      <Link to="/UserLogin">Already have an account? Login here</Link> 
      </div>
    </div>
  );
};

export default CreateAccount;


