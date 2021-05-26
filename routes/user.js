const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController.js');
const { authenticateToken } = require("../utils/jwtTokens");

router.post('/signup', (req, res) => {
    userController.addUser(req, res);
});


router.post('/login', (req, res) => {
    userController.login(req, res);
});

router.post('/adminlogin', (req, res) => {
    userController.adminlogin(req, res);
});

router.post('/addvoucher', (req, res) => {
    userController.addvoucher(req, res);
});

router.post('/updatevoucher', (req, res) => {
    userController.updatevoucher(req, res);
});

router.post('/getall', (req, res) => {
    userController.getall(req, res);
});
//get a user's information using their provided authentication token
router.get('/get', authenticateToken, (req, res) => {
    userController.getUser(req, res);
});

//update personal
router.post('/edituser', (req, res) => {
    userController.editUser(req, res);
});

//adds biller info if not existing, otherwise updates it with new info
router.post("/updateBillerInfo", (req, res) => {

    userController.updateBillerInfo(req, res);
});


//TODO: update biller and update personal

module.exports = router;