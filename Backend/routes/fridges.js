const router = require('express').Router()
const fridgeController = require("../controllers/fridge")

const FridgesRoutes = (app) => {
    router.post("/register", fridgeController.RegisterFridge)
    router.get("/options", fridgeController.FridgesOptions)
    // data/specific/${parameter}/${workingfridge}}/${retriveData("ColdStorage")._id
    router.post("/save/log", fridgeController.SaveLogData)
    router.get('/fridges/:fridgeId', fridgeController.FridgesWithID)
    router.get("/data/specific/:parameter/:fridgeID/:userID", fridgeController.GetLogsSpecific)
    return app.use("/fridge", router)
}

module.exports = {
    FridgesRoutes
}