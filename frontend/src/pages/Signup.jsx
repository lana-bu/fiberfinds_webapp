import { Link } from 'react-router-dom';

function Signup() {
    return (
        <>
            <h1 className="content-header">Sign Up</h1>

            <div className='card'>
                <form method="post">
                    <div className='field'>
                        <label for='username'>Username: </label>
                        <input name='username' placeholder='Create username...' value=''/>
                    </div>
                    <div className='field'>
                        <label for='email'>Email: </label>
                        <input name='username' placeholder='Enter email...' value=''/>
                    </div>
                    <div className='field'>
                        <label for='password'>Password: </label>
                        <input name='password' placeholder='Create password...' value=''/>
                    </div>
                    <div className='field'>
                        <label for='password-confirm'>Confirm Password: </label>
                        <input name='password-confirm' placeholder='Confirm password...' value=''/>
                    </div>
                    
                    <button className="btn" type="submit">Create Account</button>
                </form>
            </div>

        <p class="register-links">
            If you already have an account, log in <Link to='/login'>here</Link>.
            <br></br>
            (Or <Link to='/'>browse notes as Guest</Link>)
        </p>
        </>
    );
}

export default Signup;