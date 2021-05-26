import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { NavLink ,withRouter } from 'react-router-dom';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Switch from '@material-ui/core/Switch';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import Alert from "../Alert/Alert";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default function NavBar({admin,token, logout}) {
  const classes = useStyles();
  const [auth, setAuth] = React.useState(true);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorE2, setAnchorE2] = React.useState(null);
  const [status, setStatusBase] = React.useState("");
  const open = Boolean(anchorEl);
  const leftopen=Boolean(anchorE2);


  const handleChange = (event) => {
    setAuth(event.target.checked);
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLeftMenu =(event) => {
    setAnchorE2(event.currentTarget);
  };

  const handleLeftClose =() => {
    setAnchorE2(null);
  };

  const handleLogout=() =>{
      logout();
      setStatusBase({ msg: "Logout successful!", key: Math.random() });
  }
  console.log("nav:"+token);

  return (
    <div className={classes.root}>
      
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} onClick={handleLeftMenu} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Menu
                id="menu-appbar"
                anchorE2={anchorE2}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={leftopen}
                onClose={handleLeftClose}
              >
                <MenuItem> <NavLink to="/">Home</NavLink></MenuItem>
                {token==''||admin=="yes"?null:<MenuItem><NavLink to="/billerInfo">BillerInfo</NavLink></MenuItem>}
                {token==''||admin=="yes"?null:<MenuItem><NavLink to="/voucher">VoucherBooking</NavLink></MenuItem>}
                {admin=="yes"?<MenuItem><NavLink to="/ViewUser">View User</NavLink></MenuItem>:null}
                {admin=="yes"?<MenuItem><NavLink to="/ViewVoucher">View Voucher</NavLink></MenuItem>:null}
                {token!==''?null:<MenuItem> <NavLink to="/login">Login</NavLink></MenuItem>}
                {token!==''?null:<MenuItem> <NavLink to="/signup">Sign Up</NavLink></MenuItem>}
              </Menu>
          <Typography variant="h6" className={classes.title}>
          Voucher Service System
          </Typography>
          {token!==''? (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={handleClose}><NavLink to="/personalInfo">Profile</NavLink></MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </div>
          ):null}
        </Toolbar>
        {status ? <Alert key={status.key} message={status.msg} /> : null}
      </AppBar>
    </div>
  );
}
