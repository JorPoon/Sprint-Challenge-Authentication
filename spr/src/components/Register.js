import React, {useState} from 'react';
import axios from 'axios';

const Register = ({history}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = event => {
        event.preventDefault();

        const endpoint = 'http://localhost:5000/api/register';

        axios
        .post(endpoint,({username, password}))
        .then(res => {
            console.log('REGISTER RESPONSE', res);
            localStorage.setItem('token', res.data.token);
        })
        .catch(error => {
            console.log(error)
        })
    }

    return (
        <div>
            <form>
                <div>
                <input 
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder='Username'
                id= 'username'
                />
                </div>
                <div>
                <input 
                type="text"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder='Password'
                id='password'
                />
                </div>
                <div>
                    <button onClick={handleSubmit}>
                        Register
                    </button>
                </div>
            </form>
        </div>
    )
}

export default Register;