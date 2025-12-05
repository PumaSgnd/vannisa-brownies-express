const bcrypt = require("bcrypt");
const UserModel = require("../models/userModel");

exports.getUsers = (req, res) => {
  UserModel.getAll((err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};

exports.getUser = (req, res) => {
  UserModel.getById(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err });
    if (result.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(result[0]);
  });
};

exports.createUser = (req, res) => {
  const { username, password, nama_lengkap, email, no_telp, role, is_active } = req.body;

  const validRoles = ["admin", "owner", "staff_keuangan", "kasir"];
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: "Role tidak valid" });
  }

  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) return res.status(500).json({ error: err });

    const newUser = {
      username,
      password: hashedPassword,
      nama_lengkap,
      email,
      no_telp,
      role,
      is_active,
    };

    UserModel.create(newUser, (err, result) => {
      if (err) return res.status(500).json({ error: err });

      res.json({
        id: result.insertId,
        ...newUser,
        password: "ENCRYPTED",
      });
    });
  });
};

exports.updateUser = (req, res) => {
  const { username, password, nama_lengkap, email, no_telp, role, is_active } = req.body;

  const updateData = {
    username,
    nama_lengkap,
    email,
    no_telp,
    role,
    is_active,
  };

  if (password) {
    bcrypt.hash(password, 10, (err, hashedPassword) => {
      if (err) return res.status(500).json({ error: err });

      updateData.password = hashedPassword;

      UserModel.update(req.params.id, updateData, (err) => {
        if (err) return res.status(500).json({ error: err });
        res.json({ message: "User updated with new password" });
      });
    });
  } else {
    UserModel.update(req.params.id, updateData, (err) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "User updated" });
    });
  }
};

exports.deleteUser = (req, res) => {
  UserModel.delete(req.params.id, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "User deleted" });
  });
};
