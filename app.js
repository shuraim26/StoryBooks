//Import modules
const express=require("express");
const mongoose=require("mongoose");
const passport=require("passport");
const cookieParser=require("cookie-parser");
const session=require("express-session");
const exphbs=require("express-handlebars");
const path=require("path");
const bodyParser=require("body-parser");
const methodOverride=require("method-override");

//Load keys
const keys=require("./config/keys");

//Handlebars helpers
const {
    truncate,
    stripTags,
    formatDate,
    select,
    editIcon
}=require("./helpers/hbs");

//Load user model
require("./models/User");

//Load stories model
require("./models/Story");

//Passport config
require("./config/passport")(passport);

//Mongoose connect
mongoose.connect(keys.mongoURI,{
    useNewUrlParser: true
})
.then(function(){
    console.log("MongoDB Connected!");
})
.catch(function(err){
    console.log("Error in Connection with MongoDB!");
});

//Load routes
const auth=require("./routes/auth");
const index=require("./routes/index");
const stories=require("./routes/stories");

const app=express();

//Handlebars middleware
app.engine('handlebars', exphbs({
    helpers:{
        truncate:truncate,
        stripTags:stripTags,
        formatDate:formatDate,
        select:select,
        editIcon:editIcon
    },
    defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Mthod-override middleware
app.use(methodOverride("_method"));

//Cookie-parser middleware
app.use(cookieParser());

//Express-session middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

//Body-parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Map global promises
mongoose.Promise = global.Promise;

//Set global vars
app.use((req,res,next) => {
    res.locals.user=req.user || null;
    next();
});

//Use routes
app.use("/auth",auth);
app.use("/",index);
app.use("/stories",stories);

//Set static folder
app.use(express.static(path.join(__dirname,"public")));

const port=process.env.PORT || 5000;

app.listen(port,() => {
    console.log("Server started on port "+port);
});
