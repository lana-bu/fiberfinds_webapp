import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CgProfile } from "react-icons/cg";
import { AuthContext } from '../context/AuthContext';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);

  let accountContent;
  let userLinks;

  if (user) {
    accountContent = (
      <>
        <div className="profile-container">
            <CgProfile/>
            <span className="username">{user.username}</span>
        </div>
        <button onClick={logout}>Logout</button>
      </>
    );
    userLinks = (
      <>
        <li>
          <Link to="/create-post">Create Post</Link>
        </li>
        <li>
          <Link to="/your-posts">Your Posts</Link>
        </li>
      </>
    );
  } else {
    accountContent = (
      <Link className="btn-link" to="/login">
        <button className="btn">Log In</button>
      </Link>
    );
  }

  return (
    <>
      <nav>
        <button id="menu-btn" className="btn menu-btn">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 -960 960 960">
              <path className="icon menu-icon" d="M120-240v-60h720v60H120Zm0-210v-60h720v60H120Zm0-210v-60h720v60H120Z"/>
          </svg>
        </button>
        <div className="account-container">
          {accountContent}
        </div>
      </nav>

      <aside id="nav-sidebar" className="nav-sidebar">
        <ul className="menu">
          <li>
            <Link to="/">Home</Link> 
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          {userLinks}
        </ul>
      </aside>
    </>
  );
}

export default Navigation;