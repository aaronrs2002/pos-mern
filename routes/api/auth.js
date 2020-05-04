const express = require("express");
const bcrypt = require("bcryptjs");
const config = require("config");
const jwt = require("jsonwebtoken");
const router = express.Router();
const auth = require("../../middleware/auth");

//item model
const User = require("../../models/User");

//@route POST api/auth
//@desc Auth user
//@access Public
router.post("/", (req, res) => {
  const { email, password } = req.body;

  //simple validation
  if (!email || !password) {
    return res.status(400).json({ msg: "please enter all fields" });
  }
  //check for exisiting user
  User.findOne({
    email
  }).then(user => {
    if (!user) res.status(400).json({ msg: "User does not exist" });

    //validate password
    bcrypt.compare(password, user.password).then(isMatch => {
      if (!isMatch)
        return res.status(400).json({
          msg: "Invalid credentials"
        });

      jwt.sign(
        {
          id: user._id
        },
        config.get("jwtSecret"),
        { expiresIn: 3600 },
        (err, token) => {
          if (err) throw err;
          res.json({
            token,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              adminUser: user.adminUser
            }
          });
        }
      );
    });
  });
});

//@route GET api/auth/user
//@desc get user data
//@access Private
router.get("/user", auth, (req, res) => {
  User.findById(req.user.id)
    .select("--password")
    .then(user => res.json(user));
});

module.exports = router;
