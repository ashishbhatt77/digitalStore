import React, { useEffect, useState } from 'react';
import axios from 'axios';

const AdminDashboard = () => {
    const [registrations, setRegistrations] = useState([]);
    const [loading, setLoading] = useState(false);  // Track loading state

    useEffect(() => {
        const fetchRegistrations = async () => {
            try {
                const response = await axios.get('http://localhost:5000/businessregister');
                setRegistrations(response.data);
            } catch (error) {
                console.error('Error fetching registrations', error);
            }
        };
        fetchRegistrations();
    }, []);

    const updateStatus = async (registrationId, status) => {
        setLoading(true);  // Set loading to true when request starts
        try {
            await axios.post('http://localhost:5000/businessregister', { registrationId, status });
            setRegistrations(prevState => prevState.map(reg => 
                reg._id === registrationId ? { ...reg, status } : reg
            ));
        } catch (error) {
            console.error('Error updating status', error);
        } finally {
            setLoading(false);  // Reset loading state after the request finishes
        }
    };

    return (
        <div>
            <h1>Admin Dashboard</h1>
            <table className='table table-hover'>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Category</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {registrations.map((registration) => (
                        <tr key={registration._id}>
                            <td>{registration.name}</td>
                            <td>{registration.email}</td>
                            <td>{registration.category}</td>
                            <td>{registration.status}</td>
                            <td>
                                {/* Disable buttons if status is already set */}
                                {registration.status !== 'Approved' && registration.status !== 'Rejected' ? (
                                    <>
                                        <button 
                                            onClick={() => updateStatus(registration._id, 'Approved')} 
                                            disabled={loading} 
                                            className="btn btn-success btn-sm">
                                            Approve
                                        </button>
                                        <button 
                                            onClick={() => updateStatus(registration._id, 'Rejected')} 
                                            disabled={loading} 
                                            className="btn btn-danger btn-sm">
                                            Reject
                                        </button>
                                    </>
                                ) : (
                                    <span>Action taken</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminDashboard;
