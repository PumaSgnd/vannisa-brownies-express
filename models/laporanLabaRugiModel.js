const db = require("../config/db");

const LaporanLabaRugiModel = {
    getLaporan: (start, end) => {
        return new Promise((resolve, reject) => {
            let query = `SELECT * FROM laporan_laba_rugi`;
            const params = [];

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

    getTotalPendapatanDanBeban: (start, end) => {
        return new Promise((resolve, reject) => {

            const pendapatanQuery = `
            SELECT SUM(j.kredit) AS total
            FROM jurnal_umum j
            JOIN coa c ON j.id_coa = c.id
            WHERE c.tipe_balance = 'KREDIT'
                AND j.kredit > 0
                AND j.id_beban IS NULL
                AND j.id_dp IS NULL
                AND j.tanggal BETWEEN ? AND ?
        `;

            const bebanQuery = `
            SELECT SUM(j.debit) AS total
            FROM jurnal_umum j
            JOIN coa c ON j.id_coa = c.id
            WHERE c.tipe_balance = 'DEBIT'
                AND j.debit > 0
                AND j.id_transaksi IS NULL
                AND j.tanggal BETWEEN ? AND ?
        `;

            db.query(pendapatanQuery, [start, end], (err, pRows) => {
                if (err) return reject(err);

                db.query(bebanQuery, [start, end], (err, bRows) => {
                    if (err) return reject(err);

                    const pendapatan = pRows[0].total || 0;
                    const beban = bRows[0].total || 0;

                    resolve({
                        pendapatan,
                        beban,
                        laba_kotor: pendapatan - beban,
                        laba_bersih: pendapatan - beban
                    });
                });
            });
        });
    },


    saveLaporan: (data) => {
        return new Promise((resolve, reject) => {
            const query = `
        INSERT INTO laporan_laba_rugi
        (tanggal_awal, tanggal_akhir, total_pendapatan, total_beban, laba_kotor, laba_bersih, periode)
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;

            db.query(query, [
                data.tanggal_awal,
                data.tanggal_akhir,
                data.total_pendapatan,
                data.total_beban,
                data.laba_kotor,
                data.laba_bersih,
                data.periode
            ], (err, result) => {
                if (err) reject(err);
                else resolve(result.insertId);
            });
        });
    },

};

module.exports = LaporanLabaRugiModel;
