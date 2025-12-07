const express = require("express");
const router = express.Router();
const pelangganController = require("../controllers/pelangganController");

// Routes
router.get("/", pelangganController.getAll);
router.get("/:id", pelangganController.getById);
router.post("/", pelangganController.create);
router.put("/:id", pelangganController.update);
router.delete("/:id", pelangganController.delete);

module.exports = router;
