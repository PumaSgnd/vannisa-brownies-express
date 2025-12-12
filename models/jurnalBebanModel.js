const db = require("../config/db");

exports.create = (data, callback) => {
  db.query("INSERT INTO jurnal_beban SET ?", data, callback);
};

exports.update = (id, data, callback) => {
  db.query("UPDATE jurnal_beban SET ? WHERE id_jurnal_beban = ?", [data, id], callback);
};

exports.updateByBeban = (id_beban, data, callback) => {
  db.query(
    "UPDATE jurnal_beban SET ? WHERE id_beban = ?",
    [data, id_beban],
    callback
  );
};

exports.deleteByBeban = (id_beban, callback) => {
  db.query(
    "DELETE FROM jurnal_beban WHERE id_beban = ?",
    [id_beban],
    callback
  );
};

exports.getAll = (callback) => {
  db.query("SELECT * FROM jurnal_beban ORDER BY id_jurnal_beban DESC", callback);
};

exports.delete = (id, callback) => {
  db.query(
    "DELETE FROM jurnal_beban WHERE id_jurnal_beban = ?",
    [id],
    callback
  );
};
