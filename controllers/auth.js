const crypto =  require('crypto')
const bcrypt = require('bcryptjs')
const User = require('../models/user')

const sgMail = require('@sendgrid/mail')
const API_KEY = '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';
sgMail.setApiKey(API_KEY)


exports.getLogin = (req,res,next) =>{
    let message = req.flash('error1')
    if(message.length > 0){
        message = message[0]
    }else{
        message = null
    }
    res.render('auth/login',{
        path: '/login',
        pageTitle: 'login',
        errorMessage : message
    })
}

exports.postLogin = (req,res,next) =>{
    // res.setHeader('Set-Cookie','loggedIn=true')
    // req.session.isLoggedIn = true;
    const email = req.body.email;
    const password = req.body.password;
    User.findOne({email:email})
        .then(user=>{
            if(!user){
                req.flash('error1','Invalid email or passowrd');
                return res.redirect('/login')
            }
            bcrypt.compare(password, user.password)
            .then(doMatch =>{
                if(doMatch){
                    req.session.isLoggedIn = true;
                    req.session.user= user
                    // make sure your session was created before you continyue
                    return req.session.save(result =>{
                        console.log('Login')
                        res.redirect('/')
                    })
                }
                res.redirect('/login')
            })
            .catch(err =>{
                console.log(err)
                res.redirect('/login')
            })
            
        })
        .catch(err=>console.log(err));
}

exports.getSignup = (req,res,next) =>{
    let message = req.flash('error1')
    if(message.length > 0){
        message = message[0]
    }else{
        message = null
    }
    res.render('auth/signup',{
        path: '/signup',
        pageTitle: 'signup',
        errorMessage: message
    })
}
exports.postSignup = (req,res,next) =>{
    const  email = req.body.email;
    const  password = req.body.password;
    const  confirmPassword = req.body.confirmPassword;
    User.findOne({email:email})
        .then(userDoc =>{
            if(userDoc){
                req.flash('error1','Email exists already')
                return res.redirect('signup')
            }
            return bcrypt.hash(password,12)
                .then(hashedPassword=>{
                    const user = new User({
                        email: email,
                        password: hashedPassword,
                        cart: {items: []}
                    });
                    return user.save();
                })
                .then(result =>{
                    res.redirect('/login')

                    return sgMail.send({
                        to: email,
                        from: 'longhuuthe@gmail.com',
                        subject: 'Signup succeeded!',
                        html : '<h1> You successfully signed up !<h1>'
                    });
                    
                })
                .catch(err=> console.log(err))
        })
        .catch(err => console.log(err));

}
exports.postLogout = (req,res,next) =>{
    req.session.destroy((err)=>{
        console.log('Logout')
        res.redirect('/')
    });
}
exports.getReset = (req,res,next)=>{
    let message = req.flash('error1')
    if(message.length > 0){
        message = message[0]
    }else{
        message = null
    }
    res.render('auth/reset',{
        path: '/resest',
        pageTitle: 'Resest Passowrd',
        errorMessage : message
    })
}
exports.postReset = (req,res,next) =>{
    crypto.randomBytes(32,(err,buffer)=>{
        if(err){
            return res.redirect('/reset')
        }
        const token = buffer.toString('hex')
        User.findOne({email:req.body.email})
            .then(user=>{
                if(!user){
                    req.flash('error1','No account with that email found')
                    return res.redirect('/reset')
                }
                user.resetToken = token;
                user.resetTokenExpiration = Date.now() + 3600000;
                user.save();
            })
            .then(result=>{
                    return sgMail.send({
                        to: req.body.email,
                        from: 'longhuuthe@gmail.com',
                        subject: 'Password reset!',
                        html : `<h1> You requested password Reset !<h1>
                        <p> click this <a href="http://localhost:3001/reset/${token}"> Link </a> To set a new password
                        </p>
                        `
                    });
            })
            .catch(err=>{
                console.log(err)
            })
    } )
    res.redirect('/')
}
exports.getNewPassword= (req,res,next)=>{
    const token = req.params.token
    User.findOne({resetToken: token, resetTokenExpiration: {$gt:Date.now()}})
    .then(user=>{
        let message = req.flash('error1')
        if(message.length > 0){
            message = message[0]
        }else{
            message = null
        }
        res.render('auth/new-password',{
            path: '/new-passowrd',
            pageTitle: 'new-passowrd',
            errorMessage : message,
            userId: user._id.toString(),
            passwordToken: token
        })
    })
    .catch(err=>console.log(err))
    
}
exports.postNewPassword= (req,res,next)=>{
    const userId = req.body.userId
    const newPassword = req.body.password; 
    const passwordToken = req.body.passwordToken;

    let resetUser;
    User.findOne({
        resetToken: passwordToken, 
        resetTokenExpiration: {$gt : Date.now()},
        _id: userId
    })
    .then(user =>{
        resetUser = user;
        return bcrypt.hash(newPassword,12)
    })
    .then(hashedPassword =>{
        resetUser.password = hashedPassword;
        resetUser.resetToken = undefined;
        resetUser.resetTokenExpiration = undefined;
        return resetUser.save();
    })
    .then(result =>{
        res.redirect('/login')
    })
    .catch(err=>console.log(err))

}