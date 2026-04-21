import { Link } from 'react-router-dom';
import logo from '../assets/logo.png'

function Header() {
    return (
        <header className="header-container">
            <h1 className="site-name site-name-large"><Link to="/">Fiber Finds</Link></h1>
            <Link className="logo-link" to="/"><img className="site-logo" src={logo}/></Link>
        </header>
    );
}

export default Header;