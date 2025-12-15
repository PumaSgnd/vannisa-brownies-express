const Jurnal = require("../models/jurnalPenjualanModel");

/**
 * GET ALL JURNAL PENJUALAN
 * Hanya transaksi dengan status = 'diverifikasi'
 */
exports.getAll = (req, res) => {
  Jurnal.getAll((err, rows) => {
    if (err) {
      console.error("ERROR GET JURNAL:", err);
      return res.status(500).json({
        message: "Gagal mengambil data jurnal penjualan"
      });
    }
    res.json(rows);
  });
};

/**
 * UPDATE JURNAL PENJUALAN
 */
exports.update = (req, res) => {
  const id = req.params.id;

  const {
    tanggal,
    id_coa,
    nominal,
    tipe_balance,
    keterangan
  } = req.body;

  // validasi wajib
  if (!id_coa || !nominal) {
    return res.status(400).json({
      message: "id_coa dan nominal wajib diisi"
    });
  }

  const data = {
    tanggal,
    id_coa,
    nominal,
    tipe_balance: tipe_balance || "kredit",
    keterangan
  };

  Jurnal.update(id, data, (err, result) => {
    if (err) {
      console.error("ERROR UPDATE JURNAL:", err);
      return res.status(500).json({
        message: "Gagal mengupdate jurnal penjualan"
      });
    }

    // mysql / mysql2 safe check
    if (!result || result.affectedRows === 0) {
      return res.status(404).json({
        message: "Data jurnal tidak ditemukan"
      });
    }

    res.json({
      message: "Jurnal penjualan berhasil diupdate"
    });
  });
};

/**
 * DELETE JURNAL PENJUALAN
 */
exports.delete = (req, res) => {
  const id = req.params.id;

  Jurnal.delete(id, (err, result) => {
    if (err) {
      console.error("ERROR DELETE JURNAL:", err);
      return res.status(500).json({
        message: "Gagal menghapus jurnal penjualan"
      });
    }

    if (!result || result.affectedRows === 0) {
      return res.status(404).json({
        message: "Data jurnal tidak ditemukan"
      });
    }

    res.json({
      message: "Jurnal penjualan berhasil dihapus"
    });
  });
};
