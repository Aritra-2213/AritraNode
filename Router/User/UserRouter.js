const express = require("express");

const form_Router = express.Router();
const itemController = require("../../Controller/User/UserController");
const item = require("../../Model/item");

form_Router.get("/useritem", itemController.getItems);
form_Router.get("/useritem/:pid", itemController.getItem);
form_Router.post("/displayUserItem", itemController.searchItems);
form_Router.get("/sortitem/:order&:title", itemController.sortedSearchItem);
form_Router.get("/sortitem/:order", itemController.sortItem);

form_Router.get("/displayCartPage", itemController.displayCart);
form_Router.post("/addToCart", itemController.postAddToCart);
form_Router.get("/addtocartPage", itemController.getCartItem);
form_Router.get("/deletecartitem/:cart_id", itemController.cartDelete);

module.exports = form_Router;
