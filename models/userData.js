const mongoose=require("mongoose")
const schema=mongoose.Schema({
        username:{
            type:String,
            required:true,
        },
        email:{
            type:String,
            required:true,
        },
        password:{
                type:String,
                minLength:8,
                required:true,
        },
        house_number:{
            type:Number,
            required:true,
        } , 
        villageTown:{
            type:String,
            required:true,
        },
        state:{
            type:String,
            required:true,
        },
        pincode:{
            type:Number,
            required:true,
        },
        checkbox:{
            type:String,
            default:"on",
        }
        
})
const sch=mongoose.model("sch",schema)
module.exports=sch