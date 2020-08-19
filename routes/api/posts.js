import express from 'express';
import auth from '../../middleware/auth';
import {check, validationResult} from 'express-validator';
import config from 'config';
import Post from '../../models/Post';
import User from '../../models/User';
import Profile from '../../models/Profile';
const router = express.Router();

// @route   GET api/posts
// @desc    Get all posts
// @access  private
router.get('/', auth, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (err){
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET api/posts/:post_id
// @desc    Get post by id
// @access  private
router.get('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findOne({ _id: req.params.post_id });

    if(!post) return res.status(404).json({msg: "Post not found"});
    
    res.json(post);
  } catch (err){
    console.error(err.message);
    if(err.kind === 'ObjectId') return res.status(404).json({msg: "Post not found"});
    res.status(500).send('Server Error');
  }
});

// @route   POST api/posts
// @desc    create a post
// @access  private
router.post('/', auth, [
  check('text', 'text is required').not().isEmpty()
], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try{
    const user = await User.findOne({_id: req.user.id}).select('-password');

    const newPost = new Post({
      user: req.user.id,
      name: user.name,
      avatar: user.avatar,
      text: req.body.text,

    });
    await newPost.save();
    res.json(newPost);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }

});

// @route   DELETE api/posts/:post_id
// @desc    Delete post by id
// @access  private
router.delete('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    
    if(!post) return res.status(404).json({msg: "Post not found"});
    if(post.user.toString() !== req.user.id) return res.status(401).json({msg: 'User not authorized'});

    await post.remove();
    res.json({msg: 'Post removed'});
  
  } catch (err){
    console.error(err.message);
    if(err.kind === 'ObjectId') return res.status(404).json({msg: "Post not found"});
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/posts/like/:post_id
// @desc    Like a POST
// @access  private
router.put('/like/:post_id', auth, async (req, res) => {
 try{
  const post = await Post.findById(req.params.post_id);

  // check if the post is already liked
  if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0){
    return res.status(400).json({ msg: "Post already liked" });
  }

  post.likes.unshift({ user: req.user.id });
  await post.save();

  res.json(post.likes);

 }catch (err){
    console.error(err.message);
    if(err.kind === 'ObjectId') return res.status(404).json({msg: "Post not found"});
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/posts/unlike/:post_id
// @desc    unlike a POST
// @access  private
router.put('/unlike/:post_id', auth, async (req, res) => {
  try{
   const post = await Post.findById(req.params.post_id);
 
   // check if the post is already liked
   if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0){
     return res.status(400).json({ msg: "Post has not yet been liked" });
   }
 
   const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);
   post.likes.splice(removeIndex, 1);
   await post.save();
 
   res.json(post.likes);
 
  }catch (err){
     console.error(err.message);
     if(err.kind === 'ObjectId') return res.status(404).json({msg: "Post not found"});
     res.status(500).send('Server Error');
   }
 });

// @route   POST api/posts/comment/:post_id
// @desc    comment on a post
// @access  private
router.post('/comment/:post_id', auth, [
  check('text', 'text is required').not().isEmpty()
], async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const post = await Post.findById(req.params.post_id);

    if(!post) return res.status(404).json({msg: "Post not found"});
    
    const newComment = {
      user: req.user.id,
      name: user.name,
      avatar: user.avatar,
      text: req.body.text
    };

    post.comments.unshift(newComment);
    await post.save();
    res.json(post.comments);

  } catch (err){
     console.error(err.message);
     if(err.kind === 'ObjectId') return res.status(404).json({msg: "Post not found"});
     res.status(500).send('Server Error');
   }
});

// @route   DELETE api/posts/comment/:post_id/:comment_id
// @desc    Delete a Comment
// @access  private
router.delete('/comment/:post_id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    if(!post) return res.status(404).json({msg: "Post not found"});
    
    // pull out comment
    const comment = post.comments.find(comment => comment._id.toString() === req.params.comment_id);
    if(!comment) return res.status(404).json({ msg: "Comment not found" });

    // check comment ownership
    if(comment.user.toString() !== req.user.id) return res.status(401).json({ msg: 'User not authorized to perform this action.' });

    // Remove Comment
    const removeIndex = post.comments.map(comment => comment._id.toString()).indexOf(req.params.comment_id);
    post.comments.splice(removeIndex, 1);

    await post.save();
    res.json(post.comments);

  } catch (err) {
    console.error(err.message);
    if(err.kind === 'ObjectId') return res.status(404).json({msg: "Post not found"});
    res.status(500).send('Server Error');
  }
});

export default router;