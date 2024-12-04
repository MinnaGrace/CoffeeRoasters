const mongoose = require('mongoose')


const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "Please provide product name"],
      maxlength: [50, "product name cannot exceed 50 chracters"],
    
    },
    featured:{
      type:Boolean,
      default:true
    },
    price: {
      type: Number,
      trim: true,
      required: [true, "Please provide product price"],
      default: 0,
    },
    description: {
      type: String,
      required: [true, "please provide prdouct description"],
      maxlength: [1000, "description cannot exceed 1000 chracters"],
    },
    image: {
      type: String,
      default:
        "/public/starter-code/assets/home/mobile/image-hero-coffeepress.jpg",
    },
    inventory: {
      type: Number,
      required: [true, "provide product inventory"],
      default: 0,
    },
    freeShipping: {
      type: Boolean,
      default: false,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
  }, // timestamps and allows prdoucts model to accept virtuals
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
//populates review in products
ProductSchema.pre(
    "deleteOne",
    { document: true, query: false },
    async function () {
      await this.model("Review").deleteMany({ product: this._id });
    }
  );
  ProductSchema.virtual("reviews", {
    ref: "Review",
    localField: "_id",
    foreignField: "product",
    justOne: false,
  });


module.exports = mongoose.model('Product', ProductSchema)