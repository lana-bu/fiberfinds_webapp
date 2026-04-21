import { useState, useEffect } from 'react';
import axios from 'axios';
import { IoSearch } from "react-icons/io5";
import Search from '../components/Search';
import PostList from '../components/PostList';

const url = import.meta.env.VITE_API_URL;

function Home() {
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [totalPosts, setTotalPosts] = useState(0);
    const [loading, setLoading] = useState(true);
    const limit = 10;

    // search/filter state
    const [q, setQ] = useState('');
    const [type, setType] = useState('');
    const [skill, setSkill] = useState('');

    const fetchPosts = async (pageNum, filters) => {
        setLoading(true);
        try {
            const { q: qVal, type: typeVal, skill: skillVal } = filters || { q, type, skill };
            const params = { page: pageNum };
            if (qVal) params.q = qVal;
            if (typeVal) params.type = typeVal;
            if (skillVal) params.skill = skillVal;

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

    const handleSearch = (e) => {
        e.preventDefault();
        fetchPosts(1);
    };

    const handleClear = () => {
        setQ('');
        setType('');
        setSkill('');
        fetchPosts(1, { q: '', type: '', skill: '' });
    };

    const totalPages = Math.ceil(totalPosts / limit);

    return (
        <>
            <h1>Home</h1>

            <Search onSearch={fetchPosts} />

            {loading && <p>Loading...</p>}

            {!loading && (
                <>
                    <PostList posts={posts} />

                    {totalPages > 1 && (
                        <div>
                            <button
                                onClick={() => fetchPosts(page - 1)}
                                disabled={page <= 1}
                            >
                                Previous
                            </button>
                            <span> Page {page} of {totalPages} </span>
                            <button
                                onClick={() => fetchPosts(page + 1)}
                                disabled={page >= totalPages}
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </>
    );
}

export default Home;
