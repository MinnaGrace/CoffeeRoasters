const mongoose = require('mongoose')


const ReviewSchema = new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:[true, 'provide review title'],
        maxlength: 100
    },
    rating:{
        type:Number,
        min:1,
        max:5,
        required:[true, 'provide rating']
    },
    comment:{
        type:String,
        required:[true, 'provide review title'],
        maxlength:150
    },
    user:{
        type:mongoose.Types.ObjectId,
        ref:'User',
        required:true
    },
    product:{
        type:mongoose.Types.ObjectId,
        ref:'Product',
        required:true
    }
   
},{timestamps:true}
)

ReviewSchema.index({product:1, user:1},{unique:true})
// statics, not methods becasue we want to call the function on the schema 
// not  the instance
ReviewSchema.statics.calculateAverageRating = async function (productId) {
    
  const result = await this.aggregate([
    { $match: { product: productId } },
    {
      $group: {
        _id: null,
        averageRating: { $avg: "$rating" },
        reviewCount: { $sum: 1 },
      },
    },
  ]);
  try{
   

    await this.model("Product").findOneAndUpdate(
      { _id: productId },

      {
        reviewCount: result[0]?.reviewCount || 0,
        averageRating: Math.ceil(result[0]?.averageRating || 0),
      }
    );
    
  }
  catch(error){
    console.log(error)
  }
  
}

ReviewSchema.post('save', async function(){
    await this.constructor.calculateAverageRating(this.product);
})
ReviewSchema.post("findOneAnddelete", async function () {
    await this.constructor.calculateAverageRating(this.product);
});
module.exports = mongoose.model('Review', ReviewSchema)