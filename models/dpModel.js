const db = require("../config/db");

// GET ALL
exports.getAll = (callback) => {
  const sql = `
    SELECT 
      dp.id,
      dp.kode_transaksi,
      dp.jumlah_barang,
      dp.nominal_dp,
      dp.tanggal_dp,
      dp.keterangan,
      dp.status,
      dp.id_user,
      p.nama AS nama_pelanggan,
      p.no_telp,
      pr.id_produk,
      pr.nama_produk,
      pr.harga_jual,
      (pr.harga_jual * dp.jumlah_barang) AS total_harga
    FROM down_payment dp
    JOIN pelanggan p ON p.id_pelanggan = dp.id_pelanggan
    JOIN produk pr ON pr.id_produk = dp.id_produk
    ORDER BY dp.id DESC
  `;
  db.query(sql, callback);
};

// CREATE DP ✅
exports.create = (data, callback) => {
  db.query("INSERT INTO down_payment SET ?", data, callback);
};

// UPDATE DP
exports.update = (id, data, callback) => {
  db.query("UPDATE down_payment SET ? WHERE id = ?", [data, id], callback);
};

exports.getLastKode = (callback) => {
  db.query(
    "SELECT kode_transaksi FROM down_payment ORDER BY id DESC LIMIT 1",
    callback
  );
};

exports.getById = (id, callback) => {
  db.query(
    `
    SELECT dp.*, pr.harga_jual
    FROM down_payment dp
    JOIN produk pr ON pr.id_produk = dp.id_produk
    WHERE dp.id = ?
    `,
    [id],
    callback
  );
};

exports.delete = (id, callback) => {
  db.query("DELETE FROM down_payment WHERE id = ?", [id], callback);
};
