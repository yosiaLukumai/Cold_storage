const mongoose = require("mongoose")

// Room Temperature, Room humidity, fridge maximum temperature, fridge minimum temperature

const data = mongoose.Schema({
    fridgeID: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    temp: {
        type: Number,
        required: true
    },
    hum: {
        type: Number,
        required: true
    },
    size: {
        type: Number,
        required: true
    }

  
}, {
    timestamps: true
})



     

module.exports = mongoose.model("data", data)
