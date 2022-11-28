const mongoose = require("mongoose");
const item = require("../../Model/item");
const ItemModel = require("../../Model/item");

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

exports.getHome = (req, res) => {
  res.render("Home", {
    title_page: "Common Mart",
    path:'/'
  });
};

exports.getForm = (req, res) => {
  res.render("Admin/AddItem", {
    title_page: "Item Page",
    path: '/itemform'
  });
};

exports.postFormValue = (req, res) => {
  // console.log("Collected values: ", req.body);
  let item_Title = convert(req.body.itemTitle);
  let company = convert(req.body.company);
  const item_Price = req.body.itemPrice;
  const item_Desc = convert(req.body.itemDesc);
  const item_img = req.file;
  const item_img_url = item_img.path;

  let ItemData = new ItemModel({
    item_title: item_Title,
    company: company,
    item_price: item_Price,
    item_desc: item_Desc,
    item_img: item_img_url,
  });
  ItemData.save()
    .then((res) => {
      console.log("Product is saved");
    })
    .catch((err) => {
      console.log("Error at saving data", err);
    });

  res.redirect("/displayitems");
  res.end();
};

exports.getItems = (req, res) => {
  ItemModel.find({})
    .then((items) => {
      // console.log(items);
      res.render("Admin/ViewItems", {
        title_page: "Item Details",
        path: '/displayitems',
        data: items,
      });
    })
    .catch((err) => {
      console.log("Item not fetched", err);
    });
};

exports.searchItems = (req, res) => {
  const searched = convert(req.body.searched);
  ItemModel.find({
    $or: [
      { item_title: { $regex: searched } },
      { company: { $regex: searched } },
      { item_desc: { $regex: searched } },
    ],
  })
    .then((items) => {
      res.render("Admin/ViewItems", {
        title_page: "Item Details",
        searched: searched,
        data: items,
      });
    })
    .catch((err) => {
      console.log("Item not fetched", err);
    });
};
// exports.searchItems = (req, res) => {
//   const searched = convert(req.body.searched);
//   ItemModel.find({})
//     .then((items) => {
//       items = items.filter((item, index, items) => {
//         const str = `${item.item_title} ${item.company} ${item.item_desc}`;
//         return str.includes(searched);
//       });
//       res.render("Admin/ViewItems", {
//         title_page: "Item Details",
//         searched: searched,
//         data: items,
//       });
//     })
//     .catch((err) => {
//       console.log("Item not fetched", err);
//     });
// };

exports.editItem = (req, res) => {
  const pid = req.params.pid;
  ItemModel.findById(pid)
    .then((item) => {
      // console.log(item);
      res.render("Admin/EditItems", {
        title_page: "Edit Items",
        path: '/edititems/:pid',
        data: item,
      });
    })
    .catch((err) => {
      console.log("Item not fetched", err);
    });
};

exports.postEditFormValue = (req, res) => {
  const item_Title = req.body.itemTitle;
  const company = req.body.company;
  const item_Price = req.body.itemPrice;
  const item_Desc = req.body.itemDesc;
  const item_Id = req.body.itemId;
  const item_Old_Image = req.body.item_Image;
  const item_img = req.file;
  const item_img_url = item_img.path;
  if (item_img_url == "") item_img_url = item_Old_Image;
  ItemModel.findById(item_Id)
    .then((item) => {
      item.item_title = item_Title;
      item.company = company;
      item.item_price = item_Price;
      item.item_desc = item_Desc;
      item.item_img = item_img_url;
      item
        .save()
        .then((res) => {
          console.log("Product is saved");
        })
        .catch((err) => {
          console.log("Error at saving data", err);
        });
    })
    .catch((err) => {
      console.log("Item not fetched", err);
    });

  res.redirect("/displayitems");
  res.end();
};

exports.deleteItem = (req, res) => {
  console.log("Hello");
  const pid = req.params.pid; 
  ItemModel.deleteOne({ _id: new mongoose.Types.ObjectId(pid) })
    .then((res) => {
      console.log("Item is deleted");
    })
    .catch((err) => {
      console.log("Error at deleting data", err);
    });

  res.redirect("/displayitems");
  res.end();
};





