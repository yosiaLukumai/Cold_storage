const fridgeModel = require("./../models/fridges");
const userModel = require("./../models/users")
const createOutput = require("../utils").createOutput;
const LogModal = require("./../models/logs")
const io = require("./../index");


const SaveLogData = async (req, res) => { 
    try {
        const { fridgeID, roomtemp, roomhum, fridgeMax, fridgeMin } = req.body
      
            const created = await LogModal.create({ fridgeID, roomtemp, roomhum, fridgeMax, fridgeMin })
            if (created) {
                return res.json(createOutput(true, created))
            } else {
                return res.json(createOutput(true, "Failed to save log"))
            }

     
    } catch (error) {
        return res.json(createOutput(false, error.message, true));
    }
}

const RegisterFridge = async (req, res) => {
    try {
        const { fridgeID, fridgeSize, userId } = req.body
        const found = await userModel.findOne({ _id: userId });
        if (found) {
            const created = await fridgeModel.create({ userId, fridgeID, fridgeSize })
            if (created) {
                return res.json(createOutput(true, created))
            } else {
                return res.json(createOutput(true, "Failed to save fridge"))
            }

        } else {
            return res.json({ status: 0, message: "No such user." })
        }
    } catch (error) {
        return res.json(createOutput(false, error.message, true));
    }
}


const FridgesOptions = async (req, res) => {
    try {
        const result = await fridgeModel.aggregate([
            {
                $group: {
                    _id: null, // No specific grouping criteria, so group all documents
                    count: { $sum: 1 }, // Calculate total count of documents
                    fridges: { $push: { fridgeID: "$fridgeID" } }, // Push fridgeID into an array
                },
            },
            {
                $project: {
                    _id: 0, // Exclude the _id field
                    count: 1, // Include the count field
                    fridges: {
                        $map: {
                            input: "$fridges", // Iterate over the array of fridges
                            as: "fridge", // Alias for each item
                            in: { value: "$$fridge.fridgeID", label: "$$fridge.fridgeID" }, // Map to { value, label }
                        },
                    },
                },
            },
        ]);
        if (result) {
            return result.length ? res.json(createOutput(true, result[0])) : res.json(createOutput(true, { count: 0, fridges: [] }));
        }
        else {
            return res.json(createOutput(false, null))
        }
    } catch (error) {
        return res.json(createOutput(false, error.message, true));
    }
}
const GetLogsSpecific = async (req, res) => {
    try {
        let parameter = req.params.parameter
        let fridgeID = req.params.fridgeID 
        const results = await LogModal.find({fridgeID: String(fridgeID)},  `${parameter} createdAt`).sort({ createdAt: -1 });
        if(results) {
            return res.json(createOutput(true, results))
        }else {
            return res.json(createOutput(false, null)) 
        }
    } catch (error) {
        return res.json(createOutput(false, error.message, true));
    }
}
const FridgesWithID = async (req, res) => {
    try {
        const fridgeId = req.params.fridgeId
        const result = await LogModal.aggregate([
            {
              $match: { fridgeID: fridgeId } // Stage 1: Match the fridgeID
            },
            {
              $facet: {
                kpi: [
                  { 
                    $sort: { createdAt: -1 } // Sort by createdAt in descending order
                  },
                  { 
                    $limit: 1 // Limit to the most recent entry for KPI
                  },
                  { 
                    $project: { // Project the required fields for KPI
                      _id: 0,
                      roomtemp: 1,
                      roomhum: 1,
                      fridgeMin: 1,
                      fridgeMax: 1,
                      createdAt: 1 // Include the createdAt timestamp
                    }
                  }
                ],
                lastFiveLogs: [
                  { $sort: { createdAt: -1 } }, // Sort by createdAt in descending order
                  { $limit: 5 }, // Limit to the last 5 entries
                  {
                    $project: { // Project only the fields needed for plotting
                      _id: 0,
                      roomtemp: 1,
                      roomhum: 1,
                      fridgeMin: 1,
                      fridgeMax: 1,
                      createdAt: 1 // Include the createdAt timestamp for x-axis plotting
                    }
                  }
                ]
              }
            }
          ]);
      
          const kpi = result[0].kpi.length ? result[0].kpi[0] : null; // Get the last log for KPI, or null if no logs exist
          const lastFiveLogs = result[0].lastFiveLogs.reverse();
        if (kpi && lastFiveLogs) {
            return res.json(createOutput(true, {
                kpi,
                lastFiveLogs
            }))
        } else {
            return res.json(createOutput(false, "No logs saved"))
        }
    } catch (error) {
        return res.json(createOutput(false, error.message, true));
    }
}




module.exports = {
    RegisterFridge,
    FridgesOptions,
    FridgesWithID,
    SaveLogData,
    GetLogsSpecific
}
