const router = require('express').Router()
const fridgeController = require("../controllers/fridge")
const dataController = require("../controllers/data")

const FridgesRoutes = (app) => {
    router.post("/register", fridgeController.RegisterFridge)
    router.get("/options", fridgeController.FridgesOptions)
    // data/specific/${parameter}/${workingfridge}}/${retriveData("ColdStorage")._id
    router.post("/save/log", fridgeController.SaveLogData)
    router.get('/fridges/:fridgeId', fridgeController.FridgesWithID)
    router.get("/data/specific/:parameter/:fridgeID/:userID", fridgeController.GetLogsSpecific)
    // parameter, workingfridge, filterOption
    router.get("/export/:parameter/:workingfridge/:filterOption/export-all",dataController.exportData)
    return app.use("/fridge", router)
}

module.exports = {
    FridgesRoutes
}