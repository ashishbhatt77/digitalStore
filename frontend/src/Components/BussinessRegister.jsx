import React, { useState } from 'react';
import axios from 'axios';
import { Form, Button, Container } from 'react-bootstrap';
import './Css/BussinessRegister.css';

const BussinessRegister = () => {
    const [formData, setFormData] = useState({
        name: '',
        location: '',
        email: '',
        category: [],
        businessName: '',
        registrationNumber: '',
        registrationAuthority: '',
        registrationDate: '',
        directorName: '',
        contactPersonName: '',
        contactPersonEmail: '',
        contactPersonDesignation: '',
        contactPersonMobile: '',
        password: '',
        confirmpassword: ''
    });

    const handleChange = (e) => {
        const { name, value, checked } = e.target;

        // Handle category checkbox selection
        if (name === "category") {
            setFormData(prevState => {
                const newCategories = checked
                    ? [...prevState.category, value]
                    : prevState.category.filter(category => category !== value);

                return { ...prevState, category: newCategories };
            });
        } else {
            setFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmpassword) {
            alert("Passwords do not match!");
            return;
        }

        try {
            await axios.post('http://localhost:5000/businessregister', formData);
            alert('Registration Successful!');
        } catch (error) {
            alert('Error during registration!');
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center mb-5 mt-5" style={{ height: 'auto' }}>
            <div className="register-form-box p-5 shadow-lg rounded">
                <h1 className="text-center mb-4">Business Registration</h1>
                <Form onSubmit={handleSubmit} className='w-100'>
                    <Form.Group controlId="name">
                        <Form.Label className="font-weight-bold">Your Name*</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="location">
                        <Form.Label className="font-weight-bold">Location*</Form.Label>
                        <Form.Control
                            type="text"
                            name="location"
                            value={formData.location}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="email">
                        <Form.Label className="font-weight-bold">Your Email*</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    
                    <Form.Group controlId="businessName">
                        <Form.Label className="font-weight-bold">Name of Individual/Firm/Company*</Form.Label>
                        <Form.Control
                            type="text"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="registrationNumber">
                        <Form.Label className="font-weight-bold">Registration Number*</Form.Label>
                        <Form.Control
                            type="text"
                            name="registrationNumber"
                            value={formData.registrationNumber}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="registrationAuthority">
                        <Form.Label className="font-weight-bold">Registration Authority*</Form.Label>
                        <Form.Control
                            type="text"
                            name="registrationAuthority"
                            value={formData.registrationAuthority}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="registrationDate">
                        <Form.Label className="font-weight-bold">Date of Registration*</Form.Label>
                        <Form.Control
                            type="date"
                            name="registrationDate"
                            value={formData.registrationDate}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="directorName">
                        <Form.Label className="font-weight-bold">Name of the Director / Owner / Partner*</Form.Label>
                        <Form.Control
                            type="text"
                            name="directorName"
                            value={formData.directorName}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="contactPersonName">
                        <Form.Label className="font-weight-bold">Name of the Contact Person*</Form.Label>
                        <Form.Control
                            type="text"
                            name="contactPersonName"
                            value={formData.contactPersonName}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="contactPersonEmail">
                        <Form.Label className="font-weight-bold">Email of the Contact Person*</Form.Label>
                        <Form.Control
                            type="email"
                            name="contactPersonEmail"
                            value={formData.contactPersonEmail}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="contactPersonDesignation">
                        <Form.Label className="font-weight-bold">Designation of the Contact Person*</Form.Label>
                        <Form.Control
                            type="text"
                            name="contactPersonDesignation"
                            value={formData.contactPersonDesignation}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="contactPersonMobile">
                        <Form.Label className="font-weight-bold">Mobile of the Contact Person*</Form.Label>
                        <Form.Control
                            type="text"
                            name="contactPersonMobile"
                            value={formData.contactPersonMobile}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="password">
                        <Form.Label className="font-weight-bold">Password*</Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group controlId="confirmpassword">
                        <Form.Label className="font-weight-bold">Confirm Password*</Form.Label>
                        <Form.Control
                            type="password"
                            name="confirmpassword"
                            value={formData.confirmpassword}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>

                    {/* Registration Category Checkboxes */}
                    <Form.Group controlId="category">
                        <Form.Label className="font-weight-bold">Registration Category*</Form.Label>
                        <div>
                            <Form.Check
                                type="checkbox"
                                label="Original Equipment Manufacturer"
                                name="category"
                                value="Original Equipment Manufacturer"
                                checked={formData.category.includes("Original Equipment Manufacturer")}
                                onChange={handleChange}
                            />
                            <Form.Check
                                type="checkbox"
                                label="Distributor/Dealer/Stockist"
                                name="category"
                                value="Distributor/Dealer/Stockist"
                                checked={formData.category.includes("Distributor/Dealer/Stockist")}
                                onChange={handleChange}
                            />
                            <Form.Check
                                type="checkbox"
                                label="Micro/Small Enterprise"
                                name="category"
                                value="Micro/Small Enterprise"
                                checked={formData.category.includes("Micro/Small Enterprise")}
                                onChange={handleChange}
                            />
                            <Form.Check
                                type="checkbox"
                                label="Public Sector Unit"
                                name="category"
                                value="Public Sector Unit"
                                checked={formData.category.includes("Public Sector Unit")}
                                onChange={handleChange}
                            />
                            <Form.Check
                                type="checkbox"
                                label="Govt. Dept"
                                name="category"
                                value="Govt. Dept"
                                checked={formData.category.includes("Govt. Dept")}
                                onChange={handleChange}
                            />
                            <Form.Check
                                type="checkbox"
                                label="Consortium/State/Govt. Agencies"
                                name="category"
                                value="Consortium/State/Govt. Agencies"
                                checked={formData.category.includes("Consortium/State/Govt. Agencies")}
                                onChange={handleChange}
                            />
                            <Form.Check
                                type="checkbox"
                                label="Others"
                                name="category"
                                value="Others"
                                checked={formData.category.includes("Others")}
                                onChange={handleChange}
                            />
                        </div>
                    </Form.Group>

                    <Button variant="primary" type="submit" className="w-100">Register</Button>
                </Form>
            </div>
        </Container>
    );
};

export default BussinessRegister;