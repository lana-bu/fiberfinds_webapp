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
        props.onSearch(1, { q, type, skill });
    };

    const handleClear = () => {
        setQ('');
        setType('');
        setSkill('');
        props.onSearch(1, { q: '', type: '', skill: '' });
    };

    return (
        <>
            <form className="search" onSubmit={handleSearch}>
                <div className='search-bar'>
                    <IoSearch className='search-icon'/>
                    <input id="q-search" name="search" type="text" placeholder="Search posts..." value={q} onChange={(e) => setQ(e.target.value)} />
                </div>
                <div>
                    <label htmlFor="q-type">Art Type: </label>
                    <select id="q-type" name="art-type" value={type} onChange={(e) => setType(e.target.value)}>
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
                    <label htmlFor="q-skill">Art Type: </label>
                    <select id="q-skill" name="skill-level" value={skill} onChange={(e) => setSkill(e.target.value)}>
                        <option value="">All skill levels</option>
                        <option value="beginner">Beginner</option>
                        <option value="intermediate">Intermediate</option>
                        <option value="advanced">Advanced</option>
                    </select>
                </div>
                <button className="btn" type="submit">Search</button>
                <button className="btn danger-btn" type="button" onClick={handleClear}>Clear</button>
            </form>
        </>
    );
}

export default Search;
