const express = require("express");
const { sensorController } = require("../controllers/sensor.controller");

const router = express.Router();

// GET: Get all with pagination + multi-filter
router.get("/", sensorController.getAll);

// DELETE: Delete all sensor records
router.delete("/", sensorController.deleteAll);

// DELETE: Delete per-row
router.delete("/:id", sensorController.deleteOne);


module.exports = router;
