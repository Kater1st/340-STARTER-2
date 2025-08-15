const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")
 
const invCont = {}
 
/* ***************************
 *  Build inventory by classification view
 * ************************** */
invCont.buildByClassificationId = async function (req, res, next) {
  const classification_id = req.params.classificationId
  const data = await invModel.getInventoryByClassificationId(classification_id)
  const grid = await utilities.buildClassificationGrid(data)
  let nav = await utilities.getNav()
  res.render("./inventory/classification", {
    title: " vehicles",
    nav,
    grid,
    errors: null,
  })
}
 

/* ***************************
*  Build inventory by vehicle view
* ************************** */
invCont.buildByVehicleId = async function (req, res, next) {
  const vehicle_id = req.params.vehicleId

  const data = await invModel.getVehicleById(vehicle_id)

  let nav = await utilities.getNav(data.vehicle_id)
  const detail = await utilities.buildVehicleDetailHTML(data) 

  res.render("./inventory/detail", {
    title:" vehicles",
    nav,
    detail,
  })
}

invCont.buildManagement = async (req, res, next) =>{
  let nav = await utilities.getNav();
  const classificationSelect = await utilities.buildClassificationList();
  const links = {
    "classification": "/inv/add-classification",
    "inventory": "/inv/add-inventory"
  }
  res.render("inventory/management", {
      title: "Inventory Management",
      nav,
      classificationSelect,
      links    
  });
}

invCont.buildManagementView = async (req, res, next)=>{
  let nav = await utilities.getNav();
  let tools = utilities.getTools(req);
  const classificationSelect = await utilities.buildClassificationList();
  res.render("./inventory/management",{
      nav,
      tools,
      classificationSelect,
      title: "Inventory Management"
  });
}

invCont.buildAddClassification = async (req, res) => {
  const nav = await utilities.getNav()

  res.render("inventory/add-classification", {
    title: "Add new classification",
    nav,
    errors: null,
  })
}

invCont.buildAddInventory = async (req, res) => {
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList()

  res.render("inventory/add-inventory", {
    title: "Add new inventory item",
    nav,
    classificationList,
    errors: null
  })
}



invCont.buildEditInventory = async (req, res) => {
  const nav = await utilities.getNav()
  const vehicle = await invModel.getVehicleById(req.params.inventory_id)
  const classificationList = await utilities.buildClassificationList(vehicle.classification_id)
  res.render("inventory/edit-inventory", {
    title: "Edit inventory item",
    nav,
    classificationList,
    errors: null,
    vehicle
  })
}

invCont.editVehicle = async (req, res) => {
  const {inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail,
    inv_miles, inv_color, inv_price, classification_id, inv_id} = req.body;
  const saveResult = await invModel.editInventory (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail,
    inv_price,inv_miles, inv_color, inv_id)
 
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList(req.body.classification_id)
 
  const vars = {
    title: "edit inventory item",
    nav,
    classificationList,
    errors: null,
    formData: req.body
  }
 
  if (saveResult) {
    req.flash(
      "notice",
      `Congratulations, a new inventory item -
      ${req.body.inv_make} ${req.body.inv_model} was successfully saved.`
    )
    res.status(201).render("inventory/newVehicle", vars)
  } else {
    req.flash("notice",
      `Sorry, an inventory item - ${req.body.inv_make} ${req.body.inv_model} was not saved.`)
    res.status(501).render("inventory/newVehicle", vars)
  }
}




invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body
  const saveResult = await invModel.addClassification(classification_name)
  let nav = await utilities.getNav();
  if (saveResult){
   
    req.flash("success", `Classification ${classification_name} was successfully added.`);
    res.status(201).render("inventory/management",{
        title: "Inventory Management",
        nav,
        classificationSelect,
        errors: null
    });
}else{
 
  req.flash("notice",`Sorry, something went wrong adding ${classification_name}.`)
  res.status(501).render("inventory/newClassification",{
      nav,
      title: "Add New Classification",
      errors: null,
      classification_name
  })
}
}

// invCont.addInventory = async (req, res) => {
//   const saveResult = await invModel.saveInventory(req.body)
//   const nav = await utilities.getNav()
//   const classificationList = await utilities.buildClassificationList(req.body.classification_id)

//   const vars = {
//     title: "Add new inventory item",
//     nav,
//     classificationList,
//     errors: null,
//     formData: req.body
//   }

//   if (saveResult) {
//     req.flash(
//       "notice",
//       `Congratulations, a new inventory item - 
//       ${req.body.inv_make} ${req.body.inv_model} was successfully saved.`
//     )
//     res.status(201).render("inventory/add-inventory", vars)
//   } else {
//     req.flash("notice",
//       `Sorry, an inventory item - ${req.body.inv_make} ${req.body.inv_model} was not saved.`)
//     res.status(501).render("inventory/add-inventory", vars)
//   }
// }


invCont.addClassification = async function (req, res, next) {
  const { classification_name } = req.body
  const saveResult = await invModel.addClassification(classification_name)
  let nav = await utilities.getNav();
  if (saveResult){
   
    req.flash("success", `Classification ${classification_name} was successfully added.`);
    res.status(201).render("inventory/management",{
        nav,
       
        title: "Inventory Management",
        errors: null
    });
}else{
 
  req.flash("notice",`Sorry, something went wrong adding ${classification_name}.`)
  res.status(501).render("inventory/newClassification",{
      nav,
      title: "Add New Classification",
      errors: null,
      classification_name
  })
}
}

// ADD NEW VEHICLE

invCont.addNewVehicle = async (req, res) => {
  const {inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail,
    inv_miles, inv_color, inv_price, classification_id} = req.body;
  const saveResult = await invModel.addInventory (classification_id, inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail,
    inv_price,inv_miles, inv_color)
 
  const nav = await utilities.getNav()
  const classificationList = await utilities.buildClassificationList(req.body.classification_id)
 
  const vars = {
    title: "Add new inventory item",
    nav,
    classificationList,
    errors: null,
    formData: req.body
  }
 
  if (saveResult) {
    req.flash(
      "notice",
      `Congratulations, a new inventory item -
      ${req.body.inv_make} ${req.body.inv_model} was successfully saved.`
    )
    res.status(201).render("inventory/newVehicle", vars)
  } else {
    req.flash("notice",
      `Sorry, an inventory item - ${req.body.inv_make} ${req.body.inv_model} was not saved.`)
    res.status(501).render("inventory/newVehicle", vars)
  }
}


/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
  const classification_id = parseInt(req.params.classification_id)
  const invData = await invModel.getInventoryByClassificationId(classification_id)
  if (invData[0].inv_id) {
    return res.json(invData)
  } else {
    next(new Error("No data returned"))
  }
}


/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.buildDeleteInventory = async (req, res, next) =>{
  const inv_id = req.params.inv_id;
  let nav = await utilities.getNav();
  // let tools = utilities.getTools(req);
  const itemData = await invModel.getInventoryDetailsById(inv_id);
  const itemName = `${itemData[0].inv_make} ${itemData[0].inv_model}`;
  res.render("./inventory/deleteInventory",{
      title: "Delete "+itemName,
      nav,
      // tools,
      errors: null,
      inv_id: itemData[0].inv_id,
      inv_make: itemData[0].inv_make,
      inv_model: itemData[0].inv_model,
      inv_year: itemData[0].inv_year,
      inv_price: itemData[0].inv_price
  });
}

/* ***************************
 *  Delete an inventory item
 * ************************** */
invCont.deleteInventory = async (req, res, next) =>{
  const {inv_id, inv_make, inv_model, inv_year, inv_price} = req.body;
  const modelResult = await invModel.deleteVehicle(inv_id);

  if (modelResult){
      req.flash("success", `Vehicle ${inv_model} was successfully deleted.`);
      res.redirect("/inv/management");
  }
  else{
      let nav = await utilities.getNav();
      // let tools = utilities.getTools(req);
      const itemName = inv
      req.flash("notice",`Sorry, something went wrong deleting ${inv_model}.`)
      res.status(501).render("inventory/deleteInventory",{
          nav,
          // tools,
          title: `Delete ${itemName}`,
          errors: null,
          inv_id,
          inv_make, 
          inv_model, 
          inv_year, 
          inv_price
      });
  }
}



// SPARE SECTION
invCont.buildSpares = async (req, res, next) =>{
  try {
    let nav = await utilities.getNav();
    const itemData = await invModel.getSpareById(spare_name);
      res.render("./inventory/spare", { title: "Car Spares",
        nav,
        errors: null,
        spare_id: itemData[0].spare_id,
        spare_name: itemData[0].spare_name,
        inventory_id: itemData[0].inventory_id });
  } catch (error) {
      res.status(500).send('Server error');
  }
};



// invCont.buildSparesView = async (req, res, next) =>{
//   let nav = await utilities.getNav();
//   res.render("/inventory/spare",{
//       nav,
//       title: "Spares Management"
//   });
// }



module.exports = invCont