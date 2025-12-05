const db = require("../config/db");

const UserModel = {
  getAll: (callback) => {
    db.query("SELECT * FROM users ORDER BY id DESC", callback);
  },

  getById: (id, callback) => {
    db.query("SELECT * FROM users WHERE id = ?", [id], callback);
  },

  create: (data, callback) => {
    db.query("INSERT INTO users SET ?", data, callback);
  },

  update: (id, data, callback) => {
    db.query("UPDATE users SET ? WHERE id = ?", [data, id], callback);
  },

  delete: (id, callback) => {
    db.query("DELETE FROM users WHERE id = ?", [id], callback);
  },
};

module.exports = UserModel;
