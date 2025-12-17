const db = require("../config/db");

// GET ALL JURNAL DP
exports.getAll = (callback) => {
  const sql = `
    SELECT 
      j.id AS id_jurnal_dp,
      j.id_dp,
      j.tanggal,
      j.kode,
      j.nominal,
      j.tipe_balance,
      j.keterangan,
      j.created_at
    FROM jurnal_dp j
    JOIN down_payment dp ON dp.id = j.id_dp
    WHERE dp.status = 'Belum Lunas'
    ORDER BY j.id DESC
  `;
  db.query(sql, callback);
};

// CREATE JURNAL DP
exports.create = (data, callback) => {
  db.query("INSERT INTO jurnal_dp SET ?", data, callback);
};

// CHECK EXIST BY DP
exports.getByDP = (id_dp, callback) => {
  db.query(
    "SELECT id FROM jurnal_dp WHERE id_dp = ?",
    [id_dp],
    callback
  );
};
