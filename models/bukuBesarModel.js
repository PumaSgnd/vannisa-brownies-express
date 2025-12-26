const db = require("../config/db");

const BukuBesarModel = {

    getAll() {
        return new Promise((resolve, reject) => {
            const q = `
        SELECT 
          bb.id,
          bb.id_coa,
          c.kode_akun,
          c.nama_akun,
          bb.tanggal,
          bb.keterangan,
          bb.debit,
          bb.kredit,
          bb.ref_transaksi,
          bb.created_at,
          SUM(
            CASE 
              WHEN c.tipe_balance = 'DEBIT'
                THEN bb.debit - bb.kredit
              ELSE bb.kredit - bb.debit
            END
          ) OVER (
            PARTITION BY bb.id_coa
            ORDER BY bb.tanggal, bb.id
          ) AS saldo
        FROM buku_besar bb
        JOIN coa c ON c.id = bb.id_coa
        ORDER BY bb.id_coa, bb.tanggal, bb.id
      `;
            db.query(q, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    getByAkun(id_coa) {
        return new Promise((resolve, reject) => {
            const q = `
        SELECT 
          bb.id,
          bb.tanggal,
          bb.keterangan,
          bb.debit,
          bb.kredit,
          bb.ref_transaksi,
          bb.created_at,
          SUM(
            CASE 
              WHEN c.tipe_balance = 'DEBIT'
                THEN bb.debit - bb.kredit
              ELSE bb.kredit - bb.debit
            END
          ) OVER (
            PARTITION BY bb.id_coa
            ORDER BY bb.tanggal, bb.id
          ) AS saldo
        FROM buku_besar bb
        JOIN coa c ON c.id = bb.id_coa
        WHERE bb.id_coa = ?
        ORDER BY bb.tanggal, bb.id
      `;
            db.query(q, [id_coa], (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    },

    insertFromJurnal(jurnal, callback) {
        const q = `
      INSERT INTO buku_besar
      (id_jurnal, id_coa, tanggal, keterangan, debit, kredit, ref_transaksi)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
        db.query(q, [
            jurnal.id_jurnal,
            jurnal.id_coa,
            jurnal.tanggal,
            jurnal.keterangan,
            jurnal.debit || 0,
            jurnal.kredit || 0,
            jurnal.id_transaksi || jurnal.id_dp || jurnal.id_beban
        ], callback);
    },

    deleteByJurnal(id_jurnal, callback) {
        db.query(
            "DELETE FROM buku_besar WHERE id_jurnal = ?",
            [id_jurnal],
            callback
        );
    },

    deleteByTransaksi(id_transaksi, callback) {
        const q = `
      DELETE FROM buku_besar
      WHERE ref_transaksi = ?
    `;
        db.query(q, [id_transaksi], callback);
    },
};

module.exports = BukuBesarModel;
