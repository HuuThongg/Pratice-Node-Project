const Product = require('../models/products')
const mongodb =require('../models/products')
// const ObjectId = require('mongodb').ObjectId


exports.getAddProduct = (req,res,next)=>{
    res.render('admin/edit-product',{
        pageTitle: 'Add Product',
        path: '/admin/add-product-00',
        editing: false,
        isAuthenticated : req.session.isLoggedIn          

    })
}

exports.postAddProduct =(req,res,next)=>{   
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const price = req.body.price;
    const description = req.body.description;
    const product = new Product(
        {
            title: title,
            price: price,
            imageUrl : imageUrl, 
            description :description,
            userId : req.user

        });
        // mongoose  userId can store an object, and can automatically pick id from req.user and store it to userId
        // userId: req.user._id
    product
    .save()
    .then(result =>{
        console.log(result);
        res.redirect('/admin/products')
    })
    .catch(err=> console.log(err))
}
exports.getEditProduct = (req,res,next)=>{
    const editMode = (req.query.edit ==='true');
    if(!editMode){
        return res.redirect('/')
    }
    const prodId =req.params.productId;
   Product.findById(prodId) // get back an array so that's why we need to do product = products[0]
    // Product.findByPk(prodId)
        .then(product=>{
            if(!product){
                return res.redirect('/')
            }
            res.render('admin/edit-product',{
            pageTitle: 'Edit Product',
            path: '/admin/edit-product',
            editing: editMode,
            product: product,
            isAuthenticated : req.session.isLoggedIn          

            })
    
        })
}
exports.postDeleteProduct = (req,res,next)=>{
    const prodId =req.body.productId;
    
    Product.findByIdAndDelete(prodId).then(product=>{

    })
    .then(result=>{
        console.log('DESTROYED PRODUCT')
        res.redirect('/admin/products')
    })
    .catch(err=>console.log(err));
}

exports.postEditProduct = (req,res,next)=>{
    const prodId =req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedPrice = req.body.price;
    const updatedDescription = req.body.description;
    Product.findById(prodId).then(product =>{
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.imageUrl = updatedImageUrl;
        product.description = updatedDescription;
        product.save()
    })
    .then(result =>{
        console.log('UPDATED PRODUCT')
        res.redirect('/admin/products');
    })
    .catch(err=>console.log(err))
}
exports.getProducts = (req,res,next)=>{
    Product.find()
    // select some filds you wanna to include and exclude when you retrive your data
    // .select('title price -_id')
    // to add full user Object to products
    // .populate('userId','name')
    .then((products)=>{
        res.render('admin/products', {
            prods: products,
            pageTitle: 'Admin Products', 
            path:'/admin/products',
            isAuthenticated : req.session.isLoggedIn          
        })
    })
    .catch(err=>console.log(err))
}

