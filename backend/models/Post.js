import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
    {
        userId: { // user who made post
            type: Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        type: {
            type: String,
            enum: ['crochet', 'knitting', 'sewing', 'weaving', 'embroidery', 'other'],
            required: true,
        },
        title: {
            type: String, 
            ref: 'User',
            required: true,
        },
        description: {
            type: String,
            default: null,
        },
        skill: {
            type: String,
            enum: ['beginner', 'intermediate', 'advanced'],
            required: true,
        },
        creator: {
            type: String,
            required: true,
        },
        image: {
            type: File,
            default: null,
        },
        uploadType: {
            type: String,
            enum: ['link', 'file', 'both'],
            required: true,
        },
        link: {
            type: String,
            required: function() { 
                return this.uploadType === 'link' || 'both';
            }
        },
        file: {
            type: String,
            required: function() { 
                return this.uploadType === 'file' || 'both';
            }
        },
        ratings: [
            {
                userId: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                rating: {
                    type: Number,
                    enum: [1, -1],
                    required: true,
                },
            }
        ],
        comments: [
            {
                userId: {
                    type: Schema.Types.ObjectId,
                    ref: 'User',
                    required: true,
                },
                comment: {
                    type: String,
                    required: true,
                }
            }
        ],
    },
    {
        timestamps: true, // automatically handles createdAt and updatedAt fields
    }
);

export const Post = mongoose.model('Post', Post);