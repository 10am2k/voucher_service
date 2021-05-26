import React, { useState, useEffect } from 'react';
import { NavLink ,withRouter } from 'react-router-dom';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import NavBar from '../Home/Navbar'
import axios from 'axios';
import Alert from "../Alert/Alert";

function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://material-ui.com/">
                Your Website
      </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
}));

function CreateAccount({ storeToken ,token,logout,history}) {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fname, setfname] = useState('');
    const [lname, setlname] = useState('');
    const [phone, setphone] = useState('');
    const [status, setStatusBase] = React.useState("");

    const onEmailChange = (e) => {
        setEmail(e.target.value);
    }

    const onPasswordChange = (e) => {
        setPassword(e.target.value);
    }


    const onfnameChange = (e) => {
        setfname(e.target.value);
    }

    const onlnameChange = (e) => {
        setlname(e.target.value);
    }

    const onphoneChange = (e) => {
        setphone(e.target.value);
    }
    const handleClick = () => {
        axios.post('api/user/signup', { email: email, password: password, firstName: fname, lastName: lname, phoneNumber: phone })
            .then((response) => {
                setStatusBase({ msg: "Signup successful!\n You need to login with your new account", key: Math.random() });
                setTimeout(()=>{history.push('/login')}, 1000);
                console.log(response);
            })
            .catch((error) =>{
              setStatusBase({ msg: "Signup failed!", key: Math.random() });
                console.log(error);
            })
    }
    const classes = useStyles();

    return (
        <Container component="main" maxWidth="lg">
          <NavBar token={token} logout={logout}/>
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign up
        </Typography>
                <form className={classes.form} noValidate>
                    <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="fname"
                                name="firstName"
                                variant="outlined"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                                onChange={onfnameChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                name="lastName"
                                autoComplete="lname"
                                onChange={onlnameChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                onChange={onEmailChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                onChange={onPasswordChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                variant="outlined"
                                required
                                fullWidth
                                name="phone"
                                label="Phone Number"
                                type="phone"
                                id="phone"
                                onChange={onphoneChange}
                            />
                        </Grid>

                    </Grid>
                    <Button
                        fullWidth
                        variant="contained"
                        color="primary"
                
                        onClick={handleClick}
                    >
                        Sign Up
          </Button>
                    <Grid container justify="flex-end">
                        <Grid item>
                            <Link href="#" variant="body2">
                                Already have an account? <NavLink to="/login">Sign in</NavLink>
              </Link>
                        </Grid>
                    </Grid>
                </form>
                {status ? <Alert key={status.key} message={status.msg} /> : null}
            </div>
            <Box mt={5}>
                <Copyright />
            </Box>
          
        </Container>
    );
}

export default withRouter(CreateAccount);