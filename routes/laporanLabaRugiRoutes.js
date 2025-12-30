const express = require("express");
const router = express.Router();
const controller = require("../controllers/laporanLabaRugiController");

router.get("/", controller.getAll);
router.get("/generate", controller.generate);
router.get("/:id/detail", controller.getDetailLaporan);

module.exports = router;