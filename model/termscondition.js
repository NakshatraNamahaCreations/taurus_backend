const mongoose = require('mongoose');

const termSchema = new mongoose.Schema({
    clientId: {
        type: mongoose.Schema.Types.ObjectId, 
        required: true,
        ref: 'Client'
    },
    clientName: {
        type: String,
        required: true
    },
    title: {
        type: String,
        required: true
    },
    points: [
        {
            pointNumber: { type: Number, required: true },
            description: { type: String, required: true }
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model('Terms', termSchema);
