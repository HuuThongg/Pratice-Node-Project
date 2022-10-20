const fs = require('fs')
const requestHandler=(req,res) =>{
    if(req.url ==='/'){
    res.write('<html>')
    res.write('<head><title>Enter page</title> </html>')
    res.write(`<form action="/message" method="post">
        <input type="text" name="message" id="">
    </form>`)
    res.write('</html>')
        return res.end();
    }
    if(req.url === '/message' && req.method === 'POST'){
        const body = [];
        // const {name} = req.body
        console.log(req.body);
        req.on('data',(chunk)=>{
            body.push(chunk);
            // console.log(body);
        } )
        req.on('end', ()=>{
            const parseBody = Buffer.concat(body).toString();
            const message = parseBody.split('=')[1];
            console.log(message);
        fs.writeFile('message.txt', message,
        { flag: 'a' }, (err)=>{
            res.statusCode = 302;
            return res.end();
            });
        
        })
    }
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Location', '/');
    res.write('<html>')
    res.write('<head><title>Myfirst page</title> </html>')
    res.write('</html>')
    res.end();
}
module.exports = requestHandler;

// module.exports ={
//     handler: requestHandler,
//     someText : ' Some hard codefd tesxt '
// }

// in app.js  const server = http.createServer(routes.handler);
  





//admin.js

// router.get('/add-product',(req,res,next)=>{
//     // res.sendFile(path.join(rootDir,'views','add-product.html'))
//     // res.sendFile(path.join(__dirname,'..','views','add-product.html'))

//     res.render('add-product',{
//         pageTitle: 'Add Product_x',
//         path: '/admin/add-product-00',
//         activeAddProduct:true, 
//         productCSS: true,
//         formCSS:true,
//     })
// })

