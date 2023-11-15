var express = require("express");
var mongoose = require("mongoose");
var router = express.Router();
var bcrypt = require("bcryptjs");
const encryption = require("../utilities/crypto-utils.js");
const Dentist = require("../schemas/dentists.js");



router.post("/register", function (req, res, next) {
  bcrypt.hash(req.body.password, 10, function (err, hashedPass) {
    if (err) {
      res.status(401).json({
        err: "no password provided",
      });
    } else {
      var new_dentist = new Dentist(req.body);
      new_dentist.password = hashedPass;
      new_dentist
        .save()
        .then(() => res.status(201).json(new_dentist))
        .catch((err) => {
          err.status = 422;
          next(err);
        });
    }
  });
});




router.post("/login", async (req, res, next) => {
  try {
    const dentist = await Dentist.findOne({ email: req.body.email });
    if (dentist === null) {
      res.status(404).json({ message: "Dentist not found " });
      return;
    }

    const ispasswordmatched = await bcrypt.compare(
      req.body.password,
      dentist.password
    );

    if (ispasswordmatched) {
      res
        .status(200)
        .json({ token: encryption.encryptToken(dentist._id.toString()) });
      return;
    }

    res.status(404).json({ message: "Dentist not matched" });
  } catch (error) {
    error.status = 422;
    next(error);
  }
});

module.exports = router;
