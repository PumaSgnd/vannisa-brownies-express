const LaporanLabaRugiModel = require("../models/laporanLabaRugiModel");

const LaporanLabaRugiController = {
    getAll: async (req, res) => {
        try {
            const { start, end } = req.query;

            const data = await LaporanLabaRugiModel.getLaporan(start, end);

            res.json({
                status: "success",
                count: data.length,
                data,
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Gagal mengambil laporan laba rugi" });
        }
    },
    
    generate: async (req, res) => {
        try {
            const { start, end } = req.query;
            if (!start || !end)
                return res.status(400).json({ error: "Tanggal wajib diisi" });

            const { pendapatan, beban } =
                await LaporanLabaRugiModel.getTotalPendapatanDanBeban(start, end);

            const labaKotor = pendapatan - beban;
            const labaBersih = labaKotor;

            const tanggalObj = new Date(start);
            const periode = tanggalObj.toLocaleString("id-ID", {
                month: "long",
                year: "numeric",
            });

            const id = await LaporanLabaRugiModel.saveLaporan({
                tanggal_awal: start,
                tanggal_akhir: end,
                total_pendapatan: pendapatan,
                total_beban: beban,
                laba_kotor: labaKotor,
                laba_bersih: labaBersih,
                periode,
            });

            res.json({
                message: "Laporan laba rugi berhasil dibuat",
                id_laporan: id,
            });

        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Gagal generate laba rugi" });
        }
    },

};

module.exports = LaporanLabaRugiController;
