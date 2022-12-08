import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios';
import { TextField, Stack, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Context } from '../context/userContext';

function Login() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const { userStatus, setUserStatus } = useContext(Context)

    return (
        <div style={{ width: '80%', margin: '50px auto 50px auto' }}>
            <h1>
                Login
            </h1>
            {userStatus.loggedIn ? <h1>Already logged in</h1> :
                <Stack spacing={2} direction="column">
                    <TextField label="Username" variant="outlined" onChange={(e) => setUsername(e.target.value)} />
                    <TextField label="Password" type="password" variant="outlined" onChange={(e) => setPassword(e.target.value)} />
                    <Button variant="contained" onClick={async () => {
                        await axios.post('http://localhost:8081/login', {
                            username: username,
                            password: password,
                        })
                            .then(res => {
                                console.log(res);
                                localStorage.setItem('username', username);
                                localStorage.setItem('password', password);
                                console.log(res.data)
                                if (res.data.role == 'admin') {
                                    localStorage.setItem('admin-token', res.data.token);
                                }
                                localStorage.setItem('token', res.data.token);
                                setUserStatus({
                                    loggedIn: 'true',
                                    isAdmin: localStorage.getItem('admin-token') ? true : false,
                                });
                                navigate('/home');
                            }).catch((err) => {
                                console.log(err);
                            })
                    }}>Login</Button>
                </Stack>}
        </div>
    )
}

export default Login