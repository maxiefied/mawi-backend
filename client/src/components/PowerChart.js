import React, { useEffect, useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    TimeScale,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    LineElement,
    CategoryScale,
    LinearScale,
    PointElement,
    TimeScale,
    Title,
    Tooltip,
    Legend
);

const PowerChart = () => {
    const [powerData, setPowerData] = useState([]);
    const [tokenBalance, setTokenBalance] = useState(null);

    const fetchPowerData = async () => {
        try {
            const res = await axios.get("https://mawi-backend.onrender.com/api/power/recent");
            setPowerData(res.data.reverse());
        } catch (err) {
            console.error("Error fetching power data:", err);
        }
    };

    const fetchTokenBalance = async () => {
        try {
            const res = await axios.get("https://mawi-backend.onrender.com/api/mpesa/balance");
            setTokenBalance(res.data.balance);
        } catch (err) {
            console.error("Error fetching token balance:", err);
        }
    };

    useEffect(() => {
        fetchPowerData();
        fetchTokenBalance();

        const interval = setInterval(() => {
            fetchPowerData();
            fetchTokenBalance();
        }, 5000);

        return () => clearInterval(interval);
    }, []);

    const data = {
        labels: powerData.map((entry) =>
            new Date(entry.timestamp).toLocaleTimeString()
        ),
        datasets: [
            {
                label: "Power (Watts)",
                data: powerData.map((entry) => entry.power),
                borderColor: "#007bff",
                backgroundColor: "rgba(0, 123, 255, 0.2)",
                tension: 0.4,
                fill: true,
            },
        ],
    };

    return (
        <div>
            <h2>Live Power Usage</h2>
            <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
                Token Balance: {tokenBalance !== null ? `${tokenBalance} tokens` : "Loading..."}
            </div>
            <Line data={data} />
        </div>
    );
};

export default PowerChart;