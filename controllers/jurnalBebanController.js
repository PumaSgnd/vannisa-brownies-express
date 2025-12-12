const JurnalBeban = require("../models/jurnalBebanModel");

// GET ALL JURNAL
exports.getJurnal = (req, res) => {
  JurnalBeban.getAll((err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.updateJurnal = (req, res) => {
  const { id } = req.params;
  const { tanggal, kode, nominal, tipe_balance, keterangan } = req.body;

  const data = {
    tanggal,
    kode,
    nominal,
    tipe_balance,
    keterangan,
    updated_at: new Date()
  };

  JurnalBeban.update(id, data, (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Jurnal updated" });
  });
};

// DELETE JURNAL MANUAL
exports.deleteJurnal = (req, res) => {
  const { id } = req.params;

  JurnalBeban.delete(id, (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Jurnal deleted" });
  });
};
