var express = require('express');
const auth = require('../middleware/auth');
const Article = require('../models/Article');
const Comment = require('../models/Comment');
const User = require('../models/User');
var router = express.Router();

/* create new articles. */
router.post('/', auth.isLoggedIn, async function (req, res, next) {
  let data = req.body;
  data.author = req.user;
  let createdArticle = await Article.create(data);

  let updatedUser = await User.findOneAndUpdate(
    {
      username: createdArticle.author.username,
    },
    { $push: { articles: createdArticle.id } }
  );

  res.json({ article: createdArticle });
});

/* get articles. */
router.get('/:slug', auth.isLoggedIn, async function (req, res, next) {
  let slug = req.params.slug;

  let article = await Article.findOne({ slug });

  res.json({ article: article });
});

/* update articles. */
router.put('/:slug', auth.isLoggedIn, async function (req, res, next) {
  let slug = req.params.slug;
  let data = req.body;
  let article = await Article.findOneAndUpdate({ slug }, data);

  res.json({ article: article });
});

/* delete articles. */
router.delete('/:slug', auth.isLoggedIn, async function (req, res, next) {
  let slug = req.params.slug;

  let article = await Article.findOneAndDelete({ slug });

  let updatedUser = await User.findOneAndUpdate(
    {
      username: article.author.username,
    },
    { $pull: { articles: article.id } }
  );

  res.json({ article: article });
});

/* create new comment. */
router.post(
  '/:slug/comments',
  auth.isLoggedIn,
  async function (req, res, next) {
    let slug = req.params.slug;
    let data = req.body;
    data.author = req.user;
    let article = await Article.findOne({ slug });

    data.article = article.id;

    let comment = await Comment.create(data);

    let loggedUser = await User.findOne({ username: req.user.username });

    let updatedUser = await User.findByIdAndUpdate(
      loggedUser.id,

      { $push: { comments: comment.id } }
    );

    let updatedArticle = await Article.findByIdAndUpdate(
      article.id,

      { $push: { comments: comment.id } }
    );

    res.json({ comment });
  }
);

//get comments on article

router.get('/:slug/comments', auth.isLoggedIn, async (req, res, next) => {
  let slug = req.params.slug;

  let article = await Article.findOne({ slug }).populate('comments');

  res.json({ comments: article.comments });
});

//delete comment

router.delete(
  '/:slug/comments/:id',
  auth.isLoggedIn,
  async (req, res, next) => {
    let slug = req.params.slug;
    let commentId = req.params.id;

    let deletedComment = await Comment.findByIdAndDelete(commentId);

    let updatedUser = await User.findOneAndUpdate(
      { username: deletedComment.author.username },
      { $pull: { comments: deletedComment.id } }
    );

    let updatedArticle = await Article.findOneAndUpdate(
      { slug },
      { $pull: { comments: deletedComment.id } }
    );

    res.json({ user: updatedUser });
  }
);
module.exports = router;