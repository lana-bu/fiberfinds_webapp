import { useState, useEffect } from 'react';
import axios from 'axios';
import { IoSearch } from "react-icons/io5";
import PostList from '../components/PostList';

const url = import.meta.env.VITE_API_URL;

const Search = (props)=>{
    // search/filter state
    const [q, setQ] = useState('');
    const [type, setType] = useState('');
    const [skill, setSkill] = useState('');

    const handleSearch = (e) => {
        e.preventDefault();
        props.onSearch(1);
    };

    const handleClear = () => {
        setQ('');
        setType('');
        setSkill('');
        props.onSearch(1, { q: '', type: '', skill: '' });
    };

    return (
        <>
            <form onSubmit={handleSearch}>
                <div className='search-bar'>
                    <IoSearch className='search-icon'/>
                    <input
                        type="text"
                        placeholder="Search posts..."
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                </div>
                <div>
                    <select value={type} onChange={(e) => setType(e.target.value)}>
                        <option value="">All types</option>
                        <option value="crochet">Crochet</option>
                        <option value="knitting">Knitting</option>
                        <option value="sewing">Sewing</option>
                        <option value="weaving">Weaving</option>
                        <option value="embroidery">Embroidery</option>
                        <option value="other">Other</option>
                    </select>
                </div>
                <div>
                    <select value={skill} onChange={(e) => setSkill(e.target.value)}>
                        <option value="">All skill levels</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>
                <button type="submit">Search</button>
                <button type="button" onClick={handleClear}>Clear</button>
            </form>
        </>
    );
}

export default Search;
