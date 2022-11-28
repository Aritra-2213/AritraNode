const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const multer = require("multer");
const session = require("express-session");
const mongodb_session = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const csurf = require("csurf");
const cookieParser = require("cookie-parser");


const adminRouting = require("./Router/Admin/AdminRouter");
const userRouting = require("./Router/User/UserRouter");
const regRouting = require("./Router/Authentication/RegistrationRouter");
const Registration = require("./Model/Registration");

const appServer = express();
// const csurfProtection = csurf();

const dbUrl =
  "mongodb+srv://aritro_webskitters:1234a5678@cluster0.ugjprtw.mongodb.net/CommonMart?retryWrites=true&w=majority";


  
//To store the data in mongodb session collection
const session_store = new mongodb_session({
  uri:"mongodb+srv://aritro_webskitters:1234a5678@cluster0.ugjprtw.mongodb.net/CommonMart",
  collection:"user-session"
})


//Session is function here. To stop resaving, resave value false to stop storing uninitialized value, saveUninitialize
appServer.use(
  session({
    secret:'secret-key',
    resave:false,
    saveUninitialized:false,
    store:session_store
  })
)

appServer.use(express.static(path.join(__dirname, "Public")));

// Multer
appServer.use(
  "/uploadedImage",
  express.static(path.join(__dirname, "uploadedImage")) // to store images
);

//to use the images folder after adding it to database. 
//Multer gives the option of storing files either in memory (multer.memoryStorage) or to disk (memory.diskStorage). 
//destination is used to tell Multer where to upload the files, 
//and filename is used to name the file within the destination.

const fileStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    callback(null, "uploadedImage");
  },
  filename: (req, file, callback) => {
    callback(null, file.originalname);
  },
});

const fileFilter = (req, file, callback) => {
  if (
    file.mimetype.includes("png") ||
    file.mimetype.includes("jpg") ||
    file.mimetype.includes("jpeg")
  ) {
    callback(null, true);
  } else {
    callback(null, false);
  }
};

appServer.use(
  multer({
    storage: fileStorage,
    fileFilter: fileFilter,
    limits: { fieldSize: 1024 * 1024 * 5 },
  }).single("itemImage")
);

appServer.set("view engine", "ejs");
appServer.set("views", "View");
appServer.use(express.urlencoded());
appServer.use(flash());
appServer.use(cookieParser());

appServer.use((req,res,next) => {
  if(!req.session.user)
  {
    return next();
  }
  Registration.findById(req.session.user._id)
  .then(userValue=>{
    req.user = userValue;
    // console.log("User Details: ", req.user)
    next();
  }).catch(err => {
    console.log("User Not Found", err)
  });
});

// appServer.use(csurfProtection); //Always after cookie parser and session


// Authentication
appServer.use((req,res,next)=>{
  res.locals.isAuthenticated=req.session.isLoggedIn;
  // res.locals.csrf_token = req.csrfToken();
  next();
})


appServer.use(adminRouting);
appServer.use(userRouting);
appServer.use(regRouting);

appServer.use(function(req,res){
  res.render('Common/PNF', {
    title_page: "error",
    status: 404,
    url: req.url,
    path: ''
  });
});

mongoose
  .connect(dbUrl)
  .then((result) => {
    // console.log(result);
    appServer.listen(1900, () => {
      console.log("Server Connected");
    });
  })
  .catch((err) => {
    console.log("Error is occured", err);
  });
