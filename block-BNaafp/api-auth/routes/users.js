var express = require('express');
var router = express.Router();

const User = require('../models/User');


/* GET users listing. */
router.get('/', function (req, res, next) {
  res.json({ message: "Users Information" });
});

// registration handler
router.post('/register', async (req, res, next) => {
  try {
    var user = await User.create(req.body);
    res.status(201).json({ user });
  } catch(error) {
    next(error);
  }
});

//login handler
router.post('/login', async (req, res, next) => {
  var { email, password } = req.body;
  if(!email || !password) {
    return res.status(400).json({ error: "Email/Password required"});
  }
  try {
    var user = await User.findOne({ email })
    if(!user) {
      return res.status(400).json({ error: "Email not registered"});
    }
    var result = await user.verifyPassword(password);
    if(!result) {
      return res.status(400).json({ error: "Invalid password"}); 
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;
