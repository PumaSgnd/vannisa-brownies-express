const db = require("../config/db");

const Pelanggan = {
  getAll: (callback) => {
    const sql = "SELECT * FROM pelanggan ORDER BY id_pelanggan ASC";
    db.query(sql, callback);
  },

  getById: (id, callback) => {
    const sql = "SELECT * FROM pelanggan WHERE id_pelanggan = ?";
    db.query(sql, [id], callback);
  },

  create: (data, callback) => {
    const sql = `
      INSERT INTO pelanggan (nama, alamat, no_telp, email, created_at)
      VALUES (?, ?, ?, ?, CURRENT_DATE)
    `;
    db.query(sql, [data.nama, data.alamat, data.no_telp, data.email], callback);
  },

  update: (id, data, callback) => {
    const sql = `
      UPDATE pelanggan
      SET nama=?, alamat=?, no_telp=?, email=?, updated_at=CURRENT_DATE
      WHERE id_pelanggan=?
    `;
    db.query(sql, [data.nama, data.alamat, data.no_telp, data.email, id], callback);
  },

  delete: (id, callback) => {
    const sql = "DELETE FROM pelanggan WHERE id_pelanggan=?";
    db.query(sql, [id], callback);
  },
};

module.exports = Pelanggan;
