import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Payment = () => {
    const [payments, setPayments] = useState([]);

    useEffect(() => {
        axios.get('https://mawi-backend.onrender.com/api/mpesa/payments')
            .then(res => setPayments(res.data))
            .catch(err => console.error('Failed to fetch payments', err));
    }, []);

    return (
        <div style={{ padding: '2rem' }}>
            <h2>Payment History</h2>
            <table border="1" cellPadding="8" cellSpacing="0">
                <thead>
                    <tr>
                        <th>Phone</th>
                        <th>Amount</th>
                        <th>Receipt</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {payments.map((payment, idx) => (
                        <tr key={idx}>
                            <td>{payment.phone}</td>
                            <td>{payment.amount}</td>
                            <td>{payment.mpesaReceiptNumber}</td>
                            <td>{new Date(payment.transactionDate).toLocaleString()}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Payment;
