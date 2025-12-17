const DP = require("../models/dpModel");
const JurnalDP = require("../models/jurnalDPModel");
const JurnalPenjualan = require("../models/jurnalPenjualanModel");
const COA = require("../models/coaModel");
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

// CREATE
exports.createDP = (req, res) => {
  const {
    id_pelanggan,
    id_produk,
    nominal_dp,
    tanggal_dp,
    keterangan,
    id_user,
  } = req.body;

  DP.getLastKode((err, rows) => {
    if (err) return res.status(500).json(err);

    let nextKode = "DP-001";

    if (rows.length > 0) {
      const lastNum = parseInt(
        rows[0].kode_transaksi.replace("DP-", ""),
        10
      );
      nextKode = `DP-${String(lastNum + 1).padStart(3, "0")}`;
    }

    const id_user = req.user.id; // ✅ dari token login

    if (!id_user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const data = {
      kode_transaksi: nextKode,
      id_pelanggan,
      id_produk,
      nominal_dp,
      tanggal_dp,
      keterangan,
      status: "Belum Lunas",
      id_user,
      created_at: new Date(),
      updated_at: new Date()
    };

    DP.create(data, (err2, result) => {
      if (err2) return res.status(500).json(err2);

      const id_dp = result.insertId;

      const jurnalDP = [
        {
          id_dp,
          tanggal: tanggal_dp,
          id_coa: COA_KAS,
          nominal: nominal_dp,
          tipe_balance: "debit",
          keterangan: "Penerimaan DP"
        },
        {
          id_dp,
          tanggal: tanggal_dp,
          id_coa: COA_PIUTANG,
          nominal: nominal_dp,
          tipe_balance: "kredit",
          keterangan: "DP pelanggan"
        }
      ];

      JurnalDP.createBatch(jurnalDP, (err3) => {
        if (err3) return res.status(500).json(err3);

        res.status(201).json({
          message: "DP berhasil & masuk jurnal DP",
          id: id_dp,
          kode_transaksi: nextKode
        });
      });
    });
  });
};

exports.lunasiDP = (req, res) => {
  const { id } = req.params;
  const { tanggal, total_penjualan } = req.body;

  if (!total_penjualan) {
    return res.status(400).json({
      message: "total_penjualan wajib diisi"
    });
  }

  DP.getById(id, (err, rows) => {
    if (err) return res.status(500).json(err);
    if (rows.length === 0) {
      return res.status(404).json({ message: "DP tidak ditemukan" });
    }

    const dp = rows[0];
    const sisaBayar = total_penjualan - dp.nominal_dp;

    DP.update(id, { status: "Lunas" }, (err2) => {
      if (err2) return res.status(500).json(err2);

      const jurnal = [
        {
          tanggal,
          id_coa: COA_PIUTANG,
          nominal: dp.nominal_dp,
          tipe_balance: "debit",
          keterangan: "DP dialihkan ke penjualan"
        },
        ...(sisaBayar > 0 ? [{
          tanggal,
          id_coa: COA_KAS,
          nominal: sisaBayar,
          tipe_balance: "debit",
          keterangan: "Pelunasan sisa pembayaran"
        }] : []),
        {
          tanggal,
          id_coa: COA_PENJUALAN,
          nominal: total_penjualan,
          tipe_balance: "kredit",
          keterangan: "Penjualan dari DP"
        }
      ];

      // simpan jurnal
      JurnalPenjualan.createBatch(jurnal, (err3) => {
        if (err3) return res.status(500).json(err3);

        res.json({
          message: "DP berhasil dilunasi & masuk jurnal penjualan"
        });
      });
    });
  });
};

// DELETE
exports.deleteDP = (req, res) => {
  const { id } = req.params;

  DP.delete(id, (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Down Payment deleted" });
  });
};
