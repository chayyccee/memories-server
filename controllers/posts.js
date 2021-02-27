import mongoose from 'mongoose';
import PostMessage from '../models/postMessage.js'

export const getPosts = async (req, res) => {
    try {
      const postMessages = await PostMessage.find(); 
      res.status(200).json(postMessages);
    } catch (error) {
        res.status(404).json({ message: error.message })
    }
  };

export const createPost = async (req, res) => {
    const post = req.body;
    const newPost = new PostMessage(post);
   try {
// go to https://www.restapitutorial.com/httpstatuscodes.html to learn about http codes

       await newPost.save();
       res.status(201).json(newPost);
   } catch (error) {
       res.status(409).json({ message: error.message });
   }
};

export const updatePost = async (req, res) => {
  const { id: _id } = req.params;
  const post = req.body;

  // the line below checks if the id is valid
  if(!mongoose.Types.ObjectId.isValid(_id)) return res.status(404).send('no post with that id.');
  
    const updatedPost = await PostMessage.findByIdAndUpdate(_id, post, {new: true});
    res.json(updatedPost);
};

export const deletePost = async (req, res) => {
  const { id } = req.params;

  if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('no post with that id.');

    await PostMessage.findByIdAndRemove(id);

    res.json({ message: 'Post deleted successfully' });

    console.log('DELETE');

}

export const likePost = async (req, res) => {
  const { id } = req.params;
  
  if(!mongoose.Types.ObjectId.isValid(id)) return res.status(404).send('no post with that id.');

  // first find A POST 
  const post = await PostMessage.findById(id);

  // updated post and get access to updated post
  const updatedPost = await PostMessage.findByIdAndUpdate(id, { likeCount: post.likeCount + 1 }, { new: true });

  res.json(updatedPost);

}
