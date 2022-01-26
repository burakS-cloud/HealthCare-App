if(process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');
const Doctor = require('./models/doctor');
const Secretary = require('./models/secretary');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const userRoutes = require('./routes/users');
const doctorRoutes = require('./routes/doctors');
const MongoDBStore = require('connect-mongo')(session);

//'mongodb://localhost:27017/hospital'
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/hospital';
mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'))

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize());
app.use(helmet({contentSecurityPolicy:false}));

const secret = process.env.SECRET || 'thisshouldbeabettersecret!';

const store = new MongoDBStore({
    url: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60
});

store.on("error", function(e){
    console.log("SESSION STORE ERROR", e);
})

const sessionConfig = {
    store,
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

app.use(session(sessionConfig))
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use('doctor', new LocalStrategy(Doctor.authenticate()));
passport.use('secretary', new LocalStrategy(Secretary.authenticate()));
passport.use('user', new LocalStrategy(User.authenticate()));


  function PrincipleInfo(principleId, principleType, details) {
    this.principleId = principleId;
    this.principleType = principleType;
    this.details = details;
}

passport.serializeUser(function (Doctor, done) {
    //userObjectThing could be a User or a Sponsor
    var principleType = "doctor";
    var userPrototype =  Object.getPrototypeOf(Doctor);
    //console.log(userPrototype === User.prototype);
    //console.log("\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n\n");
    //console.log("User.prototype value to check what's inside the first if", User.prototype);
    if (userPrototype === User.prototype) {
        principleType = "user";
    } else if (userPrototype === Doctor.prototype) {
        principleType = "doctor";
    } else if (userPrototype === Secretary.prototype) {
        principleType = "secretary";
    }
    //console.log(principleType);

    var principleInfo = new PrincipleInfo(Doctor._id, principleType, '');
    done(null,principleInfo);
});

    passport.deserializeUser(function (principleInfo, done) {
        //console.log("Principle info object:",principleInfo);
        //console.log("PrincipleType value:", principleInfo.principleType);
        //console.log(typeof(principleType));
        if (principleInfo.principleType == 'user') {
            User.findOne({
                _id: principleInfo.principleId
            }, '-salt -hashedPassword', function (err, user) { // don't ever give out the password or salt
                done(err, user);
            });
        } else if (principleInfo.principleType == 'doctor') {
            Doctor.findOne({
                _id: principleInfo.principleId
            }, '-salt -hashedPassword', function (err, user) { // don't ever give out the password or salt
                done(err, user);
            });
        } else if (principleInfo.principleType == 'secretary') {
            Secretary.findOne({
                _id: principleInfo.principleId
            }, '-salt -hashedPassword', function (err, user) { // don't ever give out the password or salt
                done(err, user);
            });
        }

    });

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
})


app.use('/users', userRoutes);
app.use('/doctors', doctorRoutes);


app.get('/', async (req, res) => {
    const doctors = await Doctor.find({});
    res.render('home', { doctors });
    
});


app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh No, Something Went Wrong!'
    res.status(statusCode).render('error', { err })
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Serving on port ${port}`);
})


