const express = require("express");
const router = express.Router();

const {
  getJurnalDP,
  updateJurnalDP,
  delete: deleteJurnalDP
} = require("../controllers/jurnalDPController");

router.get("/", getJurnalDP);
router.put("/:id", updateJurnalDP);
router.delete("/:id", deleteJurnalDP);

module.exports = router;
