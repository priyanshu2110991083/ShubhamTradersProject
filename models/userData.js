const mongoose=require("mongoose")
const schema=mongoose.Schema({
        username:{
            type:String,
            required:true
        },
        email:{
            type:String,
            required:true
        },
        password:{
                type:String,
                minLength:8,
                required:true
        },
        checkbox:{
            type:String,
            dsfault:"on"
        }
        
})
const sch=mongoose.model("sch",schema)
module.exports=sch