require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");

const userRoutes = require("./routes/userRoutes");
const coaRoutes = require("./routes/coaRoutes");
const pelangganRoutes = require("./routes/pelangganRoutes");
const produkRoutes = require("./routes/produkRoutes");

const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/users", userRoutes);
app.use("/api/coa", coaRoutes);
app.use("/api/pelanggan", pelangganRoutes);
app.use("/api/produk", produkRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
