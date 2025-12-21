require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const authMiddleware = require("./middleware/authMiddleware");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const coaRoutes = require("./routes/coaRoutes");
const pelangganRoutes = require("./routes/pelangganRoutes");
const produkRoutes = require("./routes/produkRoutes");
const bebanRoutes = require("./routes/bebanRoute");
const jurnalBebanRoutes = require("./routes/jurnalBebanRoutes")
const transaksiRoutes = require("./routes/transaksiPenjualanRoutes");
const jurnalPenjualanRoutes = require("./routes/jurnalPenjualanRoutes");
const DP = require("./routes/dpRoute");
const jurnalDPRoutes = require("./routes/jurnalDPRoute");
const bukuBesarRoutes = require("./routes/bukuBesarRoutes");
const laporanPenjualanRoutes = require("./routes/laporanPenjualanRoutes");
const laporanLabaRugiRoutes = require("./routes/laporanLabaRugiRoutes");
const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/auth", authRoutes);
app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/coa", authMiddleware, coaRoutes);
app.use("/api/pelanggan", authMiddleware, pelangganRoutes);
app.use("/api/produk", authMiddleware, produkRoutes);
app.use("/api/beban", authMiddleware, bebanRoutes);
app.use("/api/jurnal-beban", authMiddleware, jurnalBebanRoutes);
app.use("/api/jurnal-penjualan", authMiddleware, jurnalPenjualanRoutes);
app.use("/api/transaksi-penjualan", authMiddleware, transaksiRoutes);
app.use("/api/dp", authMiddleware, DP);
app.use("/api/jurnal-dp", authMiddleware, jurnalDPRoutes);
app.use("/api/buku-besar", authMiddleware, bukuBesarRoutes);
app.use("/api/laporan-penjualan", authMiddleware, laporanPenjualanRoutes);
app.use("/api/laporan-laba-rugi", authMiddleware, laporanLabaRugiRoutes);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
