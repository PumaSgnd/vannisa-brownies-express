const BukuBesarModel = require("../models/bukuBesarModel");

const BukuBesarController = {

  getBukuBesar: async (req, res) => {
    try {
      const data = await BukuBesarModel.getAll();
      res.json(data);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Gagal mengambil data buku besar" });
    }
  },

  getByAkun: async (req, res) => {
    try {
      const { id_coa } = req.params;
      const data = await BukuBesarModel.getByAkun(id_coa);
      res.json(data);
    } catch (err) {
      res.status(500).json({ error: "Gagal ambil buku besar" });
    }
  }
};

module.exports = BukuBesarController;
