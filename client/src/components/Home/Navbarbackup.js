import React from "react";
import { Link } from "react-router-dom";
import Button from '@material-ui/core/Button';

function NavBar({token, logout}) {

    return (
        <ul>
            <li>
                <Link to="/">Home</Link>
            </li>
            {token!="" ?
                <li>
                    <Link to="/billerInfo">BillerInfo</Link>
                </li> : <></>}

            
            {token!="" ?
                <li>
                    <Link to="/personalInfo">PersonInfo</Link>
                </li> : <></>}
                

            <li>
                <Link to="/login">SignIn</Link>
            </li>
            <li>
                <Link to="/SignUp">SignUp</Link>
            </li>
            <Button onClick={logout} variant="filled">Logout</Button>
        </ul>

    );
}

export default NavBar;
