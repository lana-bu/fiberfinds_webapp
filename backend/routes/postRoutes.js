import { Router } from 'express';
import auth from '../middleware/auth.js';
import { Post } from '../models/Post.js';

const router = Router()

// TODO move to different file
// check if search has been made
function isQueryEmpty(query) {
    const queryCount = Object.keys(query).length;
    const noRealQueries = Object.values(query).every(value => value === '' || value == null);
    if (queryCount === 0 || noRealQueries) {
        return true;
    } else {
        return false;
    }
}

// return all posts
router.get('/', async (req, res) => {
    try {
        const filter = {}; // to hold query filter values

        // filter by title/description (regex searches for q value anywhere in title/description, case insensitive)
        if (req.query.q) { // q searched for
            filter.$or = [
                { title: {'$regex' : req.query.q, '$options' : 'i' } },
                { description: {'$regex' : req.query.q, '$options' : 'i' } }
            ];
        }

        // filter by type of fiber art
        if (req.query.type) { // type searched for
            filter.type = req.query.type;
        }

        // filter by skill level
        if (req.query.skill) { // skill searched for
            filter.skill = req.query.skill;
        }            

        // filter, sort, and retrieve posts
        const posts = await Post.find(filter).sort({createdAt: -1}); // display in descending order of date created

        res.json({ posts });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// get all of the posts you (current user) created
router.get('/your-posts', auth, async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.user.id }).sort({ createdAt: -1 }); // display in descending order of date created
      
        res.json({ posts });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// create a new post
router.post('/create-post', auth, async (req, res) => {
    try {
        const { type, title, description, image, uploadType, link, file } = req.body;
        
        // TODO validate input

        const newPost = await Post.create(
            { 
                userId: req.user.id,
                type: type, 
                title: title,
                description: description,
                image: image,
                uploadType: uploadType,
                link: link,
                file: file
            }
        );

        res.status(201).json({ message: 'Post created'});
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// get a specific post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post does not exist' });
    } else {
      res.json({ post });
    }
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// edit one of your (current user) posts by ID
router.put('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);

        if (!post) {
            return res.status(404).json({ message: 'Post does not exist' });
        } else if (post.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not allowed to edit this post' });
        } else {
            // only include fields that have actually changed
            const editableFields = ['type', 'title', 'description', 'image', 'uploadType', 'link', 'file'];
            const updates = {};

            // look for fields where change was made
            for (const field of editableFields) {
                if (req.body[field] !== undefined && req.body[field] !== post[field]) {
                    updates[field] = req.body[field];
                }
            }

            // check if any changes were actually made
            if (Object.keys(updates).length === 0) {
                return res.json({ message: 'No changes detected' });
            }

            // update post with changes
            await Post.findByIdAndUpdate(req.params.id, { $set: updates });
            res.json({ message: 'Post edited' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// delete a specific post by ID
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        
        if (!post) {
            return res.status(404).json({ message: 'Post does not exist' });
        } else if (post.userId.toString() !== req.user.id) {
            return res.status(403).json({ message: 'You are not allowed to delete this post' });
        } else {
            // TODO delete actual files before deleting post (which only holds file paths)
            await Post.findByIdAndDelete(req.params.id);
            res.json({ message: 'Post deleted' });
        }
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
