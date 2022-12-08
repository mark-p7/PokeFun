import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { TextField, Stack, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
export default function Register() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const navigate = useNavigate();

    return (
        <div style={{ width: '80%', margin: '50px auto 50px auto', fontFamily: 'poppins' }}>
            <h1>
                Register
            </h1>
            <Stack spacing={2} direction="column">
                <TextField label="Username" variant="outlined" onChange={(e) => setUsername(e.target.value)} />
                <TextField label="Password" type="password" variant="outlined" onChange={(e) => setPassword(e.target.value)} />
                <TextField label="Email" variant="outlined" onChange={(e) => setEmail(e.target.value)} />
                <Button variant="contained" onClick={async () => {
                    await axios.post('http://localhost:8081/register/admin', {
                        username: username,
                        password: password,
                        email: email
                    }).then((res) => {
                        console.log(res);
                        navigate('/login');
                    }).catch((err) => {
                        console.log(err);
                    })
                }}>Register Admin</Button>
                <Button variant="contained" onClick={async () => {
                    await axios.post('http://localhost:8081/register', {
                        username: username,
                        password: password,
                        email: email
                    }).then((res) => {
                        console.log(res);
                        navigate('/login');
                    }).catch((err) => {
                        console.log(err);
                    })
                }}>Register</Button>
            </Stack>
        </div>
    )
}
