const JurnalDP = require("../models/jurnalDPModel");

// GET ALL
exports.getJurnalDP = (req, res) => {
  JurnalDP.getAll((err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// UPDATE JURNAL DP
exports.updateJurnalDP = (req, res) => {
  const { id } = req.params;
  const { tanggal, nominal, keterangan } = req.body;

  if (!tanggal || !nominal) {
    return res.status(400).json({
      message: "Tanggal dan nominal wajib diisi"
    });
  }

  // 🔒 CEK STATUS DP
  JurnalDP.getById(id, (err, rows) => {
    if (err) return res.status(500).json(err);

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Jurnal DP tidak ditemukan"
      });
    }

    if (rows[0].status === "Lunas") {
      return res.status(403).json({
        message: "Jurnal DP tidak bisa diubah karena DP sudah lunas"
      });
    }

    // ✅ UPDATE
    JurnalDP.update(
      id,
      { tanggal, nominal, keterangan },
      (err2, result) => {
        if (err2) return res.status(500).json(err2);

        res.json({
          message: "Jurnal DP berhasil diupdate"
        });
      }
    );
  });
};

// DELETE JURNAL DP
exports.delete = (req, res) => {
  const { id } = req.params;

  // 🔒 CEK STATUS DP
  JurnalDP.getById(id, (err, rows) => {
    if (err) return res.status(500).json(err);

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Jurnal DP tidak ditemukan"
      });
    }

    if (rows[0].status === "Lunas") {
      return res.status(403).json({
        message: "Jurnal DP tidak bisa dihapus karena DP sudah lunas"
      });
    }

    // ✅ DELETE
    JurnalDP.deleteById(id, (err2, result) => {
      if (err2) return res.status(500).json(err2);

      res.json({
        message: "Jurnal DP berhasil dihapus"
      });
    });
  });
};
