import { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import PostList from '../components/PostList';

const url = import.meta.env.VITE_API_URL;

function YourPosts() {
    const { user } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const [loading, setLoading] = useState(true);
    const limit = 10;

    const fetchPosts = async (pageNum) => {
        setLoading(true);

        try {
            const params = { page: pageNum };
            const res = await axios.get(`${url}/api/posts/your-posts`, { params });
            setPosts(res.data.posts);
            setTotalPosts(res.data.totalPosts)
            setPage(res.data.page)
        } catch (err) {
            console.error('Failed to fetch your posts:', err);
        } finally {
            setLoading(false);
        }
        };

    useEffect(() => {
        if (user) {
            fetchPosts(1);
        }
    }, [user]);

    const totalPages = Math.ceil(totalPosts / limit);

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;

        try {
            await axios.delete(`${url}/api/posts/${id}`);
            fetchPosts(1);
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

            {loading && <p className='empty-list'>Loading...</p>}

            {!loading && (
                <>
                    <PostList posts={posts} showActions={true} onDelete={handleDelete} emptyMessage="You haven't created any posts yet." />

                    <div className="card-actions">
                        <Link className="btn-link" to="/create-post">
                            <button className="btn">Create Post</button>
                        </Link>
                    </div>

                    {totalPages > 1 && (
                        <div className='pagination'>
                            <button className="btn" onClick={() => fetchPosts(page - 1)} disabled={page <= 1}>
                                &lt; Prev
                            </button>
                            <span className="page-count"> Page {page} of {totalPages} </span>
                            <button className="btn" onClick={() => fetchPosts(page + 1)} disabled={page >= totalPages}>
                                Next &gt;
                            </button>
                        </div>
                    )}
                </>
            )}
        </>
    );
}

export default YourPosts;
