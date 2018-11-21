//Import modules
const express=require("express");
const mongoose=require("mongoose");
const passport=require("passport");
const cookieParser=require("cookie-parser");
const session=require("express-session");
const exphbs=require("express-handlebars");

//Load keys
const keys=require("./config/keys");

//Load user model
require("./models/User");

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

const app=express();

//Handlebars middleware
app.engine('handlebars', exphbs({defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

//Cookie-parser middleware
app.use(cookieParser());

//Express-session middleware
app.use(session({
    secret: 'secret',
    resave: false,
    saveUninitialized: false
}));

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

const port=process.env.PORT || 5000;

app.listen(port,() => {
    console.log("Server started on port "+port);
});
