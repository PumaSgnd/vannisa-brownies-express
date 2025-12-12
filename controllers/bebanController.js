const Beban = require("../models/bebanModel");
const JurnalBeban = require("../models/jurnalBebanModel");

// GET ALL
exports.getBeban = (req, res) => {
  Beban.getAll((err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

// CREATE
exports.createBeban = (req, res) => {
  const { jenis_beban, kode_akun, nominal, keterangan, id_user, tanggal_beban } = req.body;

  const data = {
    jenis_beban,
    kode_akun,
    nominal,
    tanggal_beban,
    keterangan,
    id_user,
    created_at: new Date(),
    updated_at: new Date(),
  };

  Beban.create(data, (err, result) => {

    if (err) {
      console.log("ERROR BEBAN:", err);
      return res.status(500).json(err);
    }

    const id_beban = result.insertId;

    // AUTO CREATE JURNAL memakai kode_akun
    const jurnal = {
      id_beban,
      tanggal: tanggal_beban,
      kode: kode_akun,   // <-- pakai kode akun dari COA
      nominal,
      tipe_balance: "debit",
      keterangan,
      created_at: new Date(),
    };

    JurnalBeban.create(jurnal, (err2) => {
      if (err2) return res.status(500).json(err2);
      res.json({ message: "Beban + Jurnal created", id: id_beban });
    });
  });
};

// UPDATE
exports.updateBeban = (req, res) => {
  const { id } = req.params;
  const {
    jenis_beban,
    kode_akun,
    nominal,
    keterangan,
    tanggal_beban,
    id_user
  } = req.body;

  const data = {
    jenis_beban,
    kode_akun,
    nominal,
    tanggal_beban,
    keterangan,
    id_user,
    updated_at: new Date(),
  };

  Beban.update(id, data, (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Beban updated" });
  });
};

// DELETE
exports.deleteBeban = (req, res) => {
  const { id } = req.params;

  Beban.delete(id, (err) => {
    if (err) return res.status(500).json(err);

    JurnalBeban.deleteByBeban(id, (err2) => {
      if (err2) return res.status(500).json(err2);

      res.json({ message: "Beban + Jurnal deleted" });
    });
  });
};
