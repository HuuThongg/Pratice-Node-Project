const User = require('../models/user')

exports.getLogin = (req,res,next) =>{
    res.render('auth/login',{
    path: '/login',
    pageTitle: 'login',
    isAuthenticated : false
})
}

exports.postLogin = (req,res,next) =>{
    // res.setHeader('Set-Cookie','loggedIn=true')
    // req.session.isLoggedIn = true;

    User.findById('63587c9377621ef8e01cd954')
        .then(user=>{
            req.session.isLoggedIn = true;
            req.session.user= user
            // make sure your session was created before you continyue
            req.session.save(result =>{
                console.log('Login')
                res.redirect('/') ;      
            })
        })
        .catch(err=>console.log(err));
}

exports.postLogout = (req,res,next) =>{
    req.session.destroy((err)=>{
        console.log('Logout')
        res.redirect('/')
    });
}