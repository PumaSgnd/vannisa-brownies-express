require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const coaRoutes = require("./routes/coaRoutes");
const pelangganRoutes = require("./routes/pelangganRoutes");
const produkRoutes = require("./routes/produkRoutes");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/users", authMiddleware, userRoutes);
app.use("/api/coa", authMiddleware, coaRoutes);
app.use("/api/pelanggan", authMiddleware, pelangganRoutes);
app.use("/api/produk", authMiddleware, produkRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
