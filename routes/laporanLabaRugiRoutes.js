const express = require("express");
const router = express.Router();
const controller = require("../controllers/laporanLabaRugiController");

router.get("/", controller.getAll);
router.get("/generate", controller.generate);

module.exports = router;