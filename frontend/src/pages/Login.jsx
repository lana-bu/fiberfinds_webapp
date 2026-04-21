import { Link } from 'react-router-dom';

function Login() {
    return (
        <>
            <h1 className="content-header">Log In</h1>

            <div className='card'>
                <form method="post">
                    <div className='field'>
                        <label for='usernameOrEmail'>Username/Email: </label>
                        <input name='usernameOrEmail' placeholder='Enter username or email...' value=''/>
                    </div>
                    <div className='field'>
                        <label for='password'>Password: </label>
                        <input name='password' placeholder='Enter password...' value=''/>
                    </div>
                    
                    <button className="btn" type="submit">Create Account</button>
                </form>
            </div>

            <p class="register-links">
                If you don't already have an account, register for one <Link to='/signup'>here</Link>.
                <br>
                </br>
                (Or <Link to='/'>browse notes as Guest</Link>)
            </p>
        </>
    );
}

export default Login;