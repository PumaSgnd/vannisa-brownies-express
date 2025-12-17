const express = require("express");
const router = express.Router();

const { getJurnalDP } = require("../controllers/jurnalDPController");

router.get("/", getJurnalDP);

module.exports = router;
