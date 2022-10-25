const express = require('express');
// const bodyParser = require('body-parser')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const path = require('path')
// const exphbs  = require('express-handlebars')
const errorController = require('./controllers/error')
const mongoConnect = require('./util/database').mongoConnect;
const User = require('./models/user')

const app = express();

app.set('view engine', 'ejs')

app.set('views', 'views')

// app.use(bodyParser.urlencoded({extended: false}))
app.use(express.urlencoded({extended: false}))

app.use(express.static(path.join(__dirname,'public')));

app.use((req,res,next)=>{
    User.findByPk('635774ded268c1a4f34d1195')
        .then(user=>{
            req.user = new User(user.name, user.email, user.cart, user._id);
            // req.user = user;
            next();
        })
    .catch(err=>console.log(err));
})
app.use('/admin',adminRoutes)

app.use(shopRoutes);

app.use(errorController.get404)

mongoConnect(()=>{
    // if()
    app.listen(3001)
})