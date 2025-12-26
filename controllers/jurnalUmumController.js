const Jurnal = require("../models/jurnalUmumModel");

exports.getAllJurnal = (req, res) => {
  Jurnal.getAll((err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Gagal mengambil data jurnal",
        error: err
      });
    }

    res.json(results);
  });
};

exports.getJurnalById = (req, res) => {
  const { id } = req.params;

  Jurnal.getById(id, (err, results) => {
    if (err) {
      return res.status(500).json({
        message: "Gagal mengambil data jurnal",
        error: err
      });
    }

    if (results.length === 0) {
      return res.status(404).json({
        message: "Jurnal tidak ditemukan"
      });
    }

    res.json(results[0]);
  });
};

exports.updateJurnal = (req, res) => {
  const { id } = req.params;
  const {
    tanggal,
    keterangan,
    id_coa,
    nominal,
    tipe_balance
  } = req.body;

  let debit = 0;
  let kredit = 0;

  if (tipe_balance === "debit") {
    debit = nominal;
  } else if (tipe_balance === "kredit") {
    kredit = nominal;
  }

  const payload = {
    tanggal,
    keterangan,
    id_coa,
    debit,
    kredit
  };

  Jurnal.update(id, payload, (err) => {
    if (err) {
      return res.status(500).json({
        message: "Gagal mengupdate jurnal",
        error: err
      });
    }

    res.json({
      message: "Jurnal berhasil diperbarui"
    });
  });
};

exports.deleteJurnal = (req, res) => {
  const { id } = req.params;

  Jurnal.delete(id, (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Gagal menghapus jurnal",
        error: err
      });
    }

    res.json({
      message: "Jurnal berhasil dihapus"
    });
  });
};
