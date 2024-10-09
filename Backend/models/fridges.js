const mongoose = require("mongoose")

const fridge = mongoose.Schema({
    userId: {
        type: mongoose.Types.ObjectId,
        required: true,
    },
    fridgeID: {
        type: String,
        required: true
    },
    fridgeSize: {
        type: String,
        required: true
    }, 
}, {
    timestamps: true
})



     

module.exports = mongoose.model("fridge", fridge)
