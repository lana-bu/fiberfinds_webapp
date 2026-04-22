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
            <h1 className='content-header'>{post.title}</h1>

            {post.description && (
                <div className='card'>
                    <h2 className='card-heading'>Description</h2>
                    <p>{post.description}</p>
                </div>
            )}

            <div className='card'>
                <h2 className='card-heading'>Info</h2>
                <ul>
                    <li>Type of fiber art: <strong>{post.type}</strong></li>
                    <li>Skill level: <strong>{post.skill}</strong></li>
                    <li>Creator of pattern: <strong>{post.creator}</strong></li>
                </ul>
                {post.image && (
                    <div className=''>
                        <img className='card-image details' src={`${url}/${post.image}`} alt={post.title} />
                    </div>
                )}
                <p className='centered'>Posted on {new Date(post.createdAt).toLocaleDateString()} by {post.userId.username}</p>
            </div>

            <div className='card'>
                <h2 className='card-heading'>Pattern</h2>
                {post.link && (
                    <div>
                        <h3>Link</h3>
                        <a href={post.link} target="_blank" rel="noopener noreferrer">{post.link}</a>
                    </div>
                )}

                {post.file && (
                    <div>
                        <h3>Pattern File Preview</h3>
                        <div class="preview-container">
                            <object data={`${url}/${post.file}`} width="100%" height="600">
                                <p>
                                    Unable to preview file,
                                    <a href={`${url}/${post.file}`} target='_blank' rel='noopener noreferrer'>view here</a> instead.
                                </p>
                            </object>
                        </div>
                        <div className='card-actions'>
                            <a class="btn-link" href={`${url}/${post.file}`} download>
                                <button class="btn">Download</button>
                            </a>
                        </div>
                    </div>
                )}
            </div>

            {isOwner && (
                <div class='card-actions'>
                    <Link className='btn-link' to={`/edit-post/${post._id}`}>
                        <button className='btn'>Edit</button>
                    </Link>
                    <button className='btn danger-btn' onClick={handleDelete}>Delete</button>
                </div>
            )}
        </>
    );
}

export default PostDetails;
