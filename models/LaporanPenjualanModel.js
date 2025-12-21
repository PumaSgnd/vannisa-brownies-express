const db = require("../config/db");
const BukuBesarModel = require("./bukuBesarModel");

const LaporanPenjualanModel = {

  // Ambil tanggal awal–akhir dari Buku Besar (hasil UNION, bukan tabel)
  generateFromBukuBesar: async (start, end) => {
    const bukuBesar = await BukuBesarModel.getAll();

    if (!bukuBesar.length) return null;

    // pakai tanggal dari parameter jika ada
    const tanggal_awal = start || bukuBesar[0].tanggal;
    const tanggal_akhir = end || bukuBesar[bukuBesar.length - 1].tanggal;

    return { tanggal_awal, tanggal_akhir };
  },

  // Total penjualan = semua jurnal dengan kode akun penjualan (contoh: 3)
  getTotalPenjualan: (start, end) => {
    return new Promise((resolve, reject) => {
      let query = `
      SELECT 
        COUNT(*) AS total_transaksi,
        SUM(total_harga) AS total_penjualan
      FROM transaksi_penjualan
      WHERE status = 'diverifikasi'
    `;

      const params = [];
      if (start && end) {
        query += " AND tanggal_jual >= ? AND tanggal_jual <= ?";
        params.push(start, end);
      }

      db.query(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve({
          total_penjualan: rows[0].total_penjualan || 0,
          total_transaksi: rows[0].total_transaksi || 0,
        });
      });
    });
  },

  getProdukTerlaris: (start, end) => {
    return new Promise((resolve, reject) => {
      let query = `
      SELECT 
        p.nama_produk,
        SUM(t.jumlah_barang) AS total_qty
      FROM transaksi_penjualan t
      INNER JOIN produk p ON p.id_produk = t.id_produk
      WHERE t.status = 'diverifikasi'
    `;

      const params = [];
      if (start && end) {
        query += " AND t.tanggal_jual >= ? AND t.tanggal_jual <= ?";
        params.push(start, end);
      }

      query += " GROUP BY t.id_produk ORDER BY total_qty DESC LIMIT 1";

      db.query(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows.length ? rows[0].nama_produk : null);
      });
    });
  },

  getLaporan: (start, end) => {
    return new Promise((resolve, reject) => {
      let query = `SELECT * FROM laporan_penjualan`;
      let params = [];

      if (start && end) {
        query += `
        WHERE tanggal_awal <= ?
        AND tanggal_akhir >= ?
      `;
        params.push(end, start);
      }

      query += ` ORDER BY created_at DESC`;

      db.query(query, params, (err, rows) => {
        if (err) reject(err);
        else resolve(rows);
      });
    });
  },

  // Insert ke laporan_penjualan
  saveLaporan: (data) => {
    return new Promise((resolve, reject) => {
    const query = `
        INSERT INTO laporan_penjualan 
        (tanggal_awal, tanggal_akhir, total_penjualan, total_transaksi, produk_terlaris, periode)
        VALUES (?, ?, ?, ?, ?, ?)
      `;

    const params = [
      data.tanggal_awal,
      data.tanggal_akhir,
      data.total_penjualan,
      data.total_transaksi,
      data.produk_terlaris,
      data.periode,
    ];

    db.query(query, params, (err, result) => {
      if (err) reject(err);
      else resolve(result.insertId);
    });
  });
  },
};

module.exports = LaporanPenjualanModel;
