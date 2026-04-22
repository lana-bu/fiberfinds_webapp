import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import PostList from '../components/PostList';

const url = import.meta.env.VITE_API_URL;

function YourPosts() {
    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const res = await axios.get(`${url}/api/posts/your-posts`);
                setPosts(res.data.posts);
            } catch (err) {
                console.error('Failed to fetch your posts:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user) {
            fetchPosts();
        }
    }, [user]);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        try {
            await axios.delete(`${url}/api/posts/${id}`);
            setPosts(posts.filter(post => post._id !== id));
        } catch (err) {
            console.error('Failed to delete post:', err);
        }
    };

    if (!user) {
        return (
            <>
                <h1 className="content-header">Your Posts</h1>
                <p className='centered'>You must be <Link to="/login">logged in</Link> to view your posts.</p>
            </>
        );
    }

    return (
        <>
            <h1 className="content-header">Your Posts</h1>

            {loading && <p>Loading...</p>}

            {!loading && (
                <PostList
                    posts={posts}
                    showActions={true}
                    onDelete={handleDelete}
                    emptyMessage="You haven't created any posts yet."
                />
            )}
        </>
    );
}

export default YourPosts;
