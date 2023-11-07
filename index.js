let express = require("express");
let config = require("config");
let port = config.get('port');
let app = express()
let session = require("express-session")
let {routes} = require("./routes")

app.use(express.json())
app.use(express.urlencoded({extended : true}))
app.use(session({
    secret : "*&12za#"
}))
app.use(express.static(__dirname + '/public'));
app.set("view engine","ejs");
app.use(routes)

app.listen(port,()=>{
    console.log("active",port);
})


 
