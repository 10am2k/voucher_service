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
class App extends Component{
  constructor(props) { super(props); 
  
  this.state={
    token:localStorage.getItem('token')?localStorage.getItem('token'):'',
    user:localStorage.getItem('user')?JSON.parse(localStorage.getItem('user')):''
  }}


    
  

  //stores jwt token in localStorage and sets it in the state
  storeToken = (newtoken) => {
    localStorage.setItem('token', newtoken);
    this.setState({token:newtoken});
  }

  storeUser = (newuser) => {
    localStorage.setItem('user', newuser);
    this.setState({user:newuser});
  }


  logout = (() => {

    console.log("logging out")
    localStorage.removeItem('user');
    localStorage.removeItem('token');

    if (this.state.token != '') {
      this.setState({token:''});
    }
    if (JSON.stringify(this.state.user) != JSON.stringify({})) {
      this.setState({user:{}});

    }
    

  });
 
  componentDidUpdate() {
    console.log("useffect:");
    //if not logged in
    if (this.state.token == '') {
      console.log("not logged in")
      this.state.token='';
      this.state.user={};
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
            this.state.user=res.data;
            console.log("set new user:", this.state.user);
          }
        })
        .catch(() => {
          this.state.token='';
          this.state.user={};
        })
    }

  }


  render() {


  return (

    <Router history={this.props.history} forceRefresh={true}>
      <Switch>

      <Route exact path="/">
        <Home token={this.state.token} logout={this.logout} />
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
      </Switch>

    </Router>
  )
}
}
export default App;
