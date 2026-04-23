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
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFieldErrors({});
        setFormError('');

        try {
            const res = await axios.post(`${url}/api/auth/login`, {
                usernameOrEmail,
                password,
            });
            login(res.data.user);
            navigate('/');
        } catch (err) {
            if (err.response) {
                const data = err.response.data;

                if (data && data.errors) {
                    // validation errors grouped by field
                    setFieldErrors(data.errors);
                } else if (data && data.message) {
                    // single error message
                    setFormError(data.message);
                } else {
                    setFormError('Login failed');
                }
            } else {
                setFormError('Login failed');
            }
        }
    };

    return (
        <>
            <h1 className='content-header'>Log In</h1>

            <form className='card auth-form' onSubmit={handleSubmit}>
                {formError && <p className='form-errors'>{formError}</p>}

                <div className='field'>
                    <label htmlFor="usernameOrEmail">Username/Email:</label>
                    <input id="usernameOrEmail" name='usernameOrEmail' type="text" required='true' placeholder="Enter username or email..." value={usernameOrEmail} onChange={(e) => setUsernameOrEmail(e.target.value)} />
                    {fieldErrors.usernameOrEmail && fieldErrors.usernameOrEmail.map((msg, i) => (
                        <p className='field-error' key={i}>{msg}</p>
                    ))}
                </div>

                <div className='field'>
                    <label htmlFor="password">Password:</label>
                    <input id="password" name="password" type="password" required='true' placeholder="Enter password..." value={password} onChange={(e) => setPassword(e.target.value)} />
                    {fieldErrors.password && fieldErrors.password.map((msg, i) => (
                        <p className='field-error' key={i}>{msg}</p>
                    ))}
                </div>
                
                <div className='card-actions'>
                    <button className='btn' type="submit">Log In</button>
                </div>         
            </form>

            <div class="auth-links">
                <p>
                    If you don't already have an account, register for one <Link to="/signup">here</Link>.
                </p>

                <p>
                    (Or <Link to="/">browse posts as Guest</Link>)
                </p>
            </div>
        </>
    );
}

export default Login;
