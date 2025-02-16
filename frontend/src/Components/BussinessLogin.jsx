import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container, Alert } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const BussinessLogin = () => {
  const [loginData, setLoginData] = useState({ contactInfo: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);  // Added loading state
  const navigate = useNavigate();

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Form submit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { contactInfo, password } = loginData;

    // Validate email or mobile
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

    // Prepare the request data based on whether it's an email or mobile
    const requestData = {
      contactPersonEmail: isValidEmail ? contactInfo : '',
      contactPersonMobile: isValidMobile ? contactInfo : '',
      password,
    };

    setLoading(true);  // Set loading to true when request starts
    setError(''); // Clear previous errors

    try {
      const response = await axios.post(
        'http://localhost:5000/businesslogin',
        requestData,
        { withCredentials: true } // Ensures cookies are sent/received
      );

      // Check if the response contains the necessary data
      if (response.data.message === 'Login successful') {
        alert('Login successful!');
        navigate('/ProductAdd'); // Redirect to the Product Add page
      } else {
        setError('Login failed. Please try again.');
      }
    } catch (error) {
      setError(error.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false); // Set loading to false after request completes
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center min-vh-100">
      <div className="card shadow-lg p-4 rounded" style={{ width: '400px', borderRadius: '1rem' }}>
        <h1 className="mb-4">Business Login</h1>

        {/* Error Message */}
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit} className="w-100">
          {/* Input for Email or Mobile */}
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

        <hr />
        <a href="/BussinessRegister">Don't have an account? Register here</a>
      </div>
    </Container>
  );
};

export default BussinessLogin;
