const express = require("express");
const router = express.Router();
const jurnalController = require("../controllers/JurnalUmumController");

router.get("/", jurnalController.getAllJurnal);
router.get("/:id", jurnalController.getJurnalById);

router.put("/:id", jurnalController.updateJurnal);

router.delete("/:id", jurnalController.deleteJurnal);

module.exports = router;