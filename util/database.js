// const { MongoClient, ServerApiVersion } = require('mongodb');
// let _db;
// const mongoConnect = (callback) =>{
//     const uri = "mongodb+srv://thong0506:<password>@cluster0.nrohf5r.mongodb.net/?retryWrites=true&w=majority";
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(err => {
//     _db = client.db("shop");
//         callback();

//   // perform actions on the collection object
// });
// }
// const getDb =()=>{
//     if(_db){
//         return _db;
//     }
//     throw 'No database found!'
// }
// exports.mongoConnect = mongoConnect;
// exports.getDb = getDb;




const mongodb = require('mongodb');
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback)=>{
    MongoClient.connect('mongodb+srv://thong0506:thong0506@cluster0.nrohf5r.mongodb.net/shop?retryWrites=true&w=majority')
    .then(client =>{
        console.log('Connected');
        _db=client.db();
        callback();
    })
    .catch(err=> {
        console.log(err)
        throw err;
    })
}
const getDb =()=>{
    if(_db){
        return _db;
    }
    throw 'No database found!'
}
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;






// const { MongoClient, ServerApiVersion } = require('mongodb');
// //delete this
// const uri = "mongodb+srv://thong0506:jBuX2I36fYi4lXVU@cluster0.dfizncz.mongodb.net/?retryWrites=true&w=majority";
// // const uri ='mongodb+srv://thong0506:thong0506@cluster0.nrohf5r.mongodb.net/shop?retryWrites=true&w=majority'
// const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });
// client.connect(async err => {
//   const collection = client.db("shop").collection("test");
//   // perform actions on the collection object
//   const pipeline =  [
//     {
//         '$limit': 20
//     }
//     ] 
//     // delete this
//     collection.insertOne(
//   //  { item: "canvas", qty: 100, tags: ["cotton"], size: { h: 28, w: 35.5, uom: "cm" } }
// )
//     const agg= await collection.aggregate().toArray();
//     console.log(agg)
//     client.close();
// });
