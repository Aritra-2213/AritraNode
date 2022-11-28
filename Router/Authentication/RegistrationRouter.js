const { Router } = require("express");
const express = require("express");
const {check,body} = require("express-validator")

const reg_Router = express.Router();

const regController = require("../../Controller/Authentication/RegistrationController");

reg_Router.get("/displayregis", regController.getReg);
reg_Router.post("/addValue",
  [
    body('firstName','Only Characters').isLength({min:1,max:10}).matches('^[A-Z]{1}[A-Za-z]{1,19}$'),
    body('lastName','$$$').isLength({min:1,max:10}),
    check('email').isEmail().withMessage("Input Valid Email"),
    body('password','Wrong Pattern').isLength({min:8,max:15}),
    body('contact').isLength({min:0,max:10})

  ], 
  regController.postRegFormValue);

reg_Router.get("/displaylogin",regController.getLogin); 
reg_Router.post("/addLoginValue", regController.getLoginValue);

reg_Router.get("/displayforget",regController.getForgetPass); 
reg_Router.post("/addEmailForgotPass", regController.getForgetPassValue);

reg_Router.get("/displaychangepass/:id",regController.getChangePass);
reg_Router.post("/addEmailForgetPass", regController.changePassword);

reg_Router.get("/logout", regController.loggedout);

//Email Verification
reg_Router.get("/confirmation/:email/:token", regController.confirmation);


// =========================================== Cookies Section ===================================================== //

reg_Router.get("/send", regController.sendCookies);
reg_Router.get("/read", regController.readCookies);


module.exports = reg_Router;