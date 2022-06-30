var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');

// module.exports = {
//   verifyToken: async (req, res, next) => {
//     console.log(req.headers);
//     var token = req.headers.authorization;
//     try {
//       if (token) {
//         var payload = await jwt.verify(token, 'thisisasecret');
//         req.user = payload;
//         next();
//       } else {
//         res.status(400).json({ error: 'Authnetication required' });
//       }
//     } catch (error) {
//       next(error);
//     }
//   },
// };

var userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, minlength: 5, required: true },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next()
});

userSchema.methods.verifyPassword = async function (password) {
  try {
    var result = await bcrypt.compare(password, this.password);
    // console.log(result);
    return result;
  } catch (error) {
    return error;
  }
  // bcrypt.compare()
}

userSchema.methods.signToken = async function () {
  var payload = { userId: this.id, email: this.email };
  try {
    var token = await jwt.sign(payload, 'thisisasecret');
    return token;
  } catch (error) {
    return error;
  }
};

userSchema.methods.userJSON = function (token) {
  return {
    name: this.name,
    email: this.email,
    password: this.password,
    token: token,
  };
};

module.exports = mongoose.model('User', userSchema);