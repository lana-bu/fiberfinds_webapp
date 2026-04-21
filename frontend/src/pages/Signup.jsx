import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const url = import.meta.env.VITE_API_URL;

function Signup() {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirm, setPasswordConfirm] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== passwordConfirm) {
            setError('Passwords do not match');
            return;
        }

        try {
            await axios.post(`${url}/api/auth/signup`, {
                username,
                email,
                password,
            });
            navigate('/login');
        } catch (err) {
            const data = err.response?.data;
            if (data?.errors) {
                const messages = Object.values(data.errors).flat();
                setError(messages.join('. '));
            } else {
                setError(data?.message || 'Signup failed');
            }
        }
    };

    return (
        <>
            <h1>Sign Up</h1>

            {error && <p>{error}</p>}

            <div>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label htmlFor="username">Username:</label>
                        <input
                            id="username"
                            type="text"
                            placeholder="Create username..."
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="email">Email:</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter email..."
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="password">Password:</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Create password..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="passwordConfirm">Confirm Password:</label>
                        <input
                            id="passwordConfirm"
                            type="password"
                            placeholder="Confirm password..."
                            value={passwordConfirm}
                            onChange={(e) => setPasswordConfirm(e.target.value)}
                        />
                    </div>

                    <button type="submit">Create Account</button>
                </form>
            </div>

            <p>
                If you already have an account, log in <Link to="/login">here</Link>.
                <br />
                (Or <Link to="/">browse posts as Guest</Link>)
            </p>
        </>
    );
}

export default Signup;
