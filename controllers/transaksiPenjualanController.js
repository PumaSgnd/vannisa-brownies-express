const Transaksi = require("../models/transaksiPenjualanModel");

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

  // 1. Cek apakah id_produk valid
  Transaksi.getHargaProduk(id_produk, (err, produk) => {
    if (err) return res.status(500).json(err);

    // PRODUK TIDAK ADA -> ERROR WAJIB
    if (!produk || produk.length === 0) {
      return res.status(404).json({
        message: "Produk tidak ditemukan untuk ID " + id_produk
      });
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
      res.json({ message: "Transaksi berhasil diupdate" });
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
