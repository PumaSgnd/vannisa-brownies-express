const db = require("../config/db");

// GET ALL JURNAL DP (HANYA DP BELUM LUNAS)
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
      j.created_at,
      dp.status
    FROM jurnal_dp j
    JOIN down_payment dp ON dp.id = j.id_dp
    WHERE dp.status = 'Belum Lunas'
    ORDER BY j.id DESC
  `;
  db.query(sql, callback);
};

// GET JURNAL BY ID (UNTUK VALIDASI)
exports.getById = (id_jurnal_dp, callback) => {
  const q = `
    SELECT j.*, dp.status
    FROM jurnal_dp j
    JOIN down_payment dp ON dp.id = j.id_dp
    WHERE j.id = ?
  `;
  db.query(q, [id_jurnal_dp], callback);
};

exports.createBatch = (data, callback) => {
  const sql = `
    INSERT INTO jurnal_dp
    (id_dp, tanggal, kode, nominal, tipe_balance, keterangan, created_at)
    VALUES ?
  `;

  const values = data.map(item => [
    item.id_dp,
    item.tanggal,
    item.kode,
    item.nominal,
    item.tipe_balance,
    item.keterangan,
    item.created_at
  ]);

  db.query(sql, [values], callback);
};

// UPDATE
exports.update = (id_jurnal_dp, data, callback) => {
  const q = `
    UPDATE jurnal_dp
    SET tanggal = ?,
        nominal = ?,
        keterangan = ?
    WHERE id = ?
  `;
  db.query(
    q,
    [data.tanggal, data.nominal, data.keterangan, id_jurnal_dp],
    callback
  );
};

// DELETE BY JURNAL ID
exports.deleteById = (id_jurnal_dp, callback) => {
  const q = `DELETE FROM jurnal_dp WHERE id = ?`;
  db.query(q, [id_jurnal_dp], callback);
};
