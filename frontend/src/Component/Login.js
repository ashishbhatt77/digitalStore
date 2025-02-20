import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [loginData, setLoginData] = useState({ contactInfo: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false); 
  const navigate = useNavigate();

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    const { contactInfo, password } = loginData;

 
    if (!contactInfo || !password) {
      setError('Please provide both email/phone and password.');
      return;
    }

    const isValidEmail = contactInfo.includes('@');
    const isValidMobile = /^[0-9]{10}$/.test(contactInfo);

    if (!isValidEmail && !isValidMobile) {
      setError('Please provide a valid email or mobile number.');
      return;
    }

    
    const requestData = {
      contactPersonEmail: isValidEmail ? contactInfo : '',
      contactPersonMobile: isValidMobile ? contactInfo : '',
      password,
    };

    setLoading(true);  
    setError(''); 

    try {
      const response = await fetch.post(
        'http://localhost:5000/businesslogin',
        requestData,
        { withCredentials: true } 
      );

      
      if (response.data.message === 'Login successful') {
        alert('Login successful!');
        navigate('/ProductAdd'); 
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false); 
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg p-4 rounded" style={{ width: '400px', borderRadius: '1rem' }}>
        <h1 className="mb-4">Business Login</h1>

    
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit} className="w-100">
     
          <Form.Group controlId="contactInfo">
            <Form.Label>Email or Mobile*</Form.Label>
            <Form.Control
              type="text"
              name="contactInfo"
              value={loginData.contactInfo}
              onChange={handleChange}
              required
              placeholder="Enter your email or mobile number"
            />
          </Form.Group>

          <Form.Group controlId="password">
            <Form.Label>Password*</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={loginData.password}
              onChange={handleChange}
              required
            />
          </Form.Group>

          <Button variant="primary" className="w-100 mt-3" type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Form>
          <p className='text-right mt-2 mb-0'><Link to="/ForgotAccount">Forgot Password</Link></p>
        <hr />
       <Link to="/BussinessRegister">Don't have an account? Register here</Link> 
      </div>
    </Container>
  );
};

export default Login;
