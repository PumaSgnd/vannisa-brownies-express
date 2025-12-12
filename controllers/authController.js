const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/userModel");

const JWT_SECRET = process.env.JWT_SECRET;

exports.login = (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username dan password wajib diisi" });
  }

  UserModel.getByUsername(username, (err, users) => {
    if (err) return res.status(500).json({ error: err });

    if (users.length === 0) {
      return res.status(401).json({ message: "Username atau password salah" });
    }

    const user = users[0];

    if (user.is_active === 0) {
      return res.status(403).json({ message: "Akun tidak aktif" });
    }

    bcrypt.compare(password, user.password.replace(/^\$2y\$/, "$2b$"), (err, match) => {
      console.log("==== DEBUG LOGIN ====");
      console.log("Input username :", username);
      console.log("Input password :", password);
      console.log("Password type   :", typeof password);
      console.log("Password length :", password?.length);
      console.log("DB hash         :", user.password);
      console.log("COMPARE RESULT  :", match);
      console.log("====================");

      if (err) return res.status(500).json({ error: err });

      if (!match) {
        return res.status(401).json({ message: "Username atau password salah" });
      }

      const token = jwt.sign(
        { id: user.id, username: user.username, role: user.role },
        JWT_SECRET,
        { expiresIn: "1d" }
      );

      delete user.password;

      res.json({
        message: "Login berhasil",
        token,
        user,
      });
    });
  });
};
