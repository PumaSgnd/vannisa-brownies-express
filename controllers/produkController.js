const Produk = require("../models/produkModel");

const produkController = {
  getAll: (req, res) => {
    Produk.getAll((err, results) => {
      if (err) return res.status(500).json({ error: err });
      res.json(results);
    });
  },

  getById: (req, res) => {
    const { id } = req.params;
    Produk.getById(id, (err, results) => {
      if (err) return res.status(500).json({ error: err });
      if (results.length === 0)
        return res.status(404).json({ message: "Produk tidak ditemukan" });

      res.json(results[0]);
    });
  },

  create: (req, res) => {
    const data = req.body;

    Produk.create(data, (err, results) => {
      if (err) return res.status(500).json({ error: err });

      res.json({
        message: "Produk berhasil ditambahkan",
        id_produk: results.insertId,
      });
    });
  },

  update: (req, res) => {
    const { id } = req.params;
    const data = req.body;

    Produk.update(id, data, (err, results) => {
      if (err) return res.status(500).json({ error: err });

      res.json({ message: "Produk berhasil diupdate" });
    });
  },

  delete: (req, res) => {
    const { id } = req.params;

    Produk.delete(id, (err, results) => {
      if (err) return res.status(500).json({ error: err });

      res.json({ message: "Produk berhasil dihapus" });
    });
  },
};

module.exports = produkController;
