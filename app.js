const express = require('express');
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const session = require('express-session')
var MongoDBStore = require('connect-mongodb-session')(session);


const path = require('path')
const errorController = require('./controllers/error')
const User = require('./models/user')

const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const authRoutes = require('./routes/auth')

const MONGODB_URI = 'mongodb+srv://thong0506:thong0506@cluster0.nrohf5r.mongodb.net/shops?retryWrites=true&w=majority';
const app = express();
const store = new MongoDBStore({
    uri : MONGODB_URI,
    collection: 'sessions',
});

app.set('view engine', 'ejs')

app.set('views', 'views')

app.use(bodyParser.urlencoded({extended: false}))
// app.use(express.urlencoded({extended: false}))

app.use(express.static(path.join(__dirname,'public')));
app.use(session({secret:'my secret',resave: false, saveUninitialized: false, store: store}))

app.use((req,res,next)=>{
    if(!req.session.user){
        return next();
    }
    User.findById(req.session.user._id)
        .then(user=>{
            
            // user here is a full mongoose object
            // req.user = new User({name :user.name, email: user.email,cart : user.cart,_id: user._id});
            req.user = user;
            next();
        })
    .catch(err=>console.log(err));
})
app.use('/admin',adminRoutes)

app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404)

mongoose.connect(MONGODB_URI)
.then(result =>{
    User.findOne().then(user =>{
        if(!user){
            const user = new User({
            name : " THong",
            email: "huuthong@gmail.com",
            cart : {
                items: []
            }
        })
        user.save();
        }
    })
    
    app.listen(3001)
})
.catch(err => console.log(err))