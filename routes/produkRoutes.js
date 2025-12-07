const express = require("express");
const router = express.Router();
const produkController = require("../controllers/produkController");

router.get("/", produkController.getAll);
router.get("/:id", produkController.getById);
router.post("/", produkController.create);
router.put("/:id", produkController.update);
router.delete("/:id", produkController.delete);

module.exports = router;
