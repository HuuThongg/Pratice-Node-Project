const Product = require('../models/products')
const Order = require('../models/order')


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
    Product.findAll().then(products=>{
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
    // Product.findAll({where:{id: prodId}})
    //     .then(products=>{
    //         res.render('shop/product-detail',{
    //         product: products[0],
    //         pageTitle: products[0].title, 
    //         path:'/products',
    //     })
    //     })
    // .catch(err=>console.log(err));

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
    Product.findAll().then(products=>{
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop', 
            path:'/',          
        })
    })
    .catch(err=>console.log(err)); 
}
exports.getCart = (req,res,next) =>{
    // getCart is provided by sequelize
    req.user.getCart()
    .then(cart=>{
        // getProducts is provided by sequelzie through associations that i defined 
        return cart.getProducts()
        .then(products=>{
            res.render('shop/cart',{
            path: '/cart',
            pageTitle: 'Your Cart',
            products:products
    });
        })
        .catch(err=>console.log(err))
    })
    .catch(err=>console.log(err))
}
exports.postCart = (req,res,next) =>{
    const prodId = req.body.productId;
    let fetchedCart;
    let newQuantity = 1;

    req.user
    .getCart()
    .then(cart=>{
        // always return an array of a product. even if it's a product or an empty array
        fetchedCart = cart;
        return cart.getProducts({where:{id:prodId}})
    })
    .then(products=>{
        let product
        if(products.length>0)
            product = products[0];
        if(product){
            const oldQuantity = product.cartItem.quantity
            newQuantity += oldQuantity;
            return product;
        }
        return Product.findByPk(prodId)
    })
    .then(product =>{
        return fetchedCart.addProduct(product,{ through:{ quantity: newQuantity} });
    })
    .then(()=>{
        res.redirect('/cart')
    })
    .catch(err=>console.log(err))
}
exports.postCartDeleteProduct = (req,res,next)=>{
    const proId = req.body.productId;
    req.user
    .getCart()
    .then(cart =>{
        return cart.getProducts({where: {id: proId}})
    })
    .then(products=>{
        const product = products[0];
        return product.cartItem.destroy();
    })
    .then(result=>{
        res.redirect('/cart')
    })
    .catch(err=>console.log(err))
}

exports.postOrder=(req,res,next)=>{
    let fetchedCart
    req.user
    .getCart()
    .then( cart =>{
    fetchedCart = cart

        return cart.getProducts();
    })
    .then(products=>{
        return req.user.createOrder()
        .then(order =>{
            return order.addProducts(products.map(product =>{
                product.orderItem = {quantity: product.cartItem.quantity}
                return product;
            }
        ))})
        .catch(err=>console.log(err))
    })
    .then(result =>{
        fetchedCart.setProducts(null);
    })
    .then(result=>{
        res.redirect('/orders')
    })
    .catch(err=>console.log(err))
}

exports.getOrders = (req,res,next) =>{
    req.user.getOrders({include:['products']})
    .then(orders=>{
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