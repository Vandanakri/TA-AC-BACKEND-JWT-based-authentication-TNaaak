var mongoose = require('mongoose');
var bcrypt = require('bcrypt');
var slug = require('mongoose-slug-generator');
var slugger = require('slugger');
var Schema = mongoose.Schema;

var articleSchema = new Schema(
  {
      slug: { type: String, required: true, unique: true },
      title: { type: String },
      description: { type: String },
      body: { type: String },
      tagList: [{ type: String }],
      favorited: [{ type: mongoose.Types.ObjectId }],
      favoritesCount: { type: Number, default: 0 },
      author: { type: Object, require: true },
      comments: [{ type: mongoose.Types.ObjectId, ref: 'Comment' }],
    },
  { timestamps: true }
);

articleSchema.pre('save', async function (next) {
  this.article.slug = slugger(this.title);
  next();
});

module.exports = mongoose.model('Article', articleSchema);