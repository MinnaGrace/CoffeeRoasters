 const mongoose = require ('mongoose')

  const singleOrderItem = mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    amount:{
        type:Number,
        required:true,
        default:250
    },
    price: {
      type: Number,
      required: true,
    },
    image:{
        type:String,
        required:true
    },
    product:{
        type:mongoose.Schema.ObjectId,
        ref:'Product',
        required:true
    }
  });


 const orderSchema = mongoose.Schema({
    tax:{
        type:Number,
        required:true,
    },
    shippingFee:{
        type:Number,
        required:true,
        deafult:0
    },
    subtotal:{
        type:Number,
        required:true,
    
    },
    orderItems:[singleOrderItem],
    status:{
        type:String,
        enum:['pending', 'failed','payment complete','delievered','canceled' ],
        default:"pending"
    },
    user:{
        type: mongoose.Schema.ObjectId,
        ref:'User',
        required:true
    },
    name: { 
    type: String,
    required: true,
  },
    clientSecret:{
        type:String,
        required:true
    },
    paymentIntent:{
        type:String,
        required:true
    },
 },
 {timestamps:true}
)

module.exports = mongoose.model('Order', orderSchema)