import { Component } from 'react';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import './App.css';
import { Grid } from '@material-ui/core'
import Axios from 'axios';
import LoginForm from './components/Login/LoginForm';
import Home from './components/Home/Home';
import CreateAccount from './components/Signup/CreateAccount'
import BillerInfoForm from './components/UpdateInfo/BillerInfoForm';
import PersonalInfoForm from './components/UpdatePersonalInfo/PersonalInfoForm';
import VoucherForm from './components/Voucher/CreateVoucher';
import ViewUser from './components/Admin/ViewUser';
import ViewVoucher from './components/Admin/ViewVoucher';
import AdminLoginForm from './components/Login/AdminLoginForm';
class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            token: localStorage.getItem('token') ? localStorage.getItem('token') : '',
            user: localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : '',
            admin: localStorage.getItem('admin')?localStorage.getItem('admin') : '',
        }
    }





    //stores jwt token in localStorage and sets it in the state
    storeToken = (newtoken) => {
        localStorage.setItem('token', newtoken);
        this.setState({ token: newtoken });
    }

    storeAdmin = () => {
        localStorage.setItem('admin', "yes");
        this.setState({ admin: "yes" });
    }

    storeUser = (newuser) => {
        localStorage.setItem('user', newuser);
        this.setState({ user: newuser });
    }


    logout = (() => {

        console.log("logging out")
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('admin');

        if (this.state.token != '') {
            this.setState({ token: '' });
        }
        if (this.state.admin != '') {
            this.setState({ admin: '' });
        }
        if (JSON.stringify(this.state.user) != JSON.stringify({})) {
            this.setState({ user: {} });

        }


    });

    componentDidUpdate() {
        console.log("useffect:");
        //if not logged in
        if (this.state.token == '') {
            console.log("not logged in")
            this.state.token = '';
            this.state.admin='';
            this.state.user = {};
        }

        // otherwise retrieve user and set in state
        else {
            Axios.get('api/user/get', {
                headers: {
                    Authorization: `Bearer ${this.state.token}`,
                },
            })
                .then((res) => {
                    const userString = JSON.stringify(res.data);
                    console.log("logged in user:", localStorage.getItem('user'))
                    if (userString !== JSON.stringify(localStorage.getItem('user'))) {
                        localStorage.setItem('user', userString)
                        this.state.user = res.data;
                        console.log("set new user:", this.state.user);
                    }
                })
                .catch(() => {
                    this.state.token = '';
                    this.state.admin='';
                    this.state.user = {};
                })
        }

    }


    render() {


        return (

            <Router history={this.props.history} forceRefresh={true}>
                <Switch>

                    <Route exact path="/">
                        <Home admin={this.state.admin} token={this.state.token} logout={this.logout} />
                    </Route>
                    <Route exact path="/login">
                        <LoginForm storeToken={this.storeToken} token={this.state.token} logout={this.logout}  ></LoginForm>
                    </Route>

                    <Route exact path="/signup" ><CreateAccount storeToken={this.storeToken} token={this.state.token} logout={this.logout} ></CreateAccount></Route>

                    <Route exact path="/billerInfo">

                        {this.state.token !== "" ? <BillerInfoForm user={this.state.user} token={this.state.token} logout={this.logout} ></BillerInfoForm> :
                            <LoginForm storeToken={this.storeToken} token={this.state.token} logout={this.logout} ></LoginForm>}

                    </Route>
                    <Route exact path="/personalInfo">

                        {this.state.token !== "" ? <PersonalInfoForm user={this.state.user} token={this.state.token} storeToken={this.storeToken} logout={this.logout} storeuser={this.storeUser}></PersonalInfoForm> :
                            <LoginForm storeToken={this.storeToken} token={this.state.token} logout={this.logout} ></LoginForm>}
                    </Route>
                    

                    <Route exact path="/voucher">

                        {this.state.token !== "" ? <VoucherForm user={this.state.user} token={this.state.token} storeToken={this.storeToken} logout={this.logout} storeuser={this.storeUser}></VoucherForm> :
                            <LoginForm storeToken={this.storeToken} token={this.state.token} logout={this.logout} ></LoginForm>}
                    </Route>
                    
                    <Route exact path="/admin">
                        <AdminLoginForm storeAdmin={this.storeAdmin} storeToken={this.storeToken} token={this.state.token} logout={this.logout}  ></AdminLoginForm>
                    </Route>

                    <Route exact path="/ViewUser">
                        {this.state.admin=="yes"?<ViewUser admin={this.state.admin} token={this.state.token} logout={this.logout}  ></ViewUser>:null}
                    </Route>

                    <Route exact path="/ViewVoucher">
                        {this.state.admin=="yes"?<ViewVoucher admin={this.state.admin} token={this.state.token} logout={this.logout}  ></ViewVoucher>:null}
                    </Route>

                </Switch>

            </Router>
        )
    }
}
export default App;
