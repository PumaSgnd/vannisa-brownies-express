const db = require("../config/db");

const Transaksi = {

  getAll(callback) {
    const q = `
      SELECT tp.*, 
        u.nama_lengkap AS kasir,
        p.nama_produk AS produk,
        pel.nama AS pelanggan
      FROM transaksi_penjualan tp
      LEFT JOIN users u ON tp.id_kasir = u.id
      LEFT JOIN produk p ON tp.id_produk = p.id_produk
      LEFT JOIN pelanggan pel ON tp.id_pelanggan = pel.id_pelanggan
      ORDER BY tp.id_transaksi DESC
    `;
    db.query(q, callback);
  },

  getById(id, callback) {
    const q = "SELECT * FROM transaksi_penjualan WHERE id_transaksi = ?";
    db.query(q, [id], callback);
  },

  getHargaProduk(id_produk, callback) {
    const q = "SELECT harga_jual FROM produk WHERE id_produk = ?";
    db.query(q, [id_produk], callback);
  },

  getStokProduk(id_produk, callback) {
    const q = "SELECT stok FROM produk WHERE id_produk = ?";
    db.query(q, [id_produk], callback);
  },

  insert(data, callback) {
    const q = `
      INSERT INTO transaksi_penjualan 
        (id_kasir, id_produk, id_pelanggan, tanggal_jual, jumlah_barang,
        harga_satuan, total_harga, metode_pembayaran, id_coa, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    db.query(
      q,
      [
        data.id_kasir,
        data.id_produk,
        data.id_pelanggan,
        data.tanggal_jual,
        data.jumlah_barang,
        data.harga_satuan,
        data.total_harga,
        data.metode_pembayaran,
        data.kode_akun,
        data.status
      ],
      callback
    );
  },

  update(id, data, callback) {
    const q = `
      UPDATE transaksi_penjualan
      SET id_kasir=?, id_produk=?, id_pelanggan=?, tanggal_jual=?,
          jumlah_barang=?, harga_satuan=?, total_harga=?, metode_pembayaran=?,
          status = ?,  updated_at = CURRENT_TIMESTAMP
      WHERE id_transaksi=?
    `;
    db.query(
      q,
      [
        data.id_kasir,
        data.id_produk,
        data.id_pelanggan,
        data.tanggal_jual,
        data.jumlah_barang,
        data.harga_satuan,
        data.total_harga,
        data.metode_pembayaran,
        data.status,
        id
      ],
      callback
    );
  },

  updateStok(id_produk, qty, callback) {
    const q = `
    UPDATE produk 
    SET stok = stok - ? 
    WHERE id_produk = ? AND stok >= ?
  `;
    db.query(q, [qty, id_produk, qty], callback);
  },

  delete(id, callback) {
    const q = "DELETE FROM transaksi_penjualan WHERE id_transaksi = ?";
    db.query(q, [id], callback);
  },
};

module.exports = Transaksi;
