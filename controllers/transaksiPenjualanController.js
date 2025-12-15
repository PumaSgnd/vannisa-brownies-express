const Transaksi = require("../models/transaksiPenjualanModel");
const Jurnal = require("../models/jurnalPenjualanModel");

exports.getAll = (req, res) => {
  Transaksi.getAll((err, rows) => {
    if (err) return res.status(500).json(err);
    res.json(rows);
  });
};

exports.getById = (req, res) => {
  const id = req.params.id;

  Transaksi.getById(id, (err, rows) => {
    if (err) return res.status(500).json(err);
    if (rows.length === 0) return res.status(404).json({ message: "Data tidak ditemukan" });

    res.json(rows[0]);
  });
};

exports.create = (req, res) => {
  const {
    id_kasir,
    id_produk,
    id_pelanggan,
    tanggal_jual,
    jumlah_barang,
    metode_pembayaran
  } = req.body;

  // 1. Cek stok produk dulu
  Transaksi.getStokProduk(id_produk, (err, resultStok) => {
    if (err) return res.status(500).json(err);
    if (resultStok.length === 0)
      return res.status(404).json({ message: "Produk tidak ditemukan" });

    const stok = resultStok[0].stok;

    if (stok < jumlah_barang) {
      return res.status(400).json({
        message: "Stok tidak mencukupi",
        stok_tersedia: stok,
        diminta: jumlah_barang
      });
    }

    // 2. Ambil harga produk
    Transaksi.getHargaProduk(id_produk, (err, produk) => {
      if (err) return res.status(500).json(err);

      const harga_satuan = produk[0].harga_jual;
      const total_harga = harga_satuan * jumlah_barang;
      const kode_akun = 3;

      const data = {
        id_kasir,
        id_produk,
        id_pelanggan,
        tanggal_jual,
        jumlah_barang,
        harga_satuan,
        total_harga,
        metode_pembayaran,
        kode_akun,
        status: "pending"
      };

      // 3. Insert transaksi
      Transaksi.insert(data, (err, result) => {
        if (err) return res.status(500).json(err);

        // 4. Kurangi stok setelah berhasil insert
        Transaksi.updateStok(id_produk, jumlah_barang, (err2) => {
          if (err2)
            return res.status(500).json({
              message: "Transaksi masuk tapi gagal update stok"
            });

          res.json({
            message: "Transaksi berhasil dan stok berkurang",
            id: result.insertId
          });
        });
      });
    });
  });
};

exports.update = (req, res) => {
  const id = req.params.id;
  const {
    id_kasir,
    id_produk,
    id_pelanggan,
    tanggal_jual,
    jumlah_barang,
    metode_pembayaran,
    status
  } = req.body;

  Transaksi.getHargaProduk(id_produk, (err, produk) => {
    if (err) return res.status(500).json(err);
    if (!produk || produk.length === 0) {
      return res.status(404).json({ message: "Produk tidak ditemukan" });
    }

    const harga_satuan = produk[0].harga_jual;
    const total_harga = harga_satuan * jumlah_barang;

    const data = {
      id_kasir,
      id_produk,
      id_pelanggan,
      tanggal_jual,
      jumlah_barang,
      harga_satuan,
      total_harga,
      metode_pembayaran,
      status
    };

    Transaksi.update(id, data, (err) => {
      if (err) return res.status(500).json(err);

      /**
       * ==========================
       * LOGIKA JURNAL
       * ==========================
       */

      // 🔴 JIKA STATUS BUKAN DIVERIFIKASI → HAPUS JURNAL (JIKA ADA)
      if (status !== "diverifikasi") {
        Jurnal.deleteByTransaksiId(id, () => {
          return res.json({
            message: "Transaksi diupdate & jurnal dihapus (jika ada)"
          });
        });
        return;
      }

      // 🟢 JIKA STATUS = DIVERIFIKASI
      Jurnal.getByTransaksiId(id, (err, rows) => {
        if (err) return res.status(500).json(err);

        // ❗ SUDAH ADA JURNAL → JANGAN BUAT LAGI
        if (rows.length > 0) {
          return res.json({
            message: "Transaksi diverifikasi (jurnal sudah ada)"
          });
        }

        // ❗ BELUM ADA → BUAT JURNAL
        const jurnalData = {
          id_transaksi: id,
          tanggal: tanggal_jual,
          id_coa: 3, // COA PENJUALAN
          nominal: total_harga,
          tipe_balance: "kredit",
          keterangan: "Penjualan produk"
        };

        Jurnal.insert(jurnalData, (errJurnal) => {
          if (errJurnal) {
            return res.status(500).json({
              message: "Transaksi diverifikasi tapi gagal membuat jurnal"
            });
          }

          return res.json({
            message: "Transaksi diverifikasi & jurnal dibuat"
          });
        });
      });
    });
  });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Transaksi.delete(id, (err) => {
    if (err) return res.status(500).json(err);
    res.json({ message: "Transaksi berhasil dihapus" });
  });
};
