import { Link } from 'react-router-dom';

function Footer() {
    return (
        <footer className="footer-container">
            <h1 className="site-name"><Link to="/">Fiber Finds</Link></h1>
            <p className="copyright">&copy; 2026 lana-bu</p>
        </footer>
    );
}

export default Footer;