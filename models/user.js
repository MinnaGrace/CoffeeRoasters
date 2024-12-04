// hashing passwords
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose')
const validator = require('validator')
const userSchema = mongoose.Schema({
    name:{
        type:String,
        required: [true, 'Please provide name' ],
        minlength: 3,
        maxlength: 50
    },
    email:{
        type:String,
        unique:true,
        required:[true, "Please provide email"],
        minlength: 3,
        maxlength: 50,
        validate:{
            validator: validator.isEmail,
            message: 'Please provide valid emial'
        }

        
    },
    password:{
        type:String,
        required:[true, "Please provide email"],
        minlength: 6,

    },
    role:{
        type:String,
        enum:['admin', 'user'],
        default:'user'

    }
    

})

// schema pre hook,=> middleware functions that run before specific events
// pre('save) => runs before a document is saved to the databse which is why 
// we are using it to hash our passwords

userSchema.pre('save', async function(){
    if(!this.isModified('password')) return
    // number of rounds of hashing
    const salt = await bcrypt.genSalt(10)
    // refers to current password

    this.password= await bcrypt.hash(this.password,salt)
})

userSchema.methods.comparePassword = async function(candidatePassword){
    const match = await bcrypt.compare(candidatePassword, this.password)
    return match
}



module.exports = mongoose.model('User', userSchema)