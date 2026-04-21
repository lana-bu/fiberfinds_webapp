import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext.jsx';
import Header from './components/Header.jsx';
import Navigation from './components/Navigation.jsx';
import Footer from './components/Footer.jsx';
import Home from './pages/Home.jsx';
import About from './pages/About.jsx';
import PostDetails from './pages/PostDetails.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import YourPosts from './pages/YourPosts.jsx';
import CreatePost from './pages/CreatePost.jsx';
import EditPost from './pages/EditPost.jsx';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Header />
      <Navigation />
      <main className='content-container'>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/post/:id" element={<PostDetails />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/your-posts" element={<YourPosts />} />
          <Route path="/create-post" element={<CreatePost />} />
          <Route path="/edit-post/:id" element={<EditPost />} />
        </Routes>
      </main>
      <Footer />
    </AuthProvider>
  );
}

export default App;
