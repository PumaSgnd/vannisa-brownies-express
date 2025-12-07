const db = require("../config/db");

const Produk = {
  getAll: (callback) => {
    const sql = "SELECT * FROM produk ORDER BY id_produk DESC";
    db.query(sql, callback);
  },

  getById: (id, callback) => {
    const sql = "SELECT * FROM produk WHERE id_produk = ?";
    db.query(sql, [id], callback);
  },

  create: (data, callback) => {
    const sql = "INSERT INTO produk SET ?";
    db.query(sql, data, callback);
  },

  update: (id, data, callback) => {
    const sql = "UPDATE produk SET ? WHERE id_produk = ?";
    db.query(sql, [data, id], callback);
  },

  delete: (id, callback) => {
    const sql = "DELETE FROM produk WHERE id_produk = ?";
    db.query(sql, [id], callback);
  },
};

module.exports = Produk;
