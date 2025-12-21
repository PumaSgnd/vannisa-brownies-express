const express = require("express");
const router = express.Router();
const BukuBesarController = require("../controllers/bukuBesarController");

router.get("/", BukuBesarController.getBukuBesar);

module.exports = router;