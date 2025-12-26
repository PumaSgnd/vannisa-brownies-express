const Beban = require("../models/bebanModel");
const JurnalUmum = require("../models/jurnalUmumModel");
const BukuBesar = require("../models/bukuBesarModel");
const COA = require("../models/coaModel");
// const JurnalBeban = require("../models/jurnalBebanModel");

// GET ALL
exports.getBeban = (req, res) => {
  Beban.getAll((err, results) => {
    if (err) return res.status(500).json(err);
    res.json(results);
  });
};

exports.createBeban = (req, res) => {
  const { jenis_beban, kode_akun, nominal, keterangan, tanggal_beban } = req.body;
  const id_user = req.user.id;

  const data = {
    jenis_beban,
    kode_akun,          // tetap simpan kode_akun di tabel beban_operasional
    nominal,
    tanggal_beban,
    keterangan,
    id_user,
    created_at: new Date(),
    updated_at: new Date()
  };

  Beban.create(data, (err, result) => {
    if (err) return res.status(500).json(err);

    const id_beban = result.insertId;

    // 🔥 AMBIL id_coa dari kode_akun
    COA.getByKode(kode_akun, (err2, rows) => {
      if (err2) return res.status(500).json(err2);
      if (rows.length === 0) {
        return res.status(400).json({ message: "Kode akun tidak ditemukan" });
      }

      const id_coa = rows[0].id;
      const COA_KAS = 1; // misal kas id=1

      const jurnal = [
        [
          tanggal_beban,
          keterangan,
          id_coa,
          nominal,
          0,
          "beban",
          null,
          null,
          id_beban,
          id_user
        ],
        [
          tanggal_beban,
          "Pembayaran beban",
          COA_KAS,
          0,
          nominal,
          "beban",
          null,
          null,
          id_beban,
          id_user
        ]
      ];

      JurnalUmum.insertBatch(jurnal, (err3) => {
        if (err3) return res.status(500).json(err3);

        // 🔥 ambil jurnal yg baru dibuat
        JurnalUmum.getByBeban(id_beban, (err4, rows) => {
          if (err4) return res.status(500).json(err4);

          rows.forEach(j => {
            BukuBesar.insertFromJurnal(j, () => { });
          });

          res.json({ message: "Beban, Jurnal & Buku Besar tersimpan" });
        });
      });
    });
  });
};

exports.updateBeban = (req, res) => {
  const { id } = req.params; // id = id_beban
  const { jenis_beban, kode_akun, nominal, keterangan, tanggal_beban } = req.body;
  const id_user = req.user.id;

  Beban.update(id, {
    jenis_beban,
    kode_akun,
    nominal,
    tanggal_beban,
    keterangan,
    updated_at: new Date()
  }, (err) => {
    if (err) return res.status(500).json(err);

    // 1️⃣ ambil jurnal lama
    JurnalUmum.getByBeban(id, (err, jurnalLama) => {
      if (err) return res.status(500).json(err);

      // 2️⃣ hapus buku besar lama
      jurnalLama.forEach(j => {
        BukuBesar.deleteByJurnal(j.id_jurnal, () => {});
      });

      // 3️⃣ hapus jurnal lama
      JurnalUmum.deleteByBeban(id, () => {

        // 4️⃣ ambil id_coa baru
        COA.getByKode(kode_akun, (err2, rows) => {
          if (err2) return res.status(500).json(err2);
          if (!rows.length)
            return res.status(400).json({ message: "Kode akun tidak ditemukan" });

          const id_coa = rows[0].id;
          const COA_KAS = 1;

          const jurnal = [
            [
              tanggal_beban,
              keterangan,
              id_coa,
              nominal,
              0,
              "beban",
              null,
              null,
              id,
              id_user
            ],
            [
              tanggal_beban,
              "Pembayaran beban",
              COA_KAS,
              0,
              nominal,
              "beban",
              null,
              null,
              id,
              id_user
            ]
          ];

          // 5️⃣ insert jurnal baru
          JurnalUmum.insertBatch(jurnal, () => {

            // 6️⃣ insert buku besar baru
            JurnalUmum.getByBeban(id, (err3, jurnalBaru) => {
              if (err3) return res.status(500).json(err3);

              jurnalBaru.forEach(j => {
                BukuBesar.insertFromJurnal(j, () => {});
              });

              res.json({
                message: "Beban, Jurnal & Buku Besar berhasil diupdate"
              });
            });
          });
        });
      });
    });
  });
};

exports.deleteBeban = (req, res) => {
  const { id } = req.params;

  Beban.delete(id, (err) => {
    if (err) return res.status(500).json(err);

    JurnalUmum.getByBeban(id, (err, jurnalRows) => {
      jurnalRows.forEach(j => {
        BukuBesar.deleteByJurnal(j.id_jurnal, () => { });
      });

      JurnalUmum.deleteByBeban(id, () => {
        Beban.delete(id, () => {
          res.json({
            message: "Beban + Jurnal + Buku Besar dihapus"
          });
        });
      });
    });
  });
};
