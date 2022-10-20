const express = require('express');
// const bodyParser = require('body-parser')
const adminRoutes = require('./routes/admin')
const shopRoutes = require('./routes/shop')
const path = require('path')
// const exphbs  = require('express-handlebars')
const errorController = require('./controllers/error')
const db= require('./util/database')

const app = express();

// app.engine used for handlebars only

// app.engine('hbs', exphbs.engine({
//     // layoutsDir:'/views/layouts/',
//     defaultLayout: 'main-layout',
//     extname: 'hbs'
// }));

// app.set('view engine', 'pug');
// app.set('view engine', 'hbs');
app.set('view engine', 'ejs')

app.set('views', 'views')



// app.use(bodyParser.urlencoded({extended: false}))
app.use(express.urlencoded({extended: false}))
// app.use(express.static('public'));
app.use(express.static(path.join(__dirname,'public')));
// app.use(express.json());
// app.use('/admin',adminRoutes);
app.use('/admin',adminRoutes)

app.use(shopRoutes);

app.use(errorController.get404)
// app.use('*',(req,res,next)=>{
//     res.status(404).send('<h1>no found</h1>')
// })

app.listen(3001, ()=>{
    console.log('server is listening on port 3001')
})