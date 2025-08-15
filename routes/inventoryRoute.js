// Needed Resources 
const express = require("express")
const router = new express.Router() 
const invController = require("../controllers/invController")
const validate = require("../utilities/inventoryValidation")
const utilities = require("../utilities/");

// Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

router.get("/detail/:vehicleId", utilities.handleErrors(invController.buildByVehicleId));

router.get("/management", utilities.handleErrors(invController.buildManagement))

router.get("/add-classification", utilities.handleErrors(invController.buildAddClassification))
router.post('/add-classification', validate.classificationRules(), utilities.handleErrors(invController.addClassification))

router.get("/add-inventory", utilities.handleErrors(invController.buildAddInventory))
router.post('/add-inventory',
    validate.inventoryRules(),
    utilities.handleErrors(validate.checkInventory),
    utilities.handleErrors(invController.addNewVehicle))

router.get("/getInventory/:classification_id", utilities.handleErrors(invController.getInventoryJSON))

router.get("/edit/:inventory_id", utilities.handleErrors(invController.buildEditInventory));
router.post("/edit-inventory", 
    validate.inventoryRules(),
    utilities.handleErrors(validate.checkInventory),
    utilities.handleErrors(invController.editVehicle));

    

router.get("/delete/:inventory_id",  utilities.handleErrors(invController.buildDeleteInventory));
//Route to delete an inventory item
router.post("/delete", utilities.handleErrors(invController.deleteInventory))



// w6 spare
router.get("/spare", utilities.handleErrors(invController.buildSpares))


module.exports = router;


