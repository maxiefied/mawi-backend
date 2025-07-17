const express = require('express');
const axios = require('axios');
const moment = require('moment');
const router = express.Router();
require('dotenv').config();

const Payment = require('../models/Payment');
const TokenBalance = require('../models/TokenBalance');

// Generate base64 password
const generatePassword = () => {
    const timestamp = moment().format('YYYYMMDDHHmmss');
    const pass = `${process.env.MPESA_SHORTCODE}${process.env.MPESA_PASSKEY}${timestamp}`;
    return { password: Buffer.from(pass).toString('base64'), timestamp };
};

// Generate access token
const getAccessToken = async () => {
    const auth = Buffer.from(
        `${process.env.MPESA_CONSUMER_KEY}:${process.env.MPESA_CONSUMER_SECRET}`
    ).toString('base64');

    const response = await axios.get(
        'https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials',
        {
            headers: {
                Authorization: `Basic ${auth}`,
            },
        }
    );

    return response.data.access_token;
};

// Format phone number
const formatPhone = (phone) => {
    if (phone.startsWith('0')) return phone.replace(/^0/, '254');
    return phone;
};

// @route POST /api/mpesa/stk — Initiate STK Push
router.post('/stk', async (req, res) => {
    const { phone, amount } = req.body;

    try {
        const accessToken = await getAccessToken();
        const { password, timestamp } = generatePassword();
        const formattedPhone = formatPhone(phone);

        const response = await axios.post(
            'https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest',
            {
                BusinessShortCode: process.env.MPESA_SHORTCODE,
                Password: password,
                Timestamp: timestamp,
                TransactionType: 'CustomerPayBillOnline',
                Amount: amount,
                PartyA: formattedPhone,
                PartyB: process.env.MPESA_SHORTCODE,
                PhoneNumber: formattedPhone,
                CallBackURL: process.env.MPESA_CALLBACK_URL,
                AccountReference: 'MAWI',
                TransactionDesc: 'Token Purchase',
            },
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        res.json({ message: 'STK push initiated', response: response.data });
    } catch (error) {
        console.error(error.response?.data || error.message);
        res.status(500).json({ message: 'STK push failed', error: error.message });
    }
});

// @route POST /api/mpesa/callback — Handle M-PESA Callback
router.post('/callback', async (req, res) => {
    try {
        const callback = req.body?.Body?.stkCallback;

        if (callback?.ResultCode === 0) {
            const metadata = callback.CallbackMetadata?.Item || [];

            const mpesaReceiptNumber = metadata.find(i => i.Name === 'MpesaReceiptNumber')?.Value || '';
            const amount = metadata.find(i => i.Name === 'Amount')?.Value || 0;
            const phone = metadata.find(i => i.Name === 'PhoneNumber')?.Value || '';
            const transactionDate = metadata.find(i => i.Name === 'TransactionDate')?.Value || '';

            const tokens = Math.floor(amount / 20);

            // Save the payment
            const payment = new Payment({
                phone,
                amount,
                mpesaReceiptNumber,
                transactionDate,
                transactionType: 'PayBill',
                status: 'Success',
                tokens
            });

            await payment.save();
            console.log('✅ Payment saved:', payment);

            // Update token balance
            const balanceDoc = await TokenBalance.findOne();
            if (balanceDoc) {
                balanceDoc.balance += tokens;
                await balanceDoc.save();
                console.log('🔁 Token balance updated:', balanceDoc.balance);
            } else {
                const newBalance = new TokenBalance({ balance: tokens });
                await newBalance.save();
                console.log('🆕 Token balance created:', newBalance.balance);
            }

        } else {
            console.log('❌ Payment failed:', callback);
        }

        res.status(200).json({ message: 'Callback received successfully' });
    } catch (err) {
        console.error('Callback Error:', err.message);
        res.status(500).json({ message: 'Callback processing failed' });
    }
});

// @route GET /api/mpesa/payments — View all payments
router.get('/payments', async (req, res) => {
    try {
        const payments = await Payment.find().sort({ createdAt: -1 });
        res.json(payments);
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch payments', error: err.message });
    }
});

// @route GET /api/mpesa/token-balance — Get current token balance
router.get('/token-balance', async (req, res) => {
    try {
        const balanceDoc = await TokenBalance.findOne();
        res.json({ balance: balanceDoc?.balance || 0 });
    } catch (err) {
        res.status(500).json({ message: 'Failed to fetch token balance', error: err.message });
    }
});

module.exports = router;
