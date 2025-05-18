const express = require("express");
const { deviceController } = require("../controllers/device.controller");

const router = express.Router();

router.get("/", deviceController.getAll);
router.get("/status", deviceController.getStatus);
router.post("/toggle", deviceController.toggle);

// ✅ New routes:
router.delete("/", deviceController.deleteAll);
router.delete("/:id", deviceController.deleteOne);

module.exports = router;
