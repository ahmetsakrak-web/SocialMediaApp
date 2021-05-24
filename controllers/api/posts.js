const router = require('express').Router();
const {check,validationResult} =require('express-validator');
const auth = require('../../middleware/auth');
const { remove } = require('../../models/post');
const Post = require('../../models/post');
const user = require('../../models/user');
const User = require('../../models/user');

router.post('/', [auth,[check('text',"text is required").notEmpty()]], async(req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
       return res.status(400).json({errors:errors.array()});
    }

    try {
        const user = await User.findById(req.user.id).select('-password');

        const newPost =new Post({
            user:req.user.id,
            text:req.body.text,
            name:user.name,
            avatar:user.avatar
        });

       const post = await newPost.save();
       res.json(post);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

router.get('/', auth, async(req,res) =>{
    try {
       const allPosts =  await Post.find().sort({date:-1});
       res.json(allPosts);
        
    } catch (error) {
          console.error(error.message);
        res.status(500).send('Server Error');
    }
});

router.get('/:post_id', auth, async(req,res) =>{
    try {
       const post =  await Post.findById(req.params.post_id);
       if(!post){
           return  res.status(404).json({msg:'Post Not Found'});
       }
       res.json(post);
        
    } catch (error) {
        if(error.kind==="ObjectId"){
            return res.status(400).json({msg:'There is not post belong to this id'});
        }
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});


router.delete('/:post_id', auth, async(req,res) =>{
    try {
      const post = await Post.findById(req.params.post_id);

       if(!post){
           return res.status(404).json({msg:'Post Not Found'});
       }

      if(post.user.toString() !== req.user.id){
        return res.status(401).json({msg:"user not authorized"});
      }
       await post.remove();
       res.json({msg:"post removed"});
        
    } catch (error) {
         if(error.kind==="ObjectId"){
            return res.status(400).json({msg:'There is not post belong to this id'});
        }
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});


router.put('/like/:post_id',auth,async(req,res)=>{
    try {
        const post = await Post.findById(req.params.post_id);
       
        if(post.likes.filter(like => like.user.toString() === req.user.id).length>0){
            return res.status(400).json({msg:'You already liked'});
        }
        post.likes.unshift({user: req.user.id});
        await post.save();
        res.json(post.likes);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});
router.put('/unlike/:post_id',auth,async(req,res)=>{
try {
      const post = await Post.findById(req.params.post_id);
      if(post.likes.filter(like => like.user.toString() === req.user.id).length===0){
         return res.status(400).json({msg:'You already unliked'});
      }
      const removeIndex = post.likes.map(like=>like.user.toString()).indexOf(req.user.id);
      post.likes.splice(removeIndex,1);
      await post.save();
      res.json(post.likes);
} catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
}
});


router.post('/comment/:post_id', [auth,[check('text',"text is required").notEmpty()]], async(req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
       return res.status(400).json({errors:errors.array()});
    }

    try {
    const user = await User.findById(req.user.id).select('-password');
    const post = await Post.findById(req.params.post_id)
    const newComment ={
        user:req.user.id,
        text:req.body.text,
        name:user.name,
        avatar:user.avatar
    };

    post.comments.unshift(newComment);
    await post.save();
    res.json(post.comments);
        
    } catch (error) {
        console.error(error.message);
        res.status(500).send('Server Error');
    }
});

router.delete('/comment/:post_id/:comment_id',auth, async(req,res)=>{
try {
    const post = await Post.findById(req.params.post_id);
    const comment =  post.comments.find(comment=>comment.id===req.params.comment_id);
    if(!comment){
        return res.status(404).json({msg:"no comment found"});
    }

    if(post.user.toString()===req.user.id || comment.user.toString()===req.user.id){
        const removedIndex = post.comments.map(comment=>comment.id).indexOf(req.params.comment_id);
        post.comments.splice(removedIndex,1);
        await post.save();
        return  res.json(post.comments);
    }
    res.status(401).json({msg:"you are not authorized"});
} catch (error) {
    console.error(error.message);
    res.status(500).send('Server Error');
}
})

module.exports=router;