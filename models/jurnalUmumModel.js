const db = require("../config/db");

exports.getAll = (callback) => {
  const sql = `
    SELECT 
      j.*,
      c.kode_akun,
      c.nama_akun,
      u.nama_lengkap AS user_nama
    FROM jurnal_umum j
    LEFT JOIN coa c ON c.id = j.id_coa
    LEFT JOIN users u ON u.id = j.id_user
    ORDER BY j.tanggal DESC, j.id_jurnal DESC
  `;
  db.query(sql, callback);
};


exports.insert = (data, callback) => {
  db.query("INSERT INTO jurnal_umum SET ?", data, callback);
};

exports.insertBatch = (data, callback) => {
  const sql = `
    INSERT INTO jurnal_umum
    (tanggal, keterangan, id_coa, debit, kredit, sumber,
     id_transaksi, id_dp, id_beban, id_user)
    VALUES ?
  `;
  db.query(sql, [data], callback);
};

exports.getByBeban = (id_beban, callback) => {
  db.query(
    "SELECT * FROM jurnal_umum WHERE sumber='beban' AND id_beban=?",
    [id_beban],
    callback
  );
};

exports.getByTransaksi = (id_transaksi, callback) => {
  db.query(
    "SELECT * FROM jurnal_umum WHERE id_transaksi=?",
    [id_transaksi],
    callback
  );
};

exports.getByDP = (id_dp, callback) => {
  db.query(
    "SELECT * FROM jurnal_umum WHERE sumber='dp' AND id_dp=?",
    [id_dp],
    callback
  );
};

exports.getById = (id, callback) => {
  const sql = `
    SELECT * FROM jurnal_umum
    WHERE id_jurnal = ?
  `;
  db.query(sql, [id], callback);
};

exports.update = (id, data, callback) => {
  const sql = `
    UPDATE jurnal_umum SET
      tanggal = ?,
      keterangan = ?,
      id_coa = ?,
      debit = ?,
      kredit = ?,
      updated_at = NOW()
    WHERE id_jurnal = ?
  `;

  const values = [
    data.tanggal,
    data.keterangan,
    data.id_coa,
    data.debit,
    data.kredit,
    id
  ];

  db.query(sql, values, callback);
};

exports.delete = (id, callback) => {
  const sql = `DELETE FROM jurnal_umum WHERE id_jurnal = ?`;
  db.query(sql, [id], callback);
};

exports.deleteByBeban = (id_beban, callback) => {
  db.query(
    "DELETE FROM jurnal_umum WHERE sumber='beban' AND id_beban=?",
    [id_beban],
    callback
  );
};

exports.deleteByDP = (id_dp, callback) => {
  db.query(
    "DELETE FROM jurnal_umum WHERE sumber='dp' AND id_dp=?",
    [id_dp],
    callback
  );
};

exports.deleteByTransaksi = (id_transaksi, callback) => {
  db.query(
    "DELETE FROM jurnal_umum WHERE sumber='penjualan' AND id_transaksi=?",
    [id_transaksi],
    callback
  );
};
