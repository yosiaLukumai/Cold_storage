const mongoose = require("mongoose")

//u3ldmau9lXwZoUje
let url = ""
let urls = ""

const connectDb = async () => {
    console.log("trying connecting to the database...");
    mongoose.set('strictQuery', false);
    var connected = await mongoose.connect(process.env.DB_CONNECTION)
    if (connected) {
        console.log("sucessfully connected to db")
    } else {
        console.log("Failed to connect to database")
    }
}



const reconnect = async () => {
    try {
        let connected = await mongoose.connect("");
        console.log(connected);
        return connected;
    } catch (error) {
        console.log("Error in reconnecting");
        return error
    }

}


const connectDB = async () => {
    try {
        mongoose.set('strictQuery', false);
        await mongoose.connect("", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected...');
    } catch (err) {
        console.error(err.message);
        // make the process fail
        process.exit(1);
    }
}


const LastDayAVGAggregator= (startingDate=new Date("Tue, 28 May 2024 00:00:00 GMT")) => {
    return [
        {
            '$match': {
                'createdAt': {
                    '$gte': startingDate
                }
            }
        }, {
            '$group': {
                '_id': {
                    '$dateToString': {
                        'format': '%Y-%m-%d',
                        'date': '$createdAt'
                    }
                },
                'avg': {
                    '$avg': '$average'
                }
            }
        }, {
            '$sort': {
                '_id': 1
            }
        }, {
            '$limit': 6
        }
    ];
}

module.exports = {
    connectDb,
    reconnect,
    connectDB,
    LastDayAVGAggregator
}
