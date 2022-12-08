import React, { useEffect, useState, useContext } from 'react'
import axios from 'axios';
import { TextField, Stack, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Context } from '../context/userContext';
function Logout() {

    const navigate = useNavigate();
    const { userStatus, setUserStatus } = React.useContext(Context)

    return (
        <div style={{ width: '80%', margin: '50px auto 50px auto' }}>
            <h1>Logout</h1>
            <Stack spacing={2} direction="column">
                <Button variant="contained" onClick={async () => {
                    if (localStorage.getItem('token')) {
                        await axios.post('https://164.92.122.241:8081/logout', {
                            "auth-token": localStorage.getItem('auth-token'),
                        })
                            .then(res => {
                                localStorage.clear();
                                console.log(res);
                                setUserStatus({
                                    loggedIn: false,
                                    isAdmin: false,
                                });
                                navigate('/home');
                            }).catch((err) => {
                                alert('Error logging out');
                                console.log(err);
                            })
                    }
                }}>Logout</Button>
            </Stack>
        </div>
    )
}

export default Logout