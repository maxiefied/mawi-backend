import React, { useState } from 'react';
import axios from 'axios';

const BuyTokensPage = () => {
    const [phone, setPhone] = useState('');
    const [amount, setAmount] = useState('');
    const [message, setMessage] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('https://mawi-backend.onrender.com/api/mpesa/stk', {
                phone,
                amount: parseInt(amount),
            });
            setMessage(res.data.response.CustomerMessage || 'Request sent.');
        } catch (err) {
            setMessage('Failed to initiate STK push');
            console.error(err.response?.data || err.message);
        }
    };

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Buy Tokens</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Phone Number:</label><br />
                    <input
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. 254712345678"
                        required
                    />
                </div>
                <div style={{ marginTop: '1rem' }}>
                    <label>Amount (KES):</label><br />
                    <input
                        type="number"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        placeholder="e.g. 100"
                        required
                    />
                </div>
                <button type="submit" style={{ marginTop: '1rem' }}>
                    Buy Tokens
                </button>
            </form>
            {message && <p style={{ marginTop: '1rem' }}>{message}</p>}
        </div>
    );
};

export default BuyTokensPage;