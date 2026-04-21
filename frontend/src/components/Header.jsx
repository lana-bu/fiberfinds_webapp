import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';

function Header() {
    return (
        <header className="header-container">
            <img className="site-logo" src={logo}/>
            <h1 className="site-name site-name-large"><Link to="/">Fiber Finds</Link></h1>
        </header>
    );
}

export default Header;