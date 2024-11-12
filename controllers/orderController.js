const Orders = require("../models/orders");
const Product = require("../models/product");
const selectedError = require("../errors");
const { StatusCodes } = require("http-status-codes");
const { checkPermissions } = require("../utils");
// const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);


  const createOrder = async (req, res) => {
    const { items: cartItems, tax, shippingFee } = req.body;
    if (!cartItems || cartItems.length < 1) {
      throw new selectedError.BadRequestError("No cart items provided");
    }
    if (!tax || !shippingFee) {
      throw new selectedError.BadRequestError("Provide tax and shipping fee");
    }

    let orderItems = [];
    let subtotal = 0;

    for (const item of cartItems) {
      const product = await Product.findOne({ _id: item.product });
      if (!product) {
        throw new selectedError.NotFoundError(
          "No product with corresponding ID"
        );
      }
      const { name, price, image, _id, amount} = product;
      const singleOrderItem = {
        name,
        price,
        image,
        amount,
        product: _id,
        quantity: item.quantity, // Ensure quantity is correctly retrieved from item
      };

      orderItems.push(singleOrderItem);
      let size = 0;

      if(amount == 250){
        size = 1
      }
      else if(amount==500){
        size = 5
      }
      else if(size = 1000){
        size = 10
      }
      subtotal += (item.quantity * price) + size;
    }

    const total = tax + subtotal + shippingFee;

    const order = await Orders.create({
      orderItems, // Ensure this is passed correctly
      total,
      subtotal,
      tax,
      shippingFee,
      clientSecret: "paymentIntent.client_secret",
      paymentIntent: "paymentIntent.id",
      user: req.user.userId,
      name:req.user.name
      
      
    });

    res.status(StatusCodes.OK).json({ order, total});
  };


    
//     try {
//     // Create a Payment Intent with Stripe
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: totalAmount,
//       currency: "usd",
//       automatic_payment_methods: { enabled: true },
//     });

//     // Save the order in your database
//     const order = await Order.create({
//       tax,
//       shippingFee,
//       subtotal,
//       cartItems: orderItems,
//       status: "pending",
//       user: req.user.userId, // Assumes user is authenticated and userId is available in req.user
//       clientSecret: paymentIntent.client_secret,
//       paymentIntent: paymentIntent.id,
//     });

//     res.status(StatusCodes.CREATED).json({
//       order,
//       clientSecret: paymentIntent.client_secret, // Send client secret to client for frontend payment processing
//     });
//   } catch (error) {
//     console.error("Error creating payment intent:", error);
//     res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
//       msg: "There was an error processing your payment. Please try again.",
//     });
//   }


const getSingleOrder = async (req, res) => {
 const {id:orderId} = req.params;
 const order = await Orders.findOne({_id:orderId})
 if(!order){
  throw new selectedError.NotFoundError('order not found')
 }
 checkPermissions(req.user,order.user)
  res.status(StatusCodes.OK).json({ order });
};
const getCurrentUserOrder = async (req, res) => {
  const userId = req.user.userId
  const orders = await Orders.find({user:userId})
  res.status(StatusCodes.OK).json({ orders});
};
const getAllOrders = async (req, res) => {
  const orders = await Orders.find({})
  res.status(StatusCodes.OK).json({orders})
};
const updateOrder = async (req, res) => {
   const { id: orderId } = req.params;
   const { paymentIntentId } = req.body;

   const order = await Order.findOne({ _id: orderId });
   if (!order) {
     throw new CustomError.NotFoundError(`No order with id : ${orderId}`);
   }
   checkPermissions(req.user, order.user);

   order.paymentIntentId = paymentIntentId;
   order.status = "paid";
   await order.save();

   res.status(StatusCodes.OK).json({ order });
};


module.exports = {
    createOrder,
    getAllOrders,
    getCurrentUserOrder,
    getSingleOrder,
    updateOrder
}