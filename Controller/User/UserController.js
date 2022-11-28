const ItemModel = require("../../Model/item");
const CartSchema = require("../../Model/cart");

const convert = (str) => {
  str = str.toLowerCase();
  str = str.replace("-", " ");
  str = str.replace("_", " ");
  str = str.split(" ");
  for (let i = 0; i < str.length; i++) {
    str[i] = str[i].charAt(0).toUpperCase() + str[i].slice(1);
  }
  return str.join(" ");
};

exports.getItems = (req, res) => {
  ItemModel.find()
    .then((items) => {
      res.render("User/DisplayItems", {
        title_page: "Item Details",
        path: '/useritem',
        title: null,
        data: items,
      });
    })
    .catch((err) => {
      console.log("Item not fetched", err);
    });
};

exports.getItem = (req, res) => {
  const pid = req.params.pid;
  ItemModel.findById(pid)
    .then((item) => {
      res.render("User/details", {
        title_page: "Item Details",
        path: '/useritem/:pid',
        data: item,
      });
    })
    .catch((err) => {
      console.log("Item not fetched", err);
    });
};

exports.searchItems = (req, res) => {
  let itemtitle = convert(req.body.itemtitle);

  ItemModel.find({ item_title: { $regex: itemtitle } })
    .then((items) => {
      res.render("User/DisplayItems", {
        title_page: "Item Details",
        searched: null,
        title: itemtitle,
        data: items,
      });
    })
    .catch((err) => {
      console.log("Item not fetched", err);
    });
};

exports.sortItem = (req, res) => {
  const order = req.params.order;
  ItemModel.find({})
    .then((items) => {
      items.sort((a, b) => {
        if (order === "1") {
          return a.item_price - b.item_price;
        } else if (order === "-1") {
          return b.item_price - a.item_price;
        } else {
          return 0;
        }
      });
      res.render("User/DisplayItems", {
        title_page: "Item Details",
        path: '/sortitem/:order',
        title: null,
        data: items,
      });
    })
    .catch((err) => {
      console.log("Item not fetched", err);
    });
};

exports.sortedSearchItem = (req, res) => {
  const order = req.params.order;
  let title = convert(req.params.title);

  ItemModel.find({ item_title: { $regex: title } })
    .then((items) => {
      items.sort((a, b) => {
        if (order === "1") {
          return a.item_price - b.item_price;
        } else if (order === "-1") {
          return b.item_price - a.item_price;
        } else {
          return 0;
        }
      });

      res.render("User/DisplayItems", {
        title_page: "Item Details",
        path: '/sortitem/:order&:title',
        title: title,
        searched: null,
        data: items,
      });
    })
    .catch((err) => {
      console.log("Item not fetched", err);
    });
};






exports.displayCart = (req,res)=>{
  res.render("User/AddToCart",{
    title_page:"Add To Cart Page",
    path:'/displayCartPage'
  })
}



exports.postAddToCart = (req,res) => {
  const pId = req.body.productId;
  const quantity = req.body.quantity;
  const userId = req.user._id;
  // console.log("Collected Data for Cart:", req.body);

  const cartValue=[];
  CartSchema.find({userID:userId, productID:pId})
    .then(cartData=>{
     // console.log("Cart Data:", cartData);
      if(cartData=='')
      {
        ItemModel.findById(pId)
          .then(itemforCart=>{
            console.log("Items for Cart:",itemforCart);
            cartValue.push(itemforCart);
            const cartItem = new CartSchema({productID:pId,quantity:quantity,userID:userId,cart:cartValue});
            cartItem.save()
              .then(results=>{
                console.log("Adding items to the cart done successfully");
                res.redirect('/addtocartPage');
              }).catch(err=>{
                console.log("Error in saving items to the cart:", err);
              })
          }).catch(err=>{
            console.log("Error in finding item in cart:",err);
          })
      }
      else
      {
        cartData[0].quantity = cartData[0].quantity+1;
        cartData[0].save()
          .then(result=>{
            console.log("Items again added into the cart successfully");
            res.end();
          }).catch(err=>{
            console.log("Error has occurred:",err);
          })
      }
    })
}

exports.getCartItem = (req, res) => {
  const uid = req.user._id;
  CartSchema.find({userID:uid})
    .then((item) => {
      // console.log("Fetched Item:", item)
      res.render("User/AddToCart", {
        title_page: "Add To Cart",
        path: '/addtocartPage',
        data: item,
      });
    })
    .catch((err) => {
      console.log("Item not fetched", err);
    });
};

exports.cartDelete = (req,res) =>{
  const cart_id = req.params.cart_id;
  console.log("Item id for Deletion:",cart_id);
  CartSchema.deleteOne({_id:cart_id}).then(cart_result=>{
    // console.log("cart",cart_result);
    res.redirect("/addtocartPage");
    console.log("Product Deleted from the Cart");
  }).catch((err)=>{
    console.log("Error in Deleting Cart Data:",err);
  })
}
