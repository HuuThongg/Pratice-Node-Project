const mongoose = require('mongoose')
const Schema = mongoose.Schema;
// const order ={
//             items: products,
//             user: {
//                 _id: new mongodb.ObjectId(this._id),
//                 name:this.name,
//                 email : this.email
//             }
const  orderSchema = new Schema({
    products: [{
        product : {
            type: Object,
            required: true
        },
        quantity : { type : Number, required: true}
    }]
    ,
    user : {
        name: {
            type : String,
            required: true
        },
        userId: {
            type: Schema.Types.Object,
            required: true,
            ref : 'User'
        }
    }
})
module.exports = mongoose.model('Order', orderSchema);