const BukuBesarModel = require("../models/bukuBesarModel");

const BukuBesarController = {
  getBukuBesar: async (req, res) => {
    try {
      const data = await BukuBesarModel.getAll();

      const saldoPerAkun = {};

      const result = data.map((row) => {
        if (!saldoPerAkun[row.kode_akun]) saldoPerAkun[row.kode_akun] = 0;

        let saldo = saldoPerAkun[row.kode_akun];

        if (row.tipe_akun_normal === "DEBIT") {
          // Aset, Beban
          saldo += row.debit - row.kredit;
        } else if (row.tipe_akun_normal === "KREDIT") {
          // Pendapatan, Modal, Kewajiban
          saldo += row.kredit - row.debit;
        }

        saldoPerAkun[row.kode_akun] = saldo;

        return {
          ...row,
          saldo,
        };
      });

      res.json(result);

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Gagal mengambil data buku besar" });
    }
  },
};

module.exports = BukuBesarController;
