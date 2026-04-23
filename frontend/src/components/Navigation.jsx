import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { IoMenu } from "react-icons/io5";
import { CgProfile } from "react-icons/cg";
import { AuthContext } from '../context/AuthContext';

const Navigation = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  let accountContent;
  let userLinks;

  const handleLogout = async () => {
    await logout();
    // route user to home page after logout
    navigate('/');
  };


  if (user) { // if user is registered
    // display username and logout button
    accountContent = (
      <>
        <div className="profile-container">
            <CgProfile/>
            <span className="username">{user.username}</span>
        </div>
        <button className="btn" onClick={handleLogout}>Log Out</button>
      </>
    );
    // display create post and your post links in nav menu
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
  } else { // if user is not registered
    // display login button
    accountContent = (
      <Link className="btn-link" to="/login">
        <button className="btn">Log In</button>
      </Link>
    );
  }

  // show or hide sidebar when user clicks hamburger menu button
  const toggleSidebar = () => {
        const sidebar = document.getElementById("nav-sidebar");

        if (sidebar.style.display == "block") {
            sidebar.style.display = "none";
        } else {
            sidebar.style.display = "block";
        }
    };

  return (
    <>
      <nav className='nav-container'>
        <button className="btn menu-btn" onClick={toggleSidebar}>
          <IoMenu className='menu-icon'/>
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