const LaporanPenjualanModel = require("../models/laporanPenjualanModel");

const LaporanPenjualanController = {
  getAll: async (req, res) => {
    try {
      const { start, end } = req.query;

      const data = await LaporanPenjualanModel.getLaporan(start, end);

      res.json({
        status: "success",
        count: data.length,
        data,
      });

    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Gagal mengambil laporan" });
    }
  },

  generate: async (req, res) => {
    try {
      const { start, end } = req.query;
      if (!start || !end) return res.status(400).json({ error: "Tanggal mulai & akhir wajib diisi" });

      const totals = await LaporanPenjualanModel.getTotalPenjualan(start, end);
      const produkTerlaris = await LaporanPenjualanModel.getProdukTerlaris(start, end);

      const tanggalAwalObj = new Date(start);
      const bulanNama = tanggalAwalObj.toLocaleString("id-ID", { month: "long" });
      const tahun = tanggalAwalObj.getFullYear();
      const periode = `${bulanNama} ${tahun}`;

      const insertId = await LaporanPenjualanModel.saveLaporan({
        tanggal_awal: start,
        tanggal_akhir: end,
        total_penjualan: totals.total_penjualan,
        total_transaksi: totals.total_transaksi,
        produk_terlaris: produkTerlaris,
        periode,
      });

      res.json({ message: "Laporan berhasil dibuat", id_laporan: insertId });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Gagal generate laporan penjualan" });
    }
  },
};

module.exports = LaporanPenjualanController;
