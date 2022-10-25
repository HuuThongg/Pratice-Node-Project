const Product = require('../models/products')
// const Order = require('../models/order')
// const User = require('../models/user')


exports.getAddProduct = (req,res,next)=>{
    res.render('admin/add-product',{
        pageTitle: 'Add Product_x',
        path: '/admin/add-product-00',
    })
}

exports.postAddProduct =(req,res,next)=>{   
    const product = new Product(req.body.title)
    product.save();
    res.redirect('/')
}
exports.getProducts = (req,res,next)=>{
    Product.fetchAll().then(products=>{
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'Shop page', 
            docTitle: 'Shop',
            path:'/products', 
        })
    })
    .catch(err=>console.log(err)); 
}
exports.getProduct = (req,res,next)=>{
    const prodId= req.params.productId;

    Product.findByPk(prodId).then(product=>{
        res.render('shop/product-detail',{
            product: product,
            pageTitle: product.title, 
            path:'/products',
        })
    })
    .catch(err=>console.log(err));
    
}
exports.getIndex  = (req,res,next) =>{
    Product.fetchAll().then(products=>{
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop', 
            path:'/',          
        })
    })
    .catch(err=>console.log(err)); 
}
exports.getCart = (req,res,next) =>{
    req.user.getCart()
    .then(products=>{
        res.render('shop/cart',{
            path: '/cart',
            pageTitle: 'Your Cart',
            products:products
        });
    })
    .catch(err=>console.log(err))
}
exports.postCart = (req,res,next) =>{
    const prodId = req.body.productId;
    Product.findByPk(prodId)
    .then(product =>{
        return req.user.addToCart(product)
    })
    .then(result =>{
        console.log(result)
        
        res.redirect('/cart')
    
    })
    .catch(err=>console.log(err))
}
exports.postCartDeleteProduct = (req,res,next)=>{
    const proId = req.body.productId;
    req.user
    .deleteItemFromCart(proId)
    .then(result=>{
        res.redirect('/cart')
    })
    .catch(err=>console.log(err))
}

exports.postOrder=(req,res,next)=>{
    req.user.addOrder()
    .then(result=>{
        res.redirect('/orders')
    })
    .catch(err=>console.log(err))
}

exports.getOrders = (req,res,next) =>{
    req.user.getOrders()
    .then(orders=>{
        console.log(orders)
        res.render('shop/orders',{
        path: '/orders',
        pageTitle: 'Your Orders',
        orders: orders
    });
    })
    .catch(err=>console.log(err))
    
}
exports.getCheckout = (req,res,next)=>{
    res.render('shop/checkout',{
        path: '/checkout',
        pageTitle: 'Checkout'
    });
}