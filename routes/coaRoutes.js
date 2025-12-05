const express = require("express");
const router = express.Router();
const {
  getAkun,
  createAkun,
  updateAkun,
  deleteAkun,
} = require("../controllers/coaController");

router.get("/", getAkun);
router.post("/", createAkun);
router.put("/:kode_akun", updateAkun);
router.delete("/:kode_akun", deleteAkun);

module.exports = router;
