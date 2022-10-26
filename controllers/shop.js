const Product = require('../models/products')
const Order = require('../models/order')
const User = require('../models/user')
const products = require('../models/products')


exports.getAddProduct = (req,res,next)=>{
    res.render('admin/add-product',{
        pageTitle: 'Add Product_x',
        path: '/admin/add-product-00',
        isAuthenticated : req.session.isLoggedIn
    })
}

exports.postAddProduct =(req,res,next)=>{   
    const product = new Product(req.body.title)
    product.save();
    res.redirect('/')
}
exports.getProducts = (req,res,next)=>{
    Product.find().then(products=>{
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'Shop page', 
            docTitle: 'Shop',
            path:'/products',
            isAuthenticated : req.session.isLoggedIn
        })
    })
    .catch(err=>console.log(err)); 
}

exports.getProduct = (req,res,next)=>{
    const prodId= req.params.productId;

    Product.findById(prodId).then(product=>{
        res.render('shop/product-detail',{
            product: product,
            pageTitle: product.title, 
            path:'/products',
            isAuthenticated : req.session.isLoggedIn
        })
    })
    .catch(err=>console.log(err));
    
}
exports.getIndex  = (req,res,next) =>{
    Product.find().then(products=>{
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop', 
            path:'/',
            isAuthenticated : req.session.isLoggedIn         
        })
    })
    .catch(err=>console.log(err)); 
}
exports.getCart = (req,res,next) =>{
    req.user
    //get back full user object
    .populate('cart.items.productId')
    .then(user=>{
        const products =user.cart.items;
        res.render('shop/cart',{
            path: '/cart',
            pageTitle: 'Your Cart',
            products:products,
            isAuthenticated : req.session.isLoggedIn
        });
    })
    .catch(err=>console.log(err))
}
exports.postCart = (req,res,next) =>{
    const prodId = req.body.productId;
    Product.findById(prodId)
    .then(product =>{
        return req.user.addToCart(product);
    })
    .then(result =>{
        // console.log(result)
        
        res.redirect('/cart')
    
    })
    .catch(err=>console.log(err))
}
exports.postCartDeleteProduct = (req,res,next)=>{
    const proId = req.body.productId;
    req.user
    .deleteItemFromCart(proId)
    .then(result=>{
    console.log(result)
        res.redirect('/cart')
    })
    .catch(err=>console.log(err))
}

exports.postOrder=(req,res,next)=>{
    req.user
    .populate('cart.items.productId')
    .then(user =>{
        const products = user.cart.items.map(i=>{
            // product: {...i.productId._doc}
            // add a full product object to product here
            // instead of just add productId like ( product: i.productId)
            return { product: {...i.productId._doc}, quantity: i.quantity}
        })
        const order  = new Order({
            products: products,
            user:{
                name: req.user.name,
                userId: req.user._id
            }
        })
        return order.save()
    })
    .then(result =>{
        return req.user.clearCart();
    })
    .then(()=>{
        res.redirect('/orders')
        console.log(' CLEAR CART')
    })
    .catch(err=>console.log(err))
}


exports.getOrders = (req,res,next) =>{
    Order.find({"user.userId": req.user._id})
    .then(orders=>{
        console.log(orders)
        res.render('shop/orders',{
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders,
        isAuthenticated : req.session.isLoggedIn
    });
    })
    .catch(err=>console.log(err))
    
}
exports.getCheckout = (req,res,next)=>{
    res.render('shop/checkout',{
        path: '/checkout',
        pageTitle: 'Checkout',
        isAuthenticated : req.session.isLoggedIn        
    });
}