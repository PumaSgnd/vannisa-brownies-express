const db = require("../config/db");

const JurnalPenjualan = {

    insert(data, callback) {
        const q = `
      INSERT INTO jurnal_penjualan
      (id_transaksi, tanggal, id_coa, nominal, tipe_balance, keterangan)
      VALUES (?, ?, ?, ?, ?, ?)
    `;
        db.query(q, [
            data.id_transaksi,
            data.tanggal,
            data.id_coa,
            data.nominal,
            data.tipe_balance || "kredit",
            data.keterangan
        ], callback);
    },

    getAll(callback) {
        const q = `
      SELECT 
        jp.id_jurnal_penjualan,
        tp.id_transaksi,
        tp.tanggal_jual AS tanggal,
        c.kode_akun AS kode,
        jp.nominal,
        jp.tipe_balance,
        jp.keterangan,
        jp.created_at
      FROM jurnal_penjualan jp
      JOIN transaksi_penjualan tp ON jp.id_transaksi = tp.id_transaksi
      JOIN coa c ON jp.id_coa = c.id
      WHERE tp.status = 'diverifikasi'
      ORDER BY jp.id_jurnal_penjualan DESC
    `;
        db.query(q, callback);
    },

    update(id, data, callback) {
        const q = `
    UPDATE jurnal_penjualan
    SET tanggal = ?, id_coa = ?, nominal = ?, 
        tipe_balance = ?, keterangan = ?
    WHERE id_jurnal_penjualan = ?
  `;
        db.query(q, [
            data.tanggal,
            data.id_coa,
            data.nominal,
            data.tipe_balance,
            data.keterangan,
            id
        ], callback);
    },

    getByTransaksiId(id_transaksi, callback) {
        const q = `
    SELECT id_jurnal_penjualan 
    FROM jurnal_penjualan 
    WHERE id_transaksi = ?
  `;
        db.query(q, [id_transaksi], callback);
    },

    deleteByTransaksiId(id_transaksi, callback) {
        const q = `
    DELETE FROM jurnal_penjualan 
    WHERE id_transaksi = ?
  `;
        db.query(q, [id_transaksi], callback);
    }
};

module.exports = JurnalPenjualan;
