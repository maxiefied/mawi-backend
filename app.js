require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const authRoutes = require("./routes/authRoutes");
const powerRoutes = require("./routes/powerRoutes");
const mpesaRoutes = require("./routes/mpesaRoutes");

const app = express(); // ✅ Move this above app.use()

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/power", powerRoutes);
app.use("/api/mpesa", mpesaRoutes); // ✅ Now it's safe to use

mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");
        app.get("/api/test", (req, res) => {
            res.json({ message: "MAWI server is working!" });
        });

        app.listen(process.env.PORT || 5000, () => {
            console.log(`Server running on port ${process.env.PORT || 5000}`);
        });
    })
    .catch((err) => console.error("Mongo Error:", err));
