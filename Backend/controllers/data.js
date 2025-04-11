const dataModel = require("./../models/data");
const userModel = require("./../models/users");
const LogModal = require("./../models/logs")
const createOutput = require("../utils").createOutput;
const BoxModel = require("../models/Boxs")
const io = require("./../index");
const { LastDayAVGAggregator } = require("../db/connect");
const PDFDocument = require('pdfkit');
const fridges = require("../models/fridges");
const serveData = async (req, res) => {
    try {
        // let { temp, hum, size, deviceId } = req.body;
        let { temp, hum, size } = req.body;
        // query the device id to get userId
        // check the type of the size of the plant
        temp = String(temp);
        hum = String(hum);
        size = String(size);



        // const found = await userModel.findOne({ deviceId: String(deviceId) });
        const found = await userModel.findOne({ deviceId: 1000 });
        if (found) {
            // save the data to the database
            const saved = await dataModel.create({ userId: found?._id, temp, hum, size });
            if (saved) {
                // fire a socket to notify there is new data...
                io.Socket.emit("newData", saved)
                return res.json({ status: 1, message: "Data saved sucessfully" })
            } else {
                return res.json({ status: 0, message: "Failed to save the data" })
            }
        } else {
            return res.json({ status: 0, message: "Device not registered..." })
        }
    } catch (error) {
        return res.json(createOutput(false, error.message, true));
    }
}


const serveGraphData = async (req, res) => {
    try {
        const deviceId = req.params.deviceId
        const found = await userModel.findOne({ deviceId: String(deviceId) });
        if (found) {
            const fiveLastData = await dataModel.find({ userId: found?._id }, "temp hum size createdAt", {sort: { createdAt: -1 }}).limit(6).exec();
            
            return res.json(createOutput(true, fiveLastData))
        } else {
            return res.json({ status: 0, message: "Device not registered..." })
        }
    } catch (error) {
        return res.json(createOutput(false, error.message, true));
    }
}


// const exportAllDataPDF = async (req, res) => {
//     try {
//       const { machineId } = req.params;
  
//       // Retrieve all logs for the machine
//       const logs = await logModel.find({ machine: machineId }).sort({ timestamp: -1 });
  
//       if (logs.length === 0) {
//         return res.json(createOutput(false, "No log data found for this machine"));
//       }
  
//       // Create a new PDF document
//       const doc = new PDFDocument();
//       const filePath = path.join(__dirname, `reports/machine_${machineId}_all_data.pdf`);
  
//       // Ensure the directory exists
//       if (!fs.existsSync(path.dirname(filePath))) {
//         fs.mkdirSync(path.dirname(filePath), { recursive: true });
//       }
  
//       // Save the PDF to a file
//       const writeStream = fs.createWriteStream(filePath);
//       doc.pipe(writeStream);
  
//       // Add a title
//       doc.fontSize(20).text("Machine Data Report", { align: "center" });
//       doc.moveDown();
  
//       // Add general machine information
//       doc.fontSize(14).text(`Machine ID: ${machineId}`);
//       doc.text(`Total Logs: ${logs.length}`);
//       doc.text(`Generated At: ${new Date().toLocaleString()}`);
//       doc.moveDown();
  
//       logs.forEach((log, index) => {
//         doc.fontSize(12).text(`Log #${index + 1}`);
//         doc.text(`  Timestamp: ${log.createdAt.toLocaleString()}`);
//         doc.text(`  Temperature: ${log.data.temperature} °C`);
//         doc.text(`  Humidity: ${log.data.humidity} %`);
//         doc.text(`  pH: ${log.data.pH}`);
//         doc.text(`  EC: ${log.data.EC} µs/cm`);
//         doc.text(`  N: ${log.data.N} mg/kg`);
//         doc.text(`  P: ${log.data.P} mg/kg`);
//         doc.text(`  K: ${log.data.K} mg/kg`);
//         doc.moveDown();
//       });
  
//       // Finalize the PDF
//       doc.end();
  
//       // Wait for the stream to finish
//       writeStream.on("finish", () => {
//         res.setHeader("Content-Type", "application/pdf");
//         res.download(filePath, `machine_${machineId}_all_data.pdf`, (err) => {
//           if (err) {
//             console.error("Error sending file:", err.message);
//           }
  
//           // Clean up the file after sending
//           try {
//             fs.unlinkSync(filePath);
//           } catch (unlinkError) {
//             console.error("Error deleting file:", unlinkError.message);
//           }
//         });
//       });
  
//       // Handle stream errors
//       writeStream.on("error", (err) => {
//         console.error("Error writing PDF:", err.message);
//         return res.json(createOutput(false, "Error generating PDF", true));
//       });
//     } catch (error) {
//       console.error(error.message);
//       return res.json(createOutput(false, error.message, true));
//     }
//   };


const exportData = async (req, res) => {
    try {
        
        const { parameter, workingfridge, filterOption } = req.params;
        const { startDate, endDate } = req.query;

        // query firt the fridge
        let fridge = await fridges.findOne({fridgeID: workingfridge})
        if(!fridge) {
            return res.status(404).send('No such fridge.');
        }

        
        // workingfridge = fridge._id
    
        let query = { fridgeID: fridge._id };
    
        if (filterOption === 'range' && startDate && endDate) {
          query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
        } else if (filterOption === 'week') {
          const today = new Date();
          const oneWeekAgo = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
          query.createdAt = { $gte: oneWeekAgo, $lte: today };
        } else if (filterOption === 'month') {
          const today = new Date();
          const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
          const lastDayOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          query.createdAt = { $gte: firstDayOfMonth, $lte: lastDayOfMonth };
        }

        
    
        const logs = await LogModal.find(query).sort({ createdAt: 1 });

    
        if (!logs || logs.length === 0) {
          return res.status(404).send('No data found for the specified criteria.');
        }
    
        const doc = new PDFDocument();
    
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', 'attachment; filename="logs.pdf"');
    
        doc.pipe(res);
    
        doc.fontSize(16).text(`${parameter} Logs Export`, { align: 'center' });
        doc.moveDown();
    
        const tableTop = doc.y;
        const columnWidths = [100, 80, 80, 80, 80, 120];
        const columnHeadings = ['Fridge ID', 'Room Temp', 'Room Hum', 'Fridge Max', 'Fridge Min', 'Timestamp'];
    
        // Table Header
        let currentX = 50;
        columnHeadings.forEach((heading, index) => {
          doc.rect(currentX, tableTop, columnWidths[index], 20).stroke();
          doc.text(heading, currentX + 5, tableTop + 5);
          currentX += columnWidths[index];
        });
    
        // Table Data
        let rowTop = tableTop + 20;
        logs.forEach((log) => {
          currentX = 50;
          const rowData = [
            log.fridgeID,
            log.roomtemp,
            log.roomhum,
            log.fridgeMax,
            log.fridgeMin,
            log.createdAt.toISOString(),
          ];
    
          rowData.forEach((data, index) => {
            doc.rect(currentX, rowTop, columnWidths[index], 20).stroke();
            doc.text(String(data), currentX + 5, rowTop + 5);
            currentX += columnWidths[index];
          });
          rowTop += 20;
        });

        console.log("ending...");
        
    
        doc.end();
        
    } catch (error) {
        return res.json(createOutput(false, error.message, true));
    }
}

const fetchDataLogs = async (req, res) => {
    try {
        let parameter = req.params.parameter
        let userId = req.params.id
        let phase = req.params.phase
        // console.log(phase, phase=="1", phase=="2", phase=="3")
        let user = await userModel.findById(userId)
        let dateFilter = new Date("May 10, 2024 06:36:12")
        let dateFilterMid = new Date("July 15,2024 08:30:00")
        if (user) {
            // checking if the parameter is of what type
            if (parameter == "Temperature") {
                let data;
                if (phase == "1") {
                    data = await dataModel.find({ userId, createdAt: { $lte: dateFilter } }, "temp createdAt", { sort: { createdAt: -1 } }).exec();
                }
                else if(phase == "2") {
                    data = await dataModel.find({ userId, createdAt: { $gte: dateFilter, $lte: dateFilterMid } }, "temp createdAt", { sort: { createdAt: -1 } }).exec();
                }
                else {
                    data = await dataModel.find({ userId, createdAt: { $gte: dateFilterMid } }, "temp createdAt", { sort: { createdAt: -1 } }).exec();
                }
                return res.json(createOutput(true, data))
            }
            if (parameter == "Humidity") {
                let data;
                if (phase == "1") {
                    data = await dataModel.find({ userId, createdAt: {$lte: dateFilter} }, "hum createdAt", { sort: { createdAt: -1 } }).exec();
                }
                else if(phase == "2") {
                    // $gte: dateFilter, $lte: dateFilterMid
                    data = await dataModel.find({ userId, createdAt: {  $gte: dateFilter, $lte: dateFilterMid } }, "hum createdAt", { sort: { createdAt: -1 } }).exec();

                }
                else {
                    data = await dataModel.find({ userId, createdAt: { $gte: dateFilterMid } }, "hum createdAt", { sort: { createdAt: -1 } }).exec();
                }
                return res.json(createOutput(true, data))
            }
            if (parameter == "size") {
                let data;
                if (phase == "1") {
                    data = await BoxModel.find(null, "average rectangles createdAt", { sort: { createdAt: -1 } }).exec();
                }else if(phase == "2") {
                    data = await BoxModel.find(null, "average rectangles createdAt", { sort: { createdAt: -1 } }).exec();
                }
                else {
                    data = await BoxModel.find(null, "average rectangles createdAt", { sort: { createdAt: -1 } }).exec();
                }
                return res.json(createOutput(true, data))
            }
        } else {
            return res.json(createOutput(true, "No such user", true));
        }




    } catch (error) {
        return res.json(createOutput(false, error.message, true));
    }
}


const FindLastData = async (req, res) => {
    try {

        const id = req.params.id;
        const user = await userModel.findById(id);
        if (user) {
            // tries to retrieve the data
            let retrievedData = await dataModel.findOne({ userId: user._id }, null, { sort: { createdAt: -1 }, limit: 1 }).exec();;
            if (retrievedData) {
                return res.json(createOutput(true, retrievedData))
            } else {
                return res.json(createOutput(true, "Can't retrieve the data"))
            }

        } else {
            return res.json(createOutput(false, "No such user Data", true));
        }
    } catch (error) {
        return res.json(createOutput(false, error.message, true));
    }
}

const SaveImages = async (req, res) => {
    try {

        const deviceId = req.params.deviceId;
        const found = await userModel.findOne({ deviceId: String(deviceId) });
        if (found) {
            // 
        } else {
            return res.json(createOutput(false, "No such device Id", true));
        }


    } catch (error) {
        return res.json(createOutput(false, error.message, true));
    }
}

const FindSizes = async (req, res) => {
    try {
        const deviceId = req.params.deviceId
        const found = await userModel.findOne({ deviceId: String(deviceId) });
        if (found) {
            // let compute for the day and find the last five days
            // Given date
            const givenDate = new Date();
            const sixDaysAgo = new Date(givenDate.getTime() - (6 * 24 * 60 * 60 * 1000));

            // const fiveLastData = await BoxModel.find(null, "average createdAt", { createdAt: -1 }).limit(6).exec();
            let aggregationPipeline = LastDayAVGAggregator(sixDaysAgo)
            const fiveLastData = await BoxModel.aggregate(aggregationPipeline).exec()
            // const fiveLastData = await BoxModel.find(null, "average createdAt", { createdAt: -1 }).limit(6).exec();
            return res.json(createOutput(true, fiveLastData))
        } else {
            return res.json({ status: 0, message: "Device not registered..." })
        }
    } catch (error) {
        return res.json(createOutput(false, error.message, true));
    }
}

module.exports = {
    serveData,
    FindLastData,
    fetchDataLogs,
    serveGraphData,
    SaveImages,
    FindSizes,
    exportData
}
