const express = require("express");
const router = express.Router();
const BukuBesarController = require("../controllers/bukuBesarController");

router.get("/", BukuBesarController.getBukuBesar);
router.get("/:id_coa", BukuBesarController.getByAkun);

module.exports = router;