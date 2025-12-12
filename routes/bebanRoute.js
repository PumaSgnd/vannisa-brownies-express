const express = require("express");
const router = express.Router();

const {
  getBeban,
  createBeban,
  updateBeban,
  deleteBeban
} = require("../controllers/bebanController");

router.get("/", getBeban);
router.post("/", createBeban);
router.put("/:id", updateBeban);
router.delete("/:id", deleteBeban);

module.exports = router;
