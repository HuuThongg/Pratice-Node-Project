const express = require('express');
// const bodyParser = require('body-parser')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const path = require('path')
// const exphbs  = require('express-handlebars')
const errorController = require('./controllers/error')
const sequelize = require('./util/database')
const Product= require('./models/products')
const User= require('./models/user')
const Cart = require('./models/cart')
const CartItem = require('./models/cart-item')
const Order = require('./models/order')
const OrderItem = require('./models/order-item')



const app = express();

app.set('view engine', 'ejs')

app.set('views', 'views')

// app.use(bodyParser.urlencoded({extended: false}))
app.use(express.urlencoded({extended: false}))

app.use(express.static(path.join(__dirname,'public')));

app.use((req,res,next)=>{
    User.findByPk(1)
        .then(user=>{
            req.user = user;
            next();
        })
    .catch(err=>console.log(err));
})
app.use('/admin',adminRoutes)

app.use(shopRoutes);

app.use(errorController.get404)

// this add userId to products
Product.belongsTo(User,{contraints: true, onDelete: 'CASCADE'})
// this had UserId attribute to Product
User.hasMany(Product);
User.hasOne(Cart)
// This adds UserId attribute to Cart
Cart.belongsTo(User);

Cart.belongsToMany(Product,{through: CartItem});
Product.belongsToMany(Cart,{through: CartItem});

Order.belongsTo(User);
User.hasMany(Order);
Order.belongsToMany(Product,{through: OrderItem})


sequelize
    // .sync({force: true})
    .sync()
    .then(result => {
        return User.findByPk(1);
        
    })
    .then(user=>{
        if(!user){
            User.create({name:'Max', email: 'tes@test.com'})
        }
        // this is an anonymous function() inside then.
        // have to return both promise
        //But inside then, it will automatically be wrappedinto  a  promise
        // return Promise.resolve(User);
        return user;

    })
    .then(user=>{
        return user.createCart();
        
    })
    .then(cart=>{
        app.listen(3001, ()=>{
            console.log('server is listening on port 3001')
        })
    })
    .catch(err=>{
        console.log(err)
    })

// (async () => {
//   await sequelize.sync({ force: true });
//   // Code here
// })();
