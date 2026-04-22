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
    const [fieldErrors, setFieldErrors] = useState({});
    const [formError, setFormError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setFieldErrors({});
        setFormError('');

        if (password !== passwordConfirm) {
            setFieldErrors({ passwordConfirm: ['Passwords do not match'] });
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
            if (err.response) {
                const data = err.response.data;

                if (data && data.errors) {
                    // validation errors grouped by field
                    setFieldErrors(data.errors);
                } else if (data && data.message) {
                    // single error message
                    setFormError(data.message);
                } else {
                    setFormError('Signup failed');
                }
            } else {
                setFormError('Signup failed');
            }
        }
    };

    return (
        <>
            <h1 className="content-header">Sign Up</h1>

            <form className='card auth-form' onSubmit={handleSubmit}>
                {formError && <p className='form-errors'>{formError}</p>}

                <div className='field'>
                    <label htmlFor="username">Username:</label>
                    <input id="username" name="username" type="text" required placeholder="Create username..." value={username} onChange={(e) => setUsername(e.target.value)} />
                    {fieldErrors.username && fieldErrors.username.map((msg, i) => (
                        <p className='field-error' key={i}>{msg}</p>
                    ))}
                </div>

                <div className='field'>
                    <label htmlFor="email">Email:</label>
                    <input id="email" name="email" type="email" required placeholder="Enter email..." value={email} onChange={(e) => setEmail(e.target.value)} />
                    {fieldErrors.email && fieldErrors.email.map((msg, i) => (
                        <p className='field-error' key={i}>{msg}</p>
                    ))}
                </div>

                <div className='field'>
                    <label htmlFor="password">Password:</label>
                    <input id="password" name="password" type="password" required placeholder="Create password..." value={password} onChange={(e) => setPassword(e.target.value)} />
                    {fieldErrors.password && fieldErrors.password.map((msg, i) => (
                        <p className='field-error' key={i}>{msg}</p>
                    ))}
                </div>

                <div className='field'>
                    <label htmlFor="passwordConfirm">Confirm Password:</label>
                    <input id="passwordConfirm" name="passwordConfirm" type="password" required placeholder="Confirm password..." value={passwordConfirm} onChange={(e) => setPasswordConfirm(e.target.value)} />
                    {fieldErrors.passwordConfirm && fieldErrors.passwordConfirm.map((msg, i) => (
                        <p className='field-error' key={i}>{msg}</p>
                    ))}
                </div>
                
                <div className='card-actions'>
                <button className="btn" type="submit">Create Account</button>
                </div>
            </form>

            <div className="auth-links">
                <p>
                    If you already have an account, log in <Link to="/login">here</Link>.
                </p>
                <p>
                    (Or <Link to="/">browse posts as Guest</Link>)
            </p>
            </div>
        </>
    );
}

export default Signup;