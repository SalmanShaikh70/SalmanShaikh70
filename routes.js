let express = require("express");
let routes = express.Router();
let user = require("./controller/user")
let product = require("./controller/product")
let auth = require("./controller/authController")
let authMid = require("./middleware/authMiddleware")
let dashboard = require("./controller/dashboard")
let category = require("./controller/category")

// user auth routes
routes.get('/',auth.index);
routes.get('/login',auth.index)
routes.post('/register',auth.register);
routes.post('/login',auth.login);

routes.get('/dashboard',authMid.auth('user'), dashboard.index)

//product routes
routes.get('/product/create',authMid.auth('product_create'),product.addUI);
routes.post('/product/create',authMid.auth('product_create'),product.add);
routes.get('/product/',authMid.auth('product_view'),product.viewAll);
routes.get("/product/:id",authMid.auth('product_view'),product.viewDetail)
routes.get("/product/update/:id",authMid.auth('product_update'),product.updateUI);
routes.post("/product/:id",authMid.auth('product_update'),product.update);
routes.post("/product/delete/:id",authMid.auth('product_delete'),product.pDelete);
routes.post("/product/restore/:id",authMid.auth('product_restore'),product.pRestore)

//mailer routes
routes.get("/forget",auth.forgetPassUi)
routes.post("/forget",auth.forgetPass)

// category routes
routes.get("/category/create",authMid.auth("category_create"),category.createUi)
routes.post("/category/create",authMid.auth("category_create"),category.create)
routes.get("/category",authMid.auth("category_view"),category.viewAll)
routes.get("/category/:id",authMid.auth("category_view"),category.viewDetail)
routes.get("/category/update/:id",authMid.auth("category_update"),category.updateUI)
routes.post("/category/:id",authMid.auth("category_update"),category.update)
routes.post("/category/delete/:id",authMid.auth("category_delete"),category.cDelete)
routes.post("/category/restore/:id",authMid.auth("category_restore"),category.cRestore)

module.exports = {routes}