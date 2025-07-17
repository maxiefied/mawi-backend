const mongoose = require('mongoose');

const PowerSchema = new mongoose.Schema({
    timestamp: { type: Date, default: Date.now },
    current: Number,
    voltage: Number,
    power: Number,

    // Appliance relay states
    appliances: {
        circuit: { type: Boolean, default: false },
        bulb: { type: Boolean, default: false },
        socket: { type: Boolean, default: false },
        shower: { type: Boolean, default: false },
        cooker: { type: Boolean, default: false }
    }
});

module.exports = mongoose.model('Power', PowerSchema);
