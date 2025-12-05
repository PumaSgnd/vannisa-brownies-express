const db = require("../config/db");

// Get all akun
exports.getAll = (callback) => {
  db.query("SELECT * FROM coa", callback);
};

// Create akun
exports.create = (data, callback) => {
  db.query("INSERT INTO coa SET ?", data, callback);
};

// Update akun
exports.update = (kode_akun, data, callback) => {
  db.query(
    "UPDATE coa SET ? WHERE kode_akun = ?",
    [data, kode_akun],
    callback
  );
};

// Delete akun
exports.delete = (kode_akun, callback) => {
  db.query(
    "DELETE FROM coa WHERE kode_akun = ?",
    [kode_akun],
    callback
  );
};
