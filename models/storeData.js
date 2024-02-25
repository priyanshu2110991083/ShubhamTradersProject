const mongoose=require("mongoose")
const store=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    use:String,
    price:{
        type:Number,
        required:true
    },
    type:String,
    image:{
        type:String,
        required:true
    },
    available:{
        type:Boolean,
        required:true
    },
    quantity:{
        type:Number,
        required:true
    },
    buyNow:String
})

const str=mongoose.model("str",store);
module.exports=str