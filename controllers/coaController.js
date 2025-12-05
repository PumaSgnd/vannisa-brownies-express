const db = require("../config/db");

// Read All
exports.getAkun = (req, res) => {
  db.query("SELECT * FROM akun", (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
};

// Create
exports.createAkun = (req, res) => {
  const { kode_akun, nama_akun } = req.body;
  db.query(
    "INSERT INTO akun SET ?",
    { kode_akun, nama_akun },
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Akun created!" });
    }
  );
};

// Update
exports.updateAkun = (req, res) => {
  const { kode_akun } = req.params;
  const { nama_akun } = req.body;
  db.query(
    "UPDATE akun SET nama_akun=? WHERE kode_akun=?",
    [nama_akun, kode_akun],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Akun updated!" });
    }
  );
};

// Delete
exports.deleteAkun = (req, res) => {
  const { kode_akun } = req.params;
  db.query(
    "DELETE FROM akun WHERE kode_akun=?",
    [kode_akun],
    (err, result) => {
      if (err) return res.status(500).send(err);
      res.json({ message: "Akun deleted!" });
    }
  );
};
