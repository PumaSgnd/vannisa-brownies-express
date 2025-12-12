const express = require("express");
const router = express.Router();

const { getJurnal, updateJurnal, deleteJurnal } = require("../controllers/jurnalBebanController");

router.get("/", getJurnal);
router.put("/:id", updateJurnal);
router.delete("/:id", deleteJurnal);

module.exports = router;
