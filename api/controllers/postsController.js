const mongoose = require('mongoose');

const Post = mongoose.model('Post');
const Comment = mongoose.model('Comment');

const STATUS_USER_ERROR = 422;

/* Fill in each of the below controller methods */
const createPost = (req, res) => {
    const { title, text } = req.body;
    const newPost = new Post({
        title,
        text
    });
    newPost.save(newPost, (err, post) => {
        if (err) {
            res.status(STATUS_USER_ERROR);
            res.json({ 'Error posting to DB on posts: ': err.message })
            return;
        }
        res.json(post);
    });
};

const listPosts = (req, res) => {
    Post.find({})
      .populate('comments', 'text')
      .exec()
      .then((posts) => {
        res.json(posts);
      })
      .catch((err) => {
        res.status(STATUS_USER_ERROR);
        res.json({ 'Error fetching from /posts: ': err.message });
        return;
      });
  };

const findPost = (req, res) => {
    const { id } = req.params
    Post.findById({ id })
    .then((post) =>{
        res.json(post);
    })
    .catch((err) => {
        res.status(422);
        res.json(err);
    })
    // app.route('/posts/:id')
    // .get(controllerMethods.findPost)

};

const addComment = (req, res) => {
    const { text } = req.body;
    const { id } = req.params;
    const newComent = new Comment({ _parent: id, text });
    newComent.save()
      .then((comment) => {
        Post.findById(id, (err, post) => {
          if (err) {
            res.status(STATUS_USER_ERROR);
            res.json({ 'Error inserting comment into post: ': err });
            return;
          }
          post.comments.push(comment);
          post.save();
          res.json(post);
        });
      })
      .catch((err) => {
        if (err) {
          res.status(STATUS_USER_ERROR);
          res.json({ 'Error saving comment ': err.message });
          return;
        }
      });
};


// In this function, we need to delete the comment document
// We also need to delete the comment's parent post's reference 
// to the comment we just deleted
const deleteComment = (req, res) => {
    // app.route('/posts/:id/comments/:commentId')
    // .delete(controllerMethods.deleteComment);
};

// Similarly, in this function we need to delete the post document,
// along with any comments that are the children of this post
// We don't want any orphaned children in our database
const deletePost = (req, res) => {
    // app.route('/posts/:id')
    // .delete(controllerMethods.deletePost);
}; 

module.exports = {
    createPost,
    listPosts,
    findPost,
    addComment,
    deleteComment,
    deletePost
};

