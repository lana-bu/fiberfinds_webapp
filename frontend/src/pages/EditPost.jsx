import { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import PostForm from '../components/PostForm';

const url = import.meta.env.VITE_API_URL;

function EditPost() {
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
                setError('Failed to load post');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [id]);

    if (!user) {
        return (
            <>
                <h1 className='content-header'>Edit Post</h1>
                <p className='centered'>You must be <Link to="/login">logged in</Link> to edit a post.</p>
            </>
        );
    }

    if (loading) return <p>Loading...</p>;
    if (error) return <p>{error}</p>;

    const isOwner = post && user.id === post.userId._id;
    const isAdmin = user.role === 'admin';
    if (!isOwner && !isAdmin) {
        return (
            <>
                <h1 className='content-header'>Edit Post</h1>
                <p className='centered'>You are not allowed to edit this post.</p>
            </>
        );
    }

    const handleSubmit = async (formData) => {
        await axios.put(`${url}/api/posts/${id}`, formData);
        navigate(`/post/${id}`);
    };

    return (
        <>
            <h1 className="content-header">Edit Post</h1>
            <PostForm initialData={post} onSubmit={handleSubmit} submitLabel="Save Changes" />
        </>
    );
}

export default EditPost;
