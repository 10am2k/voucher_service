import React, { useState } from 'react';
import { Redirect, withRouter } from 'react-router-dom';
import NavBar from "./Navbar";


function Home({admin,token, logout}) {


    return (
        <div className="Container">
            <NavBar admin={admin} token={token} logout={logout} />
            <header>Voucher Service System</header>
            <h1>This is the home page</h1>
        
        </div>
    );
}

export default withRouter(Home);