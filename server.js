const express=require("express");
const app=express();
const mongoose=require("mongoose")
const sch=require("./models/userData.js")
const str=require("./models/storeData.js")
mongoose.connect("mongodb://127.0.0.1:27017/ShubhamTraders")
const cors=require("cors")
const fs=require("fs");
const UserdatabaseJSON=require("./public/userData.json")
const StoredatabaseJSON=require("./public/store.json")

async function main() {
    const storeItemsInDatabase = await str.find();
    const userInDatabase=await sch.find();
    if(userInDatabase.length==0){
        await sch.insertMany(UserdatabaseJSON)
    }
    if (storeItemsInDatabase.length == 0) {
        await str.insertMany(StoredatabaseJSON);
    } 
}
main();



app.use(cors())
app.listen(300,()=>{
    console.log("http://localhost:300/");
})
app.use(express.static(__dirname + "/public"))


app.use(express.urlencoded())
app.get("/store.json",(req,res)=>{
    res.sendFile(__dirname+"/public/store.json")
})
app.get("/",(req,res)=>{
    res.sendFile(__dirname+"/index.html");
})

app.post("/login",async (req,res)=>{
    const database=await sch.find()
    const data=req.body;
    if(!data.username || !data.password ){
        res.send("pls enter correct username and password")
    }
    let f=0;
    for(let i in database){
        if(database[i].username==data.username && database[i].password!=data.password){
            res.send("Enter Correct Password")
        }
        if(database[i].username==data.username && database[i].password==data.password){
            f=1;
            res.send("Logged In")
        }
    }
    if(f==0){

        res.send("please register first")
    }
})

//for resetting
app.get("/PassReset.html",(req,res)=>{
    res.sendFile(__dirname+"/PassReset.html");
})

//now update resetted password
app.post("/reset",async (req,res)=>{
    const database=await sch.find()
    const data=req.body;
    if(!data.username || !data.password ){
        res.send("pls enter correct username and password")
    }
    if(!data.password.includes("@") || !data.password.includes("_")){
        bo=true;
        res.send("Use Strong Password, use underscores '_' and '@' in it");
    }
    const user=await sch.findOne().where('username').equals(data.username);
    if(!user){
        res.send("please register first")
        return;
    }

    user.password = data.password;
    await user.save();
    res.send("Password Reset Successfully")

    // res.sendFile(__dirname+"/index.html")
    
})


//saving in database
app.post("/register", async (req,res)=>{
    const database = await sch.find();
    const data=req.body;
    let flag=0
    if(!data.username || !data.password || !data.email ||!data.house_number || !data.villageTown || !data.pincode || !data.state || !data.checkbox){
        flag=1;
        res.send("please enter all the credentials");
    }
    if(flag==0){
        var bo=false;
        for(let i in database){
            if(data.username==database[i].username){
                bo=true;
                res.send("user name not available, use another username")
                break;
            }
            if(data.email==database[i].email){
                bo=true;
                res.send("Account already exist with this email");
                break;
            }
        }
        if(!data.password.includes("@") || !data.password.includes("_") || data.password.toString().length<8){
            bo=true;
            res.send("Use Strong Password, use underscores '_' and '@' in it and length must > 8");
        }
        if(bo==false){
            await sch.create(data);
            res.send("Registered");
        }
    }
})

app.post("/access",(req,res)=>{
  const data=req.body;
  let f=0;
  if((data.username.toLowerCase()!="priyanshu" || data.username.toLowerCase()!="tarun garg") && data.password!="sirfmujheptah"){
    f=1;
    res.send("you are not eligible to access this functionality")
  }  
  if(f==0)
    res.sendFile(__dirname+"/public/addInDataBaseForm.html")
})

app.get("/add",async (req,res)=>{
    const name=req.query.name
    const use=req.query.use
    const price=parseInt(req.query.price)
    const type=use
    const image=req.query.image
    const buyNow= "https://example.com/buy/flexi-hose"
    const object=
        {
            "name":name,
            "use":use,
            "price":price,
            "image":image,
            "type":type,
            "buyNow":buyNow
        }
    

    await str.create(object)
    res.send("added")
})

