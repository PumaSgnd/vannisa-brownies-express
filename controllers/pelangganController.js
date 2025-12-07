const Pelanggan = require("../models/pelangganModel");

// Get all
exports.getAll = (req, res) => {
  Pelanggan.getAll((err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
};

// Get by ID
exports.getById = (req, res) => {
  Pelanggan.getById(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(404).json({ message: "Pelanggan tidak ditemukan" });
    res.json(result[0]);
  });
};

// Create
exports.create = (req, res) => {
  const { nama, alamat, no_telp, email } = req.body;

  if (!nama || !alamat || !no_telp) {
    return res.status(400).json({ message: "Semua field wajib diisi" });
  }

  Pelanggan.create({ nama, alamat, no_telp, email }, (err, result) => {
    if (err) return res.status(500).json({ error: err });

    res.json({
      id_pelanggan: result.insertId,
      nama,
      alamat,
      no_telp,
      email,
      created_at: new Date().toISOString().split("T")[0],
      updated_at: null,
    });
  });
};

// Update
exports.update = (req, res) => {
  const { nama, alamat, no_telp, email } = req.body;

  Pelanggan.update(req.params.id, { nama, alamat, no_telp, email }, (err) => {
    if (err) return res.status(500).json({ error: err });

    res.json({
      id_pelanggan: req.params.id,
      nama,
      alamat,
      no_telp,
      email,
      updated_at: new Date().toISOString().split("T")[0],
    });
  });
};

// Delete
exports.delete = (req, res) => {
  Pelanggan.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Pelanggan berhasil dihapus" });
  });
};
