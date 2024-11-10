const express = require('express');
const app = express()
require('dotenv').config()
require('express-async-errors')
//packages
const path = require('path');
// shows what routes your hitting
const morgan =require('morgan')

const cookieParser =require('cookie-parser')

const cors = require('cors')
// database 
const connectDB = require('./database/connect')


// routers
const orderRouter = require('./routes/orderRoutes')
const authRouter = require('./routes/authRoutes')
const userRouter = require('./routes/userRoutes')
const productRouter =  require('./routes/productRoutes')
const reviewRouter = require('./routes/reviewRoutes')
//middleware

const notFoundMiddleware = require('./middleware/notFound')
const errorHandlerMiddleware = require('./middleware/error-handler');
const fileUpload = require('express-fileupload');

app.use(cookieParser(process.env.JWT_SECRET))
app.use(morgan('tiny'))
app.use(cors())
app.use(express.json())
app.use(fileUpload())

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req,res)=>{
    res.send('working')
})
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/products', productRouter)
app.use('/api/v1/review', reviewRouter)
app.use('/api/v1/orders', orderRouter);
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)


const port = process.env.PORT || 3000
const start = async () =>{
    try{
        await connectDB(process.env.MONGO_URL)
        app.listen(port,console.log(`listening ${port}`))
        
    }
    catch(error){
        console.log(error)
    }
}

start()
