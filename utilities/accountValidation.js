const utilities = require(".")
const { body, validationResult } = require("express-validator")
const validate = {}
const jwt = require('jsonwebtoken')

/*  **********************************
  *  Login Data Validation Rules
  * ********************************* */
validate.loginRules = () => {
    return [
      // valid email is required and cannot already exist in the DB
      body("account_email")
        .trim()
        .escape()
        .notEmpty()
        .isEmail()
        .normalizeEmail()
        .withMessage("A valid email is required."),
  
      // password is required
      body("account_password")
        .trim()
        .notEmpty()
        .withMessage("Password is required."),
    ]
  }

  validate.checkLoginData = async (req, res, next) =>{
    const {account_email} = req.body;
    let  errors = [];
    errors = validationResult(req);
    if(!errors.isEmpty()){
        let nav = await utilities.getNav();
        res.render("account/login",{
            errors,
            title: "Login",
            nav,
            account_email
        })
        return;
    }
    else{
        next();
    }
  }

  module.exports = validate