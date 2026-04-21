import { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const url = import.meta.env.VITE_API_URL;

function PostDetails() {
    const { user } = useContext(AuthContext);
    const { id } = useParams();
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const res = await axios.get(`${url}/api/posts/${id}`);
                setPost(res.data.post);
            } catch (err) {
                setError('Post not found');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        try {
            await axios.delete(`${url}/api/posts/${id}`);
            navigate('/your-posts');
        } catch (err) {
            console.error('Failed to delete post:', err);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;
    if (!post) return <p>Post not found.</p>;

    const isOwner = user && user.id === post.userId._id;

    return (
        <>
            <h1>{post.title}</h1>

            <div>
                <p>Type: {post.type}</p>
                <p>Skill Level: {post.skill}</p>
                <p>Pattern Creator: {post.creator}</p>
                <p>Posted: {new Date(post.createdAt).toLocaleDateString()}</p>
            </div>

            {post.description && (
                <div>
                    <h2>Description</h2>
                    <p>{post.description}</p>
                </div>
            )}

            {post.image && (
                <div>
                    <h2>Image</h2>
                    <img src={`${url}/${post.image}`} alt={post.title} style={{ maxWidth: '100%' }} />
                </div>
            )}

            {post.link && (
                <div>
                    <h2>Pattern Link</h2>
                    <a href={post.link} target="_blank" rel="noopener noreferrer">{post.link}</a>
                </div>
            )}

            {post.file && (
                <div>
                    <h2>Pattern File</h2>
                    <a href={`${url}/${post.file}`} target="_blank" rel="noopener noreferrer">
                        Download File
                    </a>
                </div>
            )}

            {isOwner && (
                <div>
                    <Link to={`/edit-post/${post._id}`}>
                        <button>Edit</button>
                    </Link>
                    <button onClick={handleDelete}>Delete</button>
                </div>
            )}
        </>
    );
}

export default PostDetails;
