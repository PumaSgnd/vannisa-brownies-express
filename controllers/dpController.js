const DP = require("../models/dpModel");
// const JurnalDP = require("../models/jurnalDPModel");
// const JurnalPenjualan = require("../models/jurnalPenjualanModel");
const JurnalUmum = require("../models/jurnalUmumModel");
const BukuBesar = require("../models/bukuBesarModel");
const COA = require("../models/coaModel");
const Produk = require("../models/produkModel");
const Transaksi = require("../models/transaksiPenjualanModel");
const COA_KAS = 7;
const COA_BCA = 8;
const COA_PIUTANG = 9;
const COA_PENJUALAN = 3;

// GET ALL
exports.getDP = (req, res) => {
  DP.getAll((err, results) => {
    if (err) return res.status(500).json(err);

    // Tambahkan nomor urut seperti dummy frontend
    const data = results.map((item, index) => ({
      no: index + 1,
      ...item
    }));

    res.json(data);
  });
};

exports.createDP = (req, res) => {
  const {
    id_pelanggan,
    id_produk,
    jumlah_barang,
    nominal_dp,
    tanggal_dp,
    keterangan
  } = req.body;

  const id_user = req.user?.id;
  if (!id_user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!jumlah_barang || jumlah_barang <= 0) {
    return res.status(400).json({ message: "Jumlah barang wajib diisi" });
  }

  DP.getLastKode((err, rows) => {
    if (err) return res.status(500).json(err);

    let nextKode = "DP-001";
    if (rows.length > 0) {
      const lastNum = parseInt(rows[0].kode_transaksi.replace("DP-", ""), 10);
      nextKode = `DP-${String(lastNum + 1).padStart(3, "0")}`;
    }

    Produk.getById(id_produk, (errP, rowsP) => {
      if (errP) return res.status(500).json(errP);
      if (rowsP.length === 0) {
        return res.status(400).json({ message: "Produk tidak ditemukan" });
      }

      const hargaJual = rowsP[0].harga_jual;
      const totalHarga = hargaJual * jumlah_barang;
      const minDP = totalHarga * 0.5;

      if (nominal_dp < minDP) {
        return res.status(400).json({
          message: `Minimal DP adalah 50% dari total harga (Rp ${minDP})`
        });
      }

      const dataDP = {
        kode_transaksi: nextKode,
        id_pelanggan,
        id_produk,
        jumlah_barang,
        nominal_dp,
        tanggal_dp,
        keterangan,
        status: "Belum Lunas",
        id_user,
        created_at: new Date(),
        updated_at: new Date()
      };

      DP.create(dataDP, (err2, result) => {
        if (err2) return res.status(500).json(err2);

        const id_dp = result.insertId;

        const jurnal = [
          [
            tanggal_dp,
            keterangan,
            COA_KAS,
            nominal_dp,
            0,
            "dp",
            null,
            id_dp,
            null,
            id_user
          ],
          [
            tanggal_dp,
            "DP Pelanggan",
            COA_PIUTANG,
            0,
            nominal_dp,
            "dp",
            null,
            id_dp,
            null,
            id_user
          ]
        ];

        JurnalUmum.insertBatch(jurnal, (err3) => {
          if (err3) return res.status(500).json(err3);

          JurnalUmum.getByDP(id_dp, (err4, jurnalRows) => {
            if (err4) return res.status(500).json(err4);

            jurnalRows.forEach(j => {
              BukuBesar.insertFromJurnal(j, () => { });
            });

            res.status(201).json({
              message: "DP, Jurnal & Buku Besar tersimpan",
              kode_transaksi: nextKode,
              total_harga: totalHarga
            });
          });
        });
      });
    });
  });
};

exports.lunasiDP = (req, res) => {
  const { id } = req.params;
  const { tanggal, nominal_pelunasan } = req.body;

  if (!nominal_pelunasan || nominal_pelunasan <= 0) {
    return res.status(400).json({
      message: "Nominal pelunasan wajib diisi"
    });
  }

  DP.getById(id, (err, rows) => {
    if (err) return res.status(500).json(err);
    if (rows.length === 0) {
      return res.status(404).json({ message: "DP tidak ditemukan" });
    }

    const dp = rows[0];

    if (dp.status === "Lunas") {
      return res.status(400).json({
        message: "DP sudah lunas"
      });
    }

    const totalHarga = dp.harga_jual * dp.jumlah_barang;
    const totalBayar = Number(dp.nominal_dp) + Number(nominal_pelunasan);

    if (totalBayar > totalHarga) {
      return res.status(400).json({
        message: "Nominal pelunasan melebihi total harga"
      });
    }

    // ✅ Tentukan status
    const statusDP = totalBayar >= totalHarga ? "Lunas" : "Belum Lunas";
    const sisaBayar = totalHarga - totalBayar;

    // 1️⃣ UPDATE DP (TAMBAH NOMINAL)
    DP.update(
      id,
      {
        nominal_dp: totalBayar,
        status: statusDP,
        updated_at: new Date()
      },
      (err2) => {
        if (err2) return res.status(500).json(err2);

        return res.json({
          message:
            statusDP === "Lunas"
              ? "DP berhasil dilunasi"
              : "Pembayaran tersimpan, DP belum lunas",
          status: statusDP,
          total_harga: totalHarga,
          total_bayar: totalBayar,
          sisa_bayar: statusDP === "Belum Lunas" ? sisaBayar : 0
        });
      }
    );
  });
};

// DELETE
exports.deleteDP = (req, res) => {
  const { id } = req.params;

  // 1️⃣ ambil jurnal DP
  JurnalUmum.getByDP(id, (err, jurnalRows) => {
    if (err) return res.status(500).json(err);

    // 2️⃣ hapus buku besar
    jurnalRows.forEach(j => {
      BukuBesar.deleteByJurnal(j.id_jurnal, () => { });
    });

    // 3️⃣ hapus jurnal
    JurnalUmum.deleteByDP(id, () => {

      // 4️⃣ hapus DP
      DP.delete(id, () => {
        res.json({ message: "DP + Jurnal + Buku Besar dihapus" });
      });

    });
  });
};
