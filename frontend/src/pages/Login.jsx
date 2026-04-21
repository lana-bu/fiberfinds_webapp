import { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const url = import.meta.env.VITE_API_URL;

function Login() {
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        try {
            const res = await axios.post(`${url}/api/auth/login`, {
                usernameOrEmail,
                password,
            });
            login(res.data.user);
            navigate('/');
        } catch (err) {
            setError(err.response?.data?.message || 'Login failed');
        }
    };

    return (
        <>
            <h1>Log In</h1>

            {error && <p>{error}</p>}

            <div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="usernameOrEmail">Username/Email:</label>
                        <input
                            id="usernameOrEmail"
                            type="text"
                            placeholder="Enter username or email..."
                            value={usernameOrEmail}
                            onChange={(e) => setUsernameOrEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>

                    <button type="submit">Log In</button>
                </form>
            </div>

            <p>
                If you don't already have an account, register for one <Link to="/signup">here</Link>.
                <br />
                (Or <Link to="/">browse posts as Guest</Link>)
            </p>
        </>
    );
}

export default Login;
