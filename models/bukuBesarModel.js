const db = require("../config/db");

const BukuBesarModel = {
    getAll: () => {
        return new Promise((resolve, reject) => {
            const query = `
                SELECT 
                    jp.id_jurnal_penjualan AS id,
                    jp.id_coa AS kode_akun,
                    c.tipe_balance AS tipe_akun_normal,
                    jp.tanggal,
                    jp.keterangan,
                    CASE WHEN jp.tipe_balance = 'debit' THEN jp.nominal ELSE 0 END AS debit,
                    CASE WHEN jp.tipe_balance = 'kredit' THEN jp.nominal ELSE 0 END AS kredit,
                    jp.id_transaksi AS ref_transaksi,
                    jp.created_at
                FROM jurnal_penjualan jp
                JOIN coa c ON c.id = jp.id_coa

                UNION ALL

                SELECT 
                    jb.id_jurnal_beban AS id,
                    jb.kode AS kode_akun,
                    c.tipe_balance AS tipe_akun_normal,
                    jb.tanggal,
                    jb.keterangan,
                    CASE WHEN jb.tipe_balance = 'debit' THEN jb.nominal ELSE 0 END AS debit,
                    CASE WHEN jb.tipe_balance = 'kredit' THEN jb.nominal ELSE 0 END AS kredit,
                    jb.id_beban AS ref_transaksi,
                    jb.created_at
                FROM jurnal_beban jb
                JOIN coa c ON c.kode_akun = jb.kode

                ORDER BY tanggal ASC, id ASC
            `;

            db.query(query, (err, rows) => {
                if (err) reject(err);
                else resolve(rows);
            });
        });
    }
};

module.exports = BukuBesarModel;
