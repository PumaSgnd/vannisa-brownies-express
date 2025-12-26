const Transaksi = require("../models/transaksiPenjualanModel");
const Jurnal = require("../models/jurnalUmumModel");
const BukuBesar = require("../models/bukuBesarModel");
// const Jurnal = require("../models/jurnalPenjualanModel");

const COA_KAS = 7;
const COA_PENJUALAN = 3;

exports.getAll = (req, res) => {
  Transaksi.getAll((err, rows) => {
    if (err) {
      return res.status(500).json({
        message: "Gagal mengambil data transaksi",
        error: err
      });
    }
    res.json(rows);
  });
};

exports.getById = (req, res) => {
  const id = req.params.id;

  Transaksi.getById(id, (err, rows) => {
    if (err) {
      return res.status(500).json({
        message: "Gagal mengambil data transaksi",
        error: err
      });
    }

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Transaksi tidak ditemukan"
      });
    }

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

  Transaksi.getStokProduk(id_produk, (err, stokResult) => {
    if (err) return res.status(500).json(err);
    if (stokResult.length === 0)
      return res.status(404).json({ message: "Produk tidak ditemukan" });

    const stok = stokResult[0].stok;
    if (stok < jumlah_barang) {
      return res.status(400).json({
        message: "Stok tidak mencukupi",
        stok_tersedia: stok,
        diminta: jumlah_barang
      });
    }

    Transaksi.getHargaProduk(id_produk, (err, produk) => {
      if (err) return res.status(500).json(err);

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
        kode_akun: COA_KAS,
        status: "pending"
      };

      Transaksi.insert(data, (err, result) => {
        if (err) return res.status(500).json(err);

        // 4️⃣ Update stok
        Transaksi.updateStok(id_produk, jumlah_barang, (errStok) => {
          if (errStok) {
            return res.status(500).json({
              message: "Transaksi berhasil, tapi gagal update stok"
            });
          }

          res.json({
            message: "Transaksi berhasil dibuat",
            id_transaksi: result.insertId
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

      if (status !== "diverifikasi") {

        BukuBesar.deleteByTransaksi(id, () => {

          Jurnal.deleteByTransaksi(id, () => {
            return res.json({
              message: "Status diubah, jurnal & buku besar dihapus"
            });
          });

        });

        return;
      }

      Jurnal.getByTransaksi(id, (err, jurnal) => {
        if (err) return res.status(500).json(err);

        if (jurnal.length > 0) {
          return res.json({
            message: "Transaksi diverifikasi (jurnal sudah ada)"
          });
        }

        // 🔥 Ambil detail produk
        Transaksi.getDetailProduk(id_produk, (err, produk) => {
          if (err) return res.status(500).json(err);
          if (!produk || produk.length === 0) {
            return res.status(404).json({ message: "Produk tidak ditemukan" });
          }

          const namaProduk = produk[0].nama_produk;
          const satuan = produk[0].satuan || "Box";

          function formatTanggalJam(date) {
            const d = new Date(date);
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, "0");
            const dd = String(d.getDate()).padStart(2, "0");
            const hh = String(d.getHours()).padStart(2, "0");
            const mi = String(d.getMinutes()).padStart(2, "0");

            return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
          }

          const now = new Date();
          const keteranganKas = `Pemasukan ${formatTanggalJam(now)}`;
          const keteranganPenjualan = `Penjualan ${namaProduk} ${jumlah_barang} ${satuan}`;

          const jurnalData = [
            [
              tanggal_jual,
              keteranganKas,
              COA_KAS,
              total_harga,
              0,
              "penjualan",
              id,
              null,
              null,
              id_kasir
            ],
            [
              tanggal_jual,
              keteranganPenjualan,
              COA_PENJUALAN,
              0,
              total_harga,
              "penjualan",
              id,
              null,
              null,
              id_kasir
            ]
          ];

          Jurnal.insertBatch(jurnalData, (errJurnal) => {
            if (errJurnal) {
              return res.status(500).json({
                message: "Transaksi diverifikasi tapi gagal membuat jurnal"
              });
            }

            Jurnal.getByTransaksi(id, (err, rows) => {
              if (err) return res.status(500).json(err);

              rows.forEach(jurnal => {
                BukuBesar.insertFromJurnal(jurnal, () => { });
              });

              return res.json({
                message: "Transaksi diverifikasi, jurnal & buku besar tersimpan"
              });
            });
          });
        });
      });
    });
  });
};

exports.delete = (req, res) => {
  const id = req.params.id;

  Jurnal.getByTransaksi(id, (err, jurnalRows) => {
    if (err) return res.status(500).json(err);

    jurnalRows.forEach(j => {
      BukuBesar.deleteByJurnal(j.id_jurnal, () => { });
    });

    Jurnal.deleteByTransaksi(id, () => {

      Transaksi.delete(id, (err) => {
        if (err) return res.status(500).json(err);

        res.json({
          message: "Transaksi, jurnal & buku besar berhasil dihapus"
        });
      });

    });
  });
};
