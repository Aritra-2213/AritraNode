const express = require("express");

const form_Router = express.Router();

const itemController = require("../../Controller/Admin/AdminController");

form_Router.get("/", itemController.getHome);
form_Router.get("/itemform", itemController.getForm);
form_Router.post("/postValue", itemController.postFormValue);
form_Router.get("/displayitems", itemController.getItems);
form_Router.post("/display", itemController.searchItems);
form_Router.get("/edititems/:pid", itemController.editItem);
form_Router.post("/editValue", itemController.postEditFormValue);
form_Router.get("/deleteitems/:pid", itemController.deleteItem);







module.exports = form_Router;
