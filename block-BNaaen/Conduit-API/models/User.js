var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var Schema = mongoose.Schema;

var userSchema = new Schema(
  {
    username: { type: String },
    email: { type: String, minlength: 10, required: /@/ },
    password: { type: String },
    token: String,
    bio: { type: String },
    image: { type: String, default: null },
    profile: { type: mongoose.Types.ObjectId, ref: 'Profile' },
    article: { type: mongoose.Types.ObjectId, ref: 'Article' },
    comment: { type: mongoose.Types.ObjectId, ref: 'Comment' },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (this.password && this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

userSchema.methods.verifyPassword = async function (password) {
  try {
    var result = await bcrypt.compare(password, this.password);
    return result;
  } catch (error) {
    return error;
  }
};

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
    email: this.email,
    username: this.username,
    bio: this.bio,
    image: this.image,
    token: token,
  };
};

module.exports = mongoose.model('User', userSchema);