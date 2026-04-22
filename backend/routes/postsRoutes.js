import { Router } from 'express';
import path from 'path';
import fs from 'fs/promises';
import auth from '../middleware/auth.js';
import { createOrEditPostRules } from '../middleware/validation/postValidation.js'
import { validate } from '../middleware/validation/validate.js'
import { handleUpload } from '../middleware/upload.js';
import { Post } from '../models/Post.js';
import { User } from '../models/User.js';

const router = Router()

// convert absolute file path to relative URL path (e.g. "uploads/file.png")
function toRelativePath(absolutePath) {
    return 'uploads/' + path.basename(absolutePath);
}

const uploadFields = handleUpload([
    { name: 'image', maxCount: 1 },
    { name: 'file', maxCount: 1 }
])

// return all posts
router.get('/', async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1; // page number user chose
        const limit = 10; // display 10 posts per page
        const offset = (page - 1) * limit; // starting point for posts

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

        // number of posts that match filter fields
        const totalPosts = await Post.countDocuments(filter);

        // filter, skip and limit for pagnation, sort, and retrieve posts
        const posts = await Post.find(filter).populate('userId', 'username').skip(offset).limit(limit).sort({createdAt: -1}); // display in descending order of date created

        res.json({ page, limit, totalPosts, posts });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// get all of the posts you (current user) created
router.get('/your-posts', auth, async (req, res) => {
    try {
        const posts = await Post.find({ userId: req.user.id }).populate('userId', 'username').sort({ createdAt: -1 }); // display in descending order of date created
      
        res.json({ posts });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// create a new post
router.post('/create-post', auth, uploadFields, createOrEditPostRules, validate, async (req, res) => {
    try {
        const { type, title, description, skill, creator, uploadType, link } = req.body;

        let image = null;
        let file = null;
        if (req.files) {
            if (req.files.image && req.files.image[0]) {
                image = toRelativePath(req.files.image[0].path);
            }
            if (req.files.file && req.files.file[0]) {
                file = toRelativePath(req.files.file[0].path);
            }
        }

        // TODO validate input (make sure uploadType matches with link and file values)

        await Post.create({
            userId: req.user.id, 
            type: type,
            title: title,
            description: description,
            skill: skill,
            creator: creator,
            image: image,
            uploadType: uploadType,
            link: link,
            file: file
        });

        res.status(201).json({ message: 'Post created'});
    } catch (err) {
        // delete any saved files if create failed
        if (req.files) {
            if (req.files.image && req.files.image[0]) { // image array exists, and first element of it exists
                await fs.unlink(req.files.image[0].path).catch(() => {}); // delete image file
            }
            if (req.files.file && req.files.file[0]) { // file array exists, and first element of it exists
                await fs.unlink(req.files.file[0].path).catch(() => {}); // delete file
            }
        }

        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// get a specific post by ID
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('userId', 'username');

    if (!post) {
      return res.status(404).json({ message: 'Post does not exist' });
    } else {
      res.json({ post });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// edit a post by ID (owner or admin)
router.put('/:id', auth, uploadFields, createOrEditPostRules, validate, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!post) {
            return res.status(404).json({ message: 'Post does not exist' });
        } else if (post.userId.toString() !== req.user.id && currentUser.role !== 'admin') {
            return res.status(403).json({ message: 'You are not allowed to edit this post' });
        } else {
            // only include fields that have actually changed
            const editableBodyFields = ['type', 'title', 'description', 'skill', 'creator', 'uploadType', 'link'];
            const editableFileFields = ['image', 'file'];
            const updates = {};

            // look for body fields where change was made
            for (const field of editableBodyFields) {
                if (req.body[field] !== undefined && req.body[field] !== post[field]) {
                    updates[field] = req.body[field];
                }
            }

            // check for uploadType change
            if (updates.uploadType) {
                if (updates.uploadType === 'link' && post.file)  {
                    // delete file previously saved from uploadType 'file' or 'both'
                    await fs.unlink(post.file).catch(() => {});
                    updates.file = null;
                } else if (updates.uploadType === 'file' && post.link) {
                    // delete link previously saved from uploadType 'link' or 'both'
                    updates.link = null;
                }
            }

            // look for file fields where change was made
            for (const field of editableFileFields) {
                // skip file fields that the new uploadType doesn't need
                let effectiveUploadType = null;
                if (updates.uploadType) {
                    effectiveUploadType = updates.uploadType;
                } else {
                    effectiveUploadType = post.uploadType;
                }

                if (field === 'file' && effectiveUploadType === 'link') {
                    continue;
                }

                if (req.files && req.files[field] && req.files[field][0]) {
                    // delete old file from disk if it exists
                    if (post[field]) {
                        await fs.unlink(post[field]).catch(() => {});
                    }

                    // save updated path
                    updates[field] = toRelativePath(req.files[field][0].path);
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
        // delete any saved files if update failed
        if (req.files) {
            if (req.files.image && req.files.image[0]) { // image array exists, and first element of it exists
                await fs.unlink(req.files.image[0].path).catch(() => {}); // delete image file
            }
            if (req.files.file && req.files.file[0]) { // file array exists, and first element of it exists
                await fs.unlink(req.files.file[0].path).catch(() => {}); // delete file
            }
        }
    
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

// delete a specific post by ID (owner or admin)
router.delete('/:id', auth, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        const currentUser = await User.findById(req.user.id);

        if (!post) {
            return res.status(404).json({ message: 'Post does not exist' });
        } else if (post.userId.toString() !== req.user.id && currentUser.role !== 'admin') {
            return res.status(403).json({ message: 'You are not allowed to delete this post' });
        } else {
            // delete post's files
            if (post.image) {
                await fs.unlink(post.image).catch(() => {});
            }
            if (post.file) {
                await fs.unlink(post.file).catch(() => {});
            }

            await Post.findByIdAndDelete(req.params.id);
            res.json({ message: 'Post deleted' });
        }
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router;
