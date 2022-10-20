const Product = require('../models/products')
const Cart = require('../models/cart')

exports.getAddProduct = (req,res,next)=>{
    // res.sendFile(path.join(rootDir,'views','add-product.html'))
    // res.sendFile(path.join(__dirname,'..','views','add-product.html'))

    res.render('admin/add-product',{
        pageTitle: 'Add Product_x',
        path: '/admin/add-product-00',
        activeAddProduct:true, 
        productCSS: true,
        formCSS:true,
    })
}

exports.postAddProduct =(req,res,next)=>{   
    const product = new Product(req.body.title)
    product.save();
    res.redirect('/')
}
exports.getProducts = (req,res,next)=>{
       // res.sendFile(path.join(__dirname,'..','views','shop.html'))
    Product.fetchAll((products) =>{
        res.render('shop/product-list', {
            prods: products,
            pageTitle: 'Shop page', 
            docTitle: 'Shop',
            path:'/products', 
            // hasProducts : products.length > 0,
            // activeShop :true,
            // productCSS:true,
            
        })
    });
}
exports.getProduct = (req,res,next)=>{
    const prodId= req.params.productId;
    Product.findById(prodId,product=>{
        res.render('shop/product-detail',{
            product: product,
            pageTitle: product.title, 
            path:'/products',
        })
    })
}
exports.getIndex  = (req,res,next) =>{
    Product.fetchAll((products) =>{
        res.render('shop/index', {
            prods: products,
            pageTitle: 'Shop', 
            path:'/',          
        })
    });
}
exports.getCart = (req,res,next) =>{
    Cart.getCart(cart=>{
        Product.fetchAll(products=>{
            const cartProducts=[];
            for(product of products){
                const cartProductData=cart.products.find(prod=>prod.id==product.id);
                if(cartProductData){
                    cartProducts.push({productData:product,qty:cartProductData.qty})
                }
            }
            res.render('shop/cart',{
                path: '/cart',
                pageTitle: 'Your Cart',
                products:cartProducts
            });
        })
        
    })
    
}
exports.postCart = (req,res,next) =>{
    const proId = req.body.productId;
    Product.findById(proId,(product)=>{
        Cart.addProduct(proId,product.price);
    })
    res.redirect('/cart')
}
exports.postCartDeleteProduct = (req,res,next)=>{
    const proId = req.body.productId;
    Product.findById(proId,product=>{
        Cart.deleteProduct(proId,product.price)
        res.redirect('/cart')
    })
}
exports.getOrders = (req,res,next) =>{
    res.render('shop/orders',{
        path: '/orders',
        pageTitle: 'Your Orders'
    });
}
exports.getCheckout = (req,res,next)=>{
    res.render('shop/checkout',{
        path: '/checkout',
        pageTitle: 'Checkout'
    });
}