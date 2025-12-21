const express = require("express");
const router = express.Router();
const LaporanPenjualanController = require("../controllers/laporanPenjualanController");

router.get("/", LaporanPenjualanController.getAll);
router.get("/generate", LaporanPenjualanController.generate);
// router.get("/export", LaporanPenjualanController.exportPDF);

module.exports = router;