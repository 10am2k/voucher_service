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
      {'Copyright © Group12'}
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



function PersonalInfoForm({ token, user, storeToken ,logout,history,storeuser}) {

  const [oldpassword, setoldPassword] = useState();
  const [newpassword, setnewPassword] = useState('');
  const [fname, setfname] = useState(user.firstName);
  const [lname, setlname] = useState(user.lastName);
  const [phone, setphone] = useState(user.phoneNumber);
  const [astatus, setStatusBase] = useState("");



  const onoldPasswordChange = (e) => {
    setoldPassword(e.target.value);
  }

  const onnewPasswordChange = (e) => {
    setnewPassword(e.target.value);
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
    axios.post('api/user/edituser', { email: user.email, oldpassword: oldpassword, newpassword: newpassword, firstName: fname, lastName: lname, phoneNumber: phone })
      .then((res) => {
        setStatusBase({ msg: "Personal information edited successful!", key: Math.random() });
        storeuser({email: user.email, password: newpassword, firstName: fname, lastName: lname, phoneNumber: phone });
        setTimeout(()=>{history.push('/')}, 1000);
      }
      )
      .catch(function (error) {
        setStatusBase({ msg: "Personal information edited failed.", key: Math.random() });
        console.log(error);
        
      })
  }

  const classes = useStyles();

  return (
    <div>
    <Container component="main" maxWidth="lg">
          <NavBar token={token} logout={logout}/>
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Personal Information
        </Typography>
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              First Name
              <TextField

                name="firstName"
                variant="outlined"
                required
                fullWidth
                value={fname}
                id="firstName"

                onChange={onfnameChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              Last Name
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                value={lname}
                name="lastName"
                onChange={onlnameChange}
              />
            </Grid>

            <Grid item xs={12}>
              Old Password
              <TextField
                variant="outlined"
                required
                fullWidth
                name="oldpassword"
                value={oldpassword}
                type="password"
                id="oldpassword"

                onChange={onoldPasswordChange}
              />
            </Grid>
            <Grid item xs={12}>
              New Password
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                value={newpassword}
                type="password"
                id="password"
                onChange={onnewPasswordChange}
              />
            </Grid>
            <Grid item xs={12}>
              Phone Number
              <TextField
                variant="outlined"
                required
                fullWidth
                name="phone"
                value={phone}
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
            Change
          </Button>
        </form>
      </div>
      <Box mt={5}>
        <Copyright />
      </Box>
      
    </Container>
    {astatus ? <Alert key={astatus.key} message={astatus.msg} /> : null}
    </div>
  );
}

export default withRouter(PersonalInfoForm);