const mongoose = require("mongoose")

const logs = mongoose.Schema({
    fridgeID: {
        type: String,
        required: true
    },
    roomtemp: {
        type: Number,
        required: true
    },
    roomhum: {
        type: Number,
        required: true
    },
    fridgeMax: {
        type: Number,
        required: true
    },
    fridgeMin: {
        type: Number,
        required: true
    }
}, {
    timestamps: true
})





module.exports = mongoose.model("logs", logs)
