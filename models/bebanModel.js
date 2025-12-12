const db = require("../config/db");

// GET ALL + JOIN users + JOIN coa
exports.getAll = (callback) => {
  const sql = `
    SELECT b.*, 
           u.nama_lengkap AS user_nama,
           c.nama_akun AS nama_akun
    FROM beban_operasional b
    LEFT JOIN users u ON u.id = b.id_user
    LEFT JOIN coa c ON c.kode_akun = b.kode_akun
    ORDER BY b.id DESC
  `;
  db.query(sql, callback);
};

// CREATE
exports.create = (data, callback) => {
  db.query("INSERT INTO beban_operasional SET ?", data, callback);
};

// UPDATE
exports.update = (id, data, callback) => {
  db.query(
    "UPDATE beban_operasional SET ? WHERE id = ?",
    [data, id],
    callback
  );
};

// DELETE
exports.delete = (id, callback) => {
  db.query("DELETE FROM beban_operasional WHERE id = ?", [id], callback);
};
