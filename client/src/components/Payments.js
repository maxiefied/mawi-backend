// src/components/Payments.js
import React, { useEffect, useState } from "react";
import axios from "axios";

const Payments = () => {
    const [payments, setPayments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPayments = async () => {
            try {
                const response = await axios.get("https://mawi-backend.onrender.com/api/mpesa/payments");
                setPayments(response.data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching payments:", error);
                setLoading(false);
            }
        };

        fetchPayments();
    }, []);

    return (
        <div style={{ padding: "2rem" }}>
            <h2>M-Pesa Payments</h2>
            {loading ? (
                <p>Loading...</p>
            ) : payments.length === 0 ? (
                <p>No payments found.</p>
            ) : (
                <table border="1" cellPadding="10" style={{ width: "100%", marginTop: "1rem" }}>
                    <thead>
                        <tr>
                            <th>Phone</th>
                            <th>Amount</th>
                            <th>Receipt</th>
                            <th>Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((p, index) => (
                            <tr key={index}>
                                <td>{p.phone}</td>
                                <td>{p.amount}</td>
                                <td>{p.mpesaReceiptNumber}</td>
                                <td>{new Date(p.transactionDate).toLocaleString()}</td>
                                <td>{p.status}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
    );
};

export default Payments;