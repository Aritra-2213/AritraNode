// const mongoose  = require("mongoose");
const item = require("../../Model/Registration");
const Registration = require("../../Model/Registration");
const bcrypt = require("bcryptjs");
const {validationResult} = require("express-validator")
const nodemailer = require("nodemailer");
const jwt = require("jsonwebtoken");

//This is the mail service portion. For example, when user wants to change password then the mail which the user receives./ 
const transporter = nodemailer.createTransport({
  host: 'smtp',
  port: 1200,
  secure: false,
  requireTLS: true,
  service: 'gmail',
  auth: {
    user: 'aritraghosh2213@gmail.com',
    pass: 'rvhkxkywmkegirgc'
  }
})


exports.getReg = (req,res)=>{
  let regmsg = req.flash("regerror");

  if(regmsg.length>0)
  {
    regmsg = regmsg[0];
  }else
  {
    regmsg = null;
  }
  res.render("Authentication/Registration", {
    title_page: "Registration Form",
    path: '/displayregis',
    errmsg: regmsg,
    error_valid: [], 
  });
}
  
exports.postRegFormValue = (req,res)=>{
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const emailID = req.body.email;
  const password = req.body.password;
  const contact = req.body.contact;
    
  // console.log("Data Received:", req.body);
  let error_valid = validationResult(req);
  if(!error_valid.isEmpty())
  {
    errorResponse = validationResult(req).array();

    res.render("Authentication/Registration", {
      title_page: "Registration Form",
      path: '/displayregis',
      errmsg: "",
      error_valid: errorResponse, 
    })
  }
  else{
    Registration.findOne({ reg_emailID: emailID})
    .then((userValue) => {
      if(userValue)
      {
        req.flash("regerror","Error:: Email exist for Registration");
        console.log("Email exist for registration")
        // console.log(userValue);
        return res.redirect("/displayregis");
      }
      return bcrypt
        .hash(password, 12)
        .then((hashPassword) => {
          const userData = new Registration({
            reg_firstName:firstName,
            reg_lastName: lastName,
            reg_emailID: emailID,
            reg_contact: contact,
            reg_password: hashPassword,
          });

          return userData.save()
            .then((results) => {
              console.log("Registration Done",results);
              const token= jwt.sign({email:req.body.email},"secretkey1234567890@aritra1234567890@@aritra1234567890@@@aritra1234567890", {expiresIn:'1h'})

                let mailOptions = {
                  from: 'aritraghosh2213@gmail.com',
                  to: results.reg_emailID,
                  subject: 'Registration Done',
                  text: 'Hello ' + results.reg_firstName+ ',\n\n' + 
                  'You have Successfully Registered.To verify account click below' + '\n\nhttp:\/\/' + req.headers.host+
                  '\/confirmation\/'+results.reg_emailID+'\/'+token
                }
                transporter.sendMail(mailOptions, function(error, info)
                {
                  if(error)
                  {
                    console.log("Error to send mail", error);
                    req.flash("")
                    res.redirect("/displayregis");
                  }
                  else{
                    console.log("Email sent: ", info.response);
                    req.flash('msg','Check your mail');
                    res.redirect("/displayregis");
                  }
                })
            })
             // return res.redirect("/displaylogin");
            
            .catch((err) => {
              console.log("Registration Error:",err)
            });
        })
        .catch((err) => {
          console.log("Hashing Error:",err);
        })
    })
  }
  
  
}

// ===================================== Login Section ======================================

exports.getLogin = (req,res) => {
  let msg = req.flash("error"); //Flash collecting error message and stores it in an array

  if(msg.length>0){ //If length of the message is greater than one
    message = msg[0]; //Storing the message in the message variable
  }else{
    message = null; //If the length is zero then null value is stored in the variable
  }
  console.log("Cookies data:",req.cookies);
  res.render("Authentication/Login", {
      title_page: "Login Form",
      path: '/displaylogin',
      errorMsg: message, //After storing the message in the variable , message is displayed
      cookie_data: req.cookies
  })
}

exports.getLoginValue= (req,res) => {
  const emailID = req.body.emailLogin;
  const password = req.body.passLogin;
  // console.log("Login Data Collected:", req.body);

  Registration.findOne({reg_emailID:emailID})
    .then(userValue => {
      // console.log("\nUservalue after login: ",userValue)
      if(!userValue)
      {
        req.flash("error","Error:: Invalid Email for Login");
        console.log("Invalid Email for login");
        return res.redirect("/displaylogin")
      }
      bcrypt.compare(password,userValue.reg_password)
        .then(result => {
          //  console.log("Password comparison:",result)
          if(!result)
          {
            // req.flash("error", "Error:: Invalid Password");
            req.flash("error","Error:: Invalid Password");
            console.log("Invalid Password")
            return res.redirect("/displaylogin");
          }
          else
          {
            console.log("Valid Password " );
            req.session.isLoggedIn = true;
            // isLoggedIn is a User Defined variable in the session to check user is logged in or not
            req.session.user = userValue;
            // User is a variable in session to store logged in user value
            return req.session.save((err) => {
              if(err){
                console.log("Session saving error", err);
              }
              else{
                console.log("Logged In successful");
                return res.redirect("/");
              }
            })
            // return res.redirect("/displayitems")
          }
        }).catch(err=>{
          console.log("Error to Compare",err);
          return res.redirect("/displaylogin");
        })
    }).catch(err => {
        console.log("Error to find Email:",err);
    })
}



// ========================================= Log Out =======================================

exports.loggedout = (req,res) => {
  console.log("LogOut Successful")
  res.redirect("/");
  req.session.destroy();
}


//========================================== Message Email Section ====================================================



exports.getForgetPass = (req,res) => {
  res.render("Authentication/ForgotPass", {
    title_page: "Forgot Password Form",
    path: '/displayforget',
  });
}

exports.getForgetPassValue= (req,res) => {
  const ForgotemailID = req.body.emailForgot;
  Registration.findOne({reg_emailID:ForgotemailID})
  .then(userValue => {
    // console.log("\nUservalue after login: ",userValue)
    if(!userValue)
    {
      req.flash("error","Error:: Please Provide valid email");
      console.log("Invalid Email for changing password");
      return res.redirect("/displaylogin");
    }
    else{
      console.log("Valid email")
      let mailOptions = {
        from: 'aritraghosh2213@gmail.com',
        to: userValue.reg_emailID,
        subject: 'Forgot Password',
        text: 'Hello ' + userValue.reg_firstName+ ',\n\n' + 
        'Mail for Changing Password'
      }
      transporter.sendMail(mailOptions,function(error,info){
        if(error)
        {
          console.log("Error to send mail")
        }
        else
        {
          console.log("Mail sent")
        }
      })
    }
  })
}





//============================================================ Change Password ============================================================

exports.getChangePass = (req,res) => {
  res.render("Authentication/ChangePass", {
    title_page: "Change Password",
    path: '/displaychangepass'
  })
}


exports.changePassword = (req,rea) => {
  const newpass = req.body.newPassword;
  // const item_Id = req.body.itemId;

  console.log("New Password for update:", req.body);
}





exports.confirmation = (req,res) => {
  let email = req.params.email;
  let token = req.params.token;
  // console.log("Collected Data:", email, token);
  TokenModel.findOne({token:token})
  .then((results) => {
    console.log("Result of findone token:", results);
    if(!results)
    {
      console.log("Verification Link may be expired");
    }
    else
    {
      
    }
  })
}



// ============================================================= Cookies Section ============================================================ //

//Sending Cookies
exports.sendCookies = (req,res) => {
  res.cookie("name","aritra", {maxAge:86400, httpOnly: true});
  res.send("Cookie sent!");
}

// Reading Cookies
exports.readCookies = (req,res) => {
  const name=req.cookies.name;
   if(name){
    return res.send(name)
  }
  return res.send("no cookies found");
}