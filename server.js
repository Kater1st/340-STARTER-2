/* ******************************************
 * This server.js file is the primary file of the 
 * application. It is used to control the project.
 *******************************************/

/* ***********************
 * Require Statements
 *************************/
require("dotenv").config(); // Load environment variables first
const session = require("express-session");
const expressLayouts = require("express-ejs-layouts");
const pool = require("./database/");
const express = require("express");
const baseController = require("./controllers/baseController");
const utilities = require("./utilities/index");
const inventoryRoute = require("./routes/inventoryRoute");
const accountRoute = require("./routes/accountRoute");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const staticRoutes = require("./routes/static");
const flash = require("connect-flash");
const messages = require("express-messages");

const app = express();


// ------------------------
// Routes
// ------------------------

const inventoryRoutes = require("./routes/inventoryRoute")// Inventory management
const accountRoutes = require("./routes/accountRoute")    // User account management

/* ***********************
 * Basic Config
 *************************/
app.set("view engine", "ejs");
app.use(expressLayouts);
app.set("layout", "./layouts/layout"); // not at views root
app.use(express.static("public"));
app.use("/inv", inventoryRoute)

/* ***********************
 * Session Configuration
 *************************/
if (!process.env.SESSION_SECRET) {
  console.error("❌ SESSION_SECRET is missing in .env file");
  process.exit(1);
}

app.use(
  session({
    store: new (require("connect-pg-simple")(session))({
      createTableIfMissing: true,
      pool,
    }),
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    name: "sessionId",
    cookie: {
      secure: false, // set to true in production with HTTPS
      maxAge: 1000 * 60 * 60 * 2, // 2 hours
    },
  })
);

app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(utilities.checkJWTToken);

/* ***********************
 * Express Messages Middleware
 *************************/
app.use(flash());
app.use(function (req, res, next) {
  res.locals.messages = messages(req, res);
  next();
});

/* ***********************
 * Navigation for all views
 *************************/
app.use(async (req, res, next) => {
  res.locals.nav = await utilities.getNav();
  next();
});

/* ***********************
 * Routes
 *************************/
app.get("/", utilities.handleErrors(baseController.buildHome));
app.use("/inv", inventoryRoute);
app.use("/account", accountRoute);
app.use(staticRoutes);

// File Not Found Route
app.use(async (req, res, next) => {
  next({ status: 404, message: "Sorry, we appear to have lost that page." });
});

/* ***********************
 * Error Handler
 *************************/
app.use(async (err, req, res, next) => {
  let nav = await utilities.getNav();
  console.error(`Error at: "${req.originalUrl}": ${err.message}`);
  const message =
    err.status == 404
      ? err.message
      : "Oh no! There was a crash. Maybe try a different route?";
  res.status(err.status || 500).render("errors/error", {
    title: err.status || "Server Error",
    message,
    nav,
  });
});

/* ***********************
 * Start Server After DB Test
 *************************/
(async () => {
  try {
    await pool.query("SELECT NOW()");
    console.log("✅ Database connected successfully");

    const port = process.env.PORT || 5500;
    const host = process.env.HOST || "localhost";

    app.listen(port, () => {
      console.log(`🚀 app listening on ${host}:${port}`);
    });
  } catch (err) {
    console.error("❌ Database connection failed:", err.message);
    process.exit(1);
  }
})();


