import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema(
    {
        userId: { // user who made post
            type: mongoose.Schema.Types.ObjectId,
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
            type: String,
            default: null,
        },
        uploadType: {
            type: String,
            enum: ['link', 'file', 'both'],
            required: true,
        },
        link: {
            type: String,
            default: null,
        },
        file: {
            type: String,
            default: null,
        },
        ratings: [ // may implement later
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
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
        comments: [ // may implement later
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
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