const JurnalDP = require("../models/jurnalDPModel");

exports.getJurnalDP = (req, res) => {
  JurnalDP.getAll((err, results) => {
    if (err) return res.status(500).json(err);

    res.json(results);
  });
};