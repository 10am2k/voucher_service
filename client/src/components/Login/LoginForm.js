import React, { useState } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import NavBar from '../Home/Navbar';
import Alert from "../Alert/Alert";

import Axios from 'axios';
import PropTypes from 'prop-types'

import {
    Card,
    CardContent,
    Button,
    Typography,
    Divider,
    TextField,
} from '@material-ui/core'


function LoginForm({ storeToken,token,logout, history}) {
    

    
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const [status, setStatusBase] = React.useState("");

    const onEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const onPasswordChange = (e) => {
        setPassword(e.target.value);
    }

    const onLogin = () => {
        const payload = { email, password };
        
        Axios.post('api/user/login', payload)
            .then((res) => {
                storeToken.call(this, res.data.token);
                setStatusBase({ msg: "Login successful!", key: Math.random() });
                setTimeout(()=>{history.push('/')}, 1000);
            })
            .catch((err) => {
                setStatusBase({ msg: "Password error or email doesn't exist", key: Math.random() });
                console.error(err);
            })

    }


    return (
        <div>
            <NavBar token={token} logout={logout}/>

            <Card>
                <CardContent>
                    <Typography variant="h6">
                        Login
                </Typography>
                    <form>

                        <TextField
                            id="email"
                            type="email"
                            label="Email"
                            variant="outlined"
                            value={email}
                            onChange={onEmailChange}
                        >
                        </TextField>

                        <TextField
                            id="password"
                            type="password"
                            label="Password"
                            variant="outlined"
                            value={password}
                            onChange={onPasswordChange}
                        >

                        </TextField>

                    </form>
                    <Button
                        variant="contained"
                        color="primary"
                        onClick={onLogin}>
                        Login
                </Button>

                </CardContent>
                {status ? <Alert key={status.key} message={status.msg} /> : null}
            </Card>

        </div>





    )
}

LoginForm.propTypes = {
    storeToken: PropTypes.func.isRequired,
}



export default withRouter(LoginForm);