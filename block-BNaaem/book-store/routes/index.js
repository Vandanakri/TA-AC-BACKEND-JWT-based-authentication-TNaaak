var express = require('express');
var router = express.Router();
var Book = require('../models/Book');
var Comment = require('../models/Comment');

var auth = require('../middleware/auth');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/protected', auth.verifyToken, (req, res) => {
  console.log(req.user);
  res.json({ access: 'protected resource' });
});

// Displaying all the books

router.get('/protected/book', async (req, res, next) => {
  try {
    var book = await Book.find({});
    res.status(200).json({ book });
    next();
  } catch (error) {
    return error;
  }
});

// Creating the book

router.get('/protectec/book/new', auth.verifyToken, async (req, res, next) => {
  try {
    res.status(200).json({ message: 'bookinfo' });
    next();
  } catch (error) {
    return error;
  }
});

router.post('/protected/book/new', auth.verifyToken, async (req, res, next) => {
  try {
    var book = await Book.create(req.body);
    res.status(200).json({ book });
    next();
  } catch (error) {
    return error;
  }
});

// Fetching individual details route

router.get('/protected/book/:id', auth.verifyToken, async (req, res, next) => {
  var id = req.params.id;
  try {
    var book = await Book.findById(id);
    res.status(200).json({ book });
  } catch (error) {
    return error;
  }
});

// Updating the individual route

router.get(
  '/protected/book/:id/update',
  auth.verifyToken,
  async (req, res, next) => {
    var id = req.params.id;
    try {
      var update = await Book.findByIdAndUpdate(id, req.body);
      res.status(200).json({ update });
      next();
    } catch (error) {
      return error;
    }
  }
);

// Deleting the book route

router.get(
  'protected/book/:id/delete',
  auth.verifyToken,
  async (req, res, next) => {
    var id = req.params.id;
    try {
      var del = await Book.findByIdAndRemove(id);
      res.status(200).json({ del });
      next();
    } catch (error) {
      return error;
    }
  }
);

// Adding Comment

router.post(
  '/protected/book/:id/comment',
  auth.verifyToken,
  async (req, res, next) => {
    var id = req.params.id;
    req.body.bookId = id;
    try {
      var comment = await Comment.create(req.body);
      var book = await Book.findByIdAndUpdate(id, {
        $push: { comment: comment._id },
      });
      res.status(200).json({ comment });
    } catch (error) {
      return error;
    }
  }
);

// Updating Comment

router.put(
  'protected/book/:id/edit',
  auth.verifyToken,
  async (req, res, next) => {
    var id = req.params.id;
    try {
      var updateComment = await Comment.findByIdAndUpdate(id, req.body);
      res.status(200).json({ updateComment });
      next();
      console.log(req.body);
    } catch (error) {
      return error;
    }
  }
);

//delete
router.delete(
  'protected/book/:id/delete',
  auth.verifyToken,
  async (req, res, next) => {
    var commentId = req.params.id;
    try {
      var del = await Comment.findByIdAndDelete(commentId);
      res.status(200).json({ del });
      next();
    } catch (error) {
      return error;
    }
  }
);

module.exports = router;