const mongoose = require("mongoose")
const boxes = mongoose.Schema({
    average: Number,
    rectangles: [{
        area: Number,
        height: Number,
        width: Number,
        x: Number,
        y: Number
    }]
}, {
    timestamps: true
});





module.exports = mongoose.model("boxes", boxes)
