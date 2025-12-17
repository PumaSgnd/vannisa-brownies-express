const express = require("express");
const router = express.Router();

const {
  getDP,
  createDP,
  deleteDP,
  lunasiDP
} = require("../controllers/dpController");

router.get("/", getDP);
router.post("/", createDP);
router.post("/:id/lunasi", lunasiDP);
router.delete("/:id", deleteDP);

module.exports = router;