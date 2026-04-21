import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import PostForm from '../components/PostForm';

const url = import.meta.env.VITE_API_URL;

function CreatePost() {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    if (!user) {
        return (
            <>
                <h1>Create Post</h1>
                <p>You must be <Link to="/login">logged in</Link> to create a post.</p>
            </>
        );
    }

    const handleSubmit = async (formData) => {
        await axios.post(`${url}/api/posts/create-post`, formData);
        navigate('/your-posts');
    };

    return (
        <>
            <h1>Create Post</h1>
            <p>Share a pattern with the community!</p>
            <PostForm onSubmit={handleSubmit} submitLabel="Create Post" />
        </>
    );
}

export default CreatePost;
