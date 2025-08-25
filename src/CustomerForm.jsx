/* eslint-disable no-unused-vars */
/* eslint-disable no-useless-catch */
import React, { useState } from 'react';
import './CustomerForm.css';

function CustomerForm({ isOpen, setIsOpen, setCustomerId }) {
    const [customer, setCustomer] = useState({
        name: '',
        email: '',
        contact: ''
    });

    const [error, setError] = useState('');
    const [savedCustomer, setSavedCustomer] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCustomer(prev => ({ ...prev, [name]: value }));
    };

    const validateCustomer = (data) => {
        if (!data.name.trim()) return 'Name is required.';
        if (!data.email.trim()) return 'Email is required.';
        return null;
    };

    const saveCustomerToApi = async (customerData) => {
        try {
            const response = await fetch('https://localhost:7078/Customer', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(customerData)
            });

            const responseBody = await response.text();

            if (!response.ok) {
                console.error('API Error Response:', responseBody);
                throw new Error(`Server responded with ${response.status}: ${responseBody}`);
            }

            return JSON.parse(responseBody);
        } catch (err) {
            console.error('Fetch error:', err);
            throw err;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        const validationError = validateCustomer(customer);
        if (validationError) {
            setError(validationError);
            return;
        }

        try {
            const result = await saveCustomerToApi(customer);
            setSavedCustomer(result);
            setCustomerId(result.id); // Pass ID to App
            console.log("Saved customer:", result);
            setIsOpen(false);
        } catch (err) {
            setError('Failed to save customer. Check server logs or network tab for details.');
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <h2>Customer</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Name"
                        value={customer.name}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={customer.email}
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="tel"
                        name="contact"
                        placeholder="Phone"
                        value={customer.contact}
                        onChange={handleChange}
                    />
                    <div className="form-buttons">
                        <button type="submit">Save</button>
                        <button type="button" onClick={() => setIsOpen(false)}>Cancel</button>
                    </div>
                </form>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </div>
        </div>
    );
}

export default CustomerForm;
