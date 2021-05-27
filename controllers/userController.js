const bcrypt = require("bcryptjs");
const c = require("config");
const emailValidator = require("email-validator");
const { response } = require("express");
const mongoose = require("mongoose");
const { passwordStrength } = require('check-password-strength');
const userModel = mongoose.model("users");

const { generateToken, authenticateToken } = require("../utils/jwtTokens");
const { string } = require("prop-types");


const getUser = (req, res) => {

    //id is the user's email 
    const { id } = req.user;

    userModel.findById(id)
        .lean()
        .then((doc) => {

            console.log(doc)
            res.status(200);
            res.send(doc);

        })
        .catch((err) => {

            res.status(500);
            res.send("Could not find user :(");
        })


}


// login and return an authorization token
const login = (req, res) => {

    //check that email and password are present
    if (!req.body.email || !req.body.password) {
        res.status(400);
        res.send("Login failed, missing email or password");
        return;
    }

    //callback on validate password, this function gets called after comparing passwords
    const validatePassword = (err, valid) => {
        if (err) {
            res.status(500);
            res.send("Login failed, something went wrong");
        }
        // login successful
        if (valid) {
            const payload = {
                id: user._id,
            };

            console.log("Login successful");
            res.status(200);

            // generate and send an authorization token
            res.send({ token: generateToken(payload) })
        }
        // login failed
        else {
            console.log("Login failed, wrong password");

            res.status(400);
            res.send("Login failed - wrong password");
        }

    };

    // callback function to validate account after finding a user from the database
    const validateAccount = (err, docs) => {
        console.log(docs);
        if (docs.length === 0) {
            res.status(400);
            res.send("Login failed, no account exists with that email");
            return;
        }
        if (err) {
            console.log("Login failed, something went wrong");
            res.send("Login failed, something went wrong");
            return;
        }

        user = docs[0];
        bcrypt.compare(req.body.password, user.password, validatePassword);

    };

    userModel.find({ email: req.body.email }, validateAccount);


}

const adminlogin = (req, res) => {

    //check that email and password are present
    if (!req.body.email || !req.body.password) {
        res.status(400);
        res.send("Login failed, missing email or password");
        return;
    }

    //callback on validate password, this function gets called after comparing passwords
    const validatePassword = (err, valid) => {
        if (err) {
            res.status(500);
            res.send("Login failed, something went wrong");
        }
        // login successful
        if (valid && user.isAdmin) {
            const payload = {
                id: user._id,
            };

            console.log("Login successful");
            res.status(200);

            // generate and send an authorization token
            res.send({ token: generateToken(payload) })
        }
        // login failed
        else {
            console.log("Login failed, wrong password");

            res.status(400);
            res.send("Login failed - wrong password");
        }

    };

    // callback function to validate account after finding a user from the database
    const validateAccount = (err, docs) => {
        console.log(docs);
        if (docs.length === 0) {
            res.status(400);
            res.send("Login failed, no account exists with that email");
            return;
        }
        if (err) {
            console.log("Login failed, something went wrong");
            res.send("Login failed, something went wrong");
            return;
        }

        user = docs[0];
        bcrypt.compare(req.body.password, user.password, validatePassword);

    };

    userModel.find({ email: req.body.email }, validateAccount);


}


//adding and/or updating biller information
const updateBillerInfo = (req, res) => {

    if (
        !req.body.billerFirstName ||
        !req.body.billerLastName ||
        !req.body.billerEmail

    ) {
        res.status(400);
        res.send("Failed to add biller info, missing fields");
        return;
    }
    const billerInfo = {
        billerFirstName: req.body.billerFirstName,
        billerLastName: req.body.billerLastName,
        billerEmail: req.body.billerEmail
    }
    if(!validator.validate(req.body.billerEmail))
    {
        res.status(400);
        res.send("Failed to add biller info, invalid email");
        return;
    }
    console.log("id=", req.body);
    const id = req.body.id;

    userModel.findById(id).lean().then((user) => {

        if (!user) {
            console.log("Update biller info failed, can't find user");
            res.send("failed to find user");
        }
        else {
            userModel.updateOne({ _id: id }, billerInfo, (err, result) => {
                if (err) {
                    console.log("User was not updated successfully");
                    console.error(err);
                }
                else {
                    if (result.n === 1) {
                        console.log("User was updated successfully");
                        res.send("User updated successfully");
                    } else {
                        console.log("User was not updated successfully: Cannot find user");
                        res.send("Cannot Find User");
                    }
                }
            })

        }

    })



}


// add a new user to the database

const addUser = (req, res) => {
    //check that required fields are present
    if (
        !req.body.email ||
        !req.body.password ||
        !req.body.firstName ||
        !req.body.lastName ||
        !req.body.phoneNumber
    ) {
        res.status(400);
        res.send("Sign up failed, missing fields");
        return;
    }

    //check that password is long enough
    if (passwordStrength(req.body.password).value!="Strong") {
        res.status(400);
        res.send("password too short");
        console.log("password too week");
        return;
    }

    const newUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        phoneNumber: req.body.phoneNumber,

    }

    //hash the password with 10 salt rounds and add the new user to the database
    bcrypt.hash(req.body.password, 10, (err, hash) => {

        newUser.password = hash;

        const data = new userModel(newUser);

        data.save(function (err, newuser) {

            let errmsg = "There was a problem processing your data, please submit again";
            if (err) {

                if (err.keyValue && Object.keys(err.keyValue) && Object.keys(err.keyValue)[0]) {
                    errmsg = "Signup failed - this " + Object.keys(err.keyValue)[0] + " is already in use."
                }
                if (err.errors) {
                    errmsg = "Signup failed - the email address you provided was invalid"
                }
                res.status(400);
                res.send(errmsg)
            }

            else {
                var newid = newuser._id;
                res.send("successfully created new user");
            }


        });


    });
}
const getall=(req,res)=>{
    
    userModel.find()
    .lean()
    .then((doc) => {

        console.log(doc)
        res.status(200);
        res.send(doc);

    })
            
       

}
const addvoucher =(req,res) =>{
    if (
        !req.body.type ||
        !req.body.delivery ||
        !req.body.date 

    ) {
        res.status(400);
        res.send("Failed to add voucher, missing fields");
        console.log("wah");
        return;
    }
    const voucher = {
        type: req.body.type,
        delivery: req.body.delivery,
        date: req.body.date,
        message:req.body.message,
        status:"open"
    }
    
    console.log("id=", req.body);
    const id = req.body.id;

    userModel.findById(id).lean().then((user) => {

        if (!user) {
            console.log("Update biller info failed, can't find user");
            res.send("failed to find user");
        }
        else {
            userModel.updateOne({ _id: id },{$push:{"voucher":voucher}}, (err, result) => {
                if (err) {
                    console.log("User was not updated successfully");
                    console.error(err);
                }
                else {
                    if (result.n === 1) {
                        console.log("User was updated successfully");
                        res.send("User updated successfully");
                    } else {
                        console.log("User was not updated successfully: Cannot find user");
                        res.send("Cannot Find User");
                    }
                }
            })

        }

    })
}

const updatevoucher =(req,res) =>{
    
    

    console.log("id=", req.body);
    const id = req.body.id;

    userModel.findById(id).lean().then((user) => {

        if (!user) {
            console.log("Update biller info failed, can't find user");
            res.send("failed to find user");
            
        }
        else {
            console.log(user.voucher[req.body.index-1])
            const voucher = {
                type: user.voucher[req.body.index-1].type,
                delivery: user.voucher[req.body.index-1].delivery,
                date: user.voucher[req.body.index-1].date,
                message:user.voucher[req.body.index-1].message,
                status:"close"
            }
            userModel.updateOne({ _id: id },{$set:{"voucher.0":voucher}}, (err, result) => {
                if (err) {
                    console.log("User was not updated successfully");
                    console.error(err);
                }
                else {
                    if (result.n === 1) {
                        console.log("User was updated successfully");
                        res.send("User updated successfully");
                    } else {
                        console.log("User was not updated successfully: Cannot find user");
                        res.send("Cannot Find User");
                    }
                }
            })

        }

    })
}

const editUser = (req, res) => {
    
    //check that email and password are present
    if (!req.body.email || !req.body.oldpassword || !req.body.newpassword) {
        res.status(400);
        res.send("Change Personal Information failed, missing email or password");
        
        return;
    }

    //callback on validate password, this function gets called after comparing passwords
    const validatePassword = (err, valid) => {
        if (err) {
            res.status(500);
            res.send("Change Personal Information failed, something went wrong");
        }
        // login successful
        if (valid) {
            

            console.log("Password match successful");

            res.status(200);
            
            if (
                !req.body.email ||
                !req.body.oldpassword ||
                !req.body.firstName ||
                !req.body.lastName ||
                !req.body.phoneNumber ||
                !req.body.newpassword
            ) {
                res.status(400);
                res.send("Change Personal Information failed, missing fields");
                console.log("yes")
                return;
            }
        
            //check that password is long enough
            if (passwordStrength(req.body.password).value!="Strong") {
                res.status(400);
                res.send("password too short");
                console.log("password too week");
                return;
            }
        
            const newUser = {
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phoneNumber: req.body.phoneNumber,
                
            }

            //hash the password with 10 salt rounds and add the new user to the database
            bcrypt.hash(req.body.newpassword, 10, (err, hash) => {
        
                newUser.password = hash;
        
                userModel.updateOne({ email: req.body.email }, newUser, (err, result) => {
                    if (err) {
                        console.log("Personal Information was not updated successfully");
                        console.error(err);
                    }})
                        var newid = newUser._id;
                        const payload = {
                            id: newid,
                        };
                        res.send({ token: generateToken(payload) });

        
        
            });
            // generate and send an authorization token
            
        }
        // login failed
        else {
            console.log("Change Personal Information failed failed, wrong password");
            res.status(400);
            res.send("Change Personal Information failed failed - wrong password");
        }

    };

    // callback function to validate account after finding a user from the database
    const validateAccount = (err, docs) => {
        console.log(docs);
        if (docs.length === 0) {
            res.status(400);
            res.send("Change Personal Information failed failed, no account exists with that email");
            console.log("yes")
            return;
        }
        if (err) {
            res.status(400);
            console.log("Change Personal Information failed failed, something went wrong");
            res.send("Change Personal Information failed failed, something went wrong");
            return;
        }

        user = docs[0];
        bcrypt.compare(req.body.oldpassword, user.password, validatePassword);

    };

    userModel.find({ email: req.body.email }, validateAccount);


}

module.exports.getUser = getUser;
module.exports.login = login;
module.exports.addUser = addUser;
module.exports.updateBillerInfo = updateBillerInfo;
module.exports.editUser = editUser;
module.exports.adminlogin = adminlogin;
module.exports.addvoucher=addvoucher;
module.exports.getall=getall;
module.exports.updatevoucher=updatevoucher;