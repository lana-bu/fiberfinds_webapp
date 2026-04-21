import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Search from '../components/Search';
import PostList from '../components/PostList';

const url = import.meta.env.VITE_API_URL;

function Home() {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const [loading, setLoading] = useState(true);
    const limit = 10;
    const lastFilters = useRef({});

    const fetchPosts = async (pageNum, filters) => {
        setLoading(true);

        // if filters provided store them, otherwise use the last-used filters (for going to previous or next page)
        if (filters) {
            lastFilters.current = filters;
        }
        const activeFilters = lastFilters.current;

        try {
            const params = { page: pageNum };
            if (activeFilters.q) {
                params.q = activeFilters.q;
            }
            if (activeFilters.type) {
                params.type = activeFilters.type;
            }
            if (activeFilters.skill) {
                params.skill = activeFilters.skill;
            }

            const res = await axios.get(`${url}/api/posts`, { params });
            setPosts(res.data.posts);
            setTotalPosts(res.data.totalPosts);
            setPage(res.data.page);
        } catch (err) {
            console.error('Failed to fetch posts:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts(1);
    }, []);

    const totalPages = Math.ceil(totalPosts / limit);

    return (
        <>
            <h1 className="content-header">Home</h1>

            <Search onSearch={fetchPosts} />

            {loading && <p className="empty-list">Loading...</p>}

            {!loading && (
                <>
                    <PostList posts={posts} />

                    {totalPages > 1 && (
                        <div className='pagnation'>
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

export default Home;
