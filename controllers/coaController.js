const Coa = require("../models/coaModel");

// READ all
exports.getAkun = (req, res) => {
  Coa.getAll((err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// CREATE
exports.createAkun = (req, res) => {
  const { kode_akun, nama_akun, header_akun, tipe_balance, is_active } = req.body;

  const data = {
    kode_akun,
    nama_akun,
    header_akun: header_akun || null,
    tipe_balance,
    is_active: is_active ?? 1,
  };

  Coa.create(data, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Akun created!", id: result.insertId });
  });
};

// UPDATE
exports.updateAkun = (req, res) => {
  const { kode_akun } = req.params;
  const data = req.body;

  Coa.update(kode_akun, data, (err, result) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Akun updated!" });
  });
};

// DELETE
exports.deleteAkun = (req, res) => {
  const { kode_akun } = req.params;

  Coa.delete(kode_akun, (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Akun deleted!" });
  });
};
