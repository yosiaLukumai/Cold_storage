const app = require("express")();
const express = require("express");
const dbConfig = require("./db/connect");
const picModel = require("./models/pics")
const multer = require("multer")
const path = require("path")
const userRoutes = require("./routes/users");
const dataRoutes = require("./routes/data")
const FridgesRoutes = require("./routes/fridges")
const cors = require("cors");
const { Server } = require('socket.io')
const http = require("http");
const BoxModel = require("./models/Boxs")
const { createOutput } = require("./utils");
require("dotenv").config();
dbConfig.connectDb();
const net = require('net');

const client = new net.Socket();

// Connect to the Python socket server
const SERVER_HOST = '127.0.0.1';
const SERVER_PORT = 3200;

// function reconnect() {
//   client.connect(SERVER_PORT, SERVER_HOST, function () {
//     console.log('=^^=====Connected to Python socket server.===^^==');
//   });

// }
// Handle data received from the Python socket server
// client.on('data', async function (data) {
//   console.log("=================INCOMING DATA FROM PY SERVER==================");
//   try {
//     let receivedData = JSON.parse(data.toString())
//     console.log("Received data:  ", receivedData);
//     const saved = await BoxModel.create({ average: receivedData.average, rectangles: receivedData.rectangles })
//     if (saved) {
//       console.log("Saved well the rectangelss");
//     } else {
//       console.log("Failed to save the boxess....");
//     }
//     client.destroy()
//   } catch (error) {
//     console.log("Error in parsing the json from the python server");
//     console.log(error.message);
//     client.destroy()
//   }
// });


//cors config
// limiting all the acces that comes from other hosting
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.get("/test", (req, res) => {
  res.send("LOL testing wooh");
});

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); // Uploads will be stored in the "uploads/" directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Unique filename
  },
});

const fileFilter = (req, file, cb) => {
  if (file) {
    cb(null, true); // Accept only image files
  } else {
    cb(new Error('Only images are allowed!'), false);
  }
};

const upload = multer({ storage, fileFilter });


app.post("/data/upload/image/:fridgeID", upload.single("image"), function (req, res, next) {
  try {

    if (!req.file) {
      return res.status(400).send('No file uploaded.');
    }
    let imgPath = path.join("uploads", req.file.filename);
    // saving the image filename into database
    let fridgeID = req.params.fridgeID
    let saved = picModel.create({ imgPath, fridgeID })
    // before this let 
    // reconnect()
    // console.log("Sending file name:   ", req.file.filename);
    // client.write(req.file.filename)
    // if (saved) 
    if (saved) {
      res.json(createOutput(true, "file saved successful.."));

    } else {
      res.json(createOutput(false, "file not saved"));
    }



  } catch (error) {
    res.json(createOutput(false, error.message))
  }

})

// bringing all the routes
userRoutes.userRoutes(app);

// routes for handling the data
dataRoutes.dataRoutes(app);
FridgesRoutes.FridgesRoutes(app)
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

app.get("/data/images/:fridgeID", async (req, res) => {
  try {
    let fridgeID = req.params.fridgeID
    let images = await picModel.find({ fridgeID }, "createdAt imgPath", { sort: { createdAt: -1 } })
    if (images) {
      res.json(createOutput(true, { images }, false))
    } else {
      res.json(createOutput(true, "no saved images"))
    }
  } catch (error) {
    res.json(createOutput(true, error?.message))
  }
})

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
})

io.on("connect", (socket) => {
  console.log('connected')
  socket.on("disconnect", () => {
    console.log("client disconnected..");
  })
})
server.listen(process.env.PORT, () => {
  console.log(`App running and connected to port ${process.env.PORT}`);
});
module.exports.Socket = io





