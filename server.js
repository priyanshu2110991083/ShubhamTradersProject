const express=require("express");
const app=express();
const mongoose=require("mongoose")
const sch=require("./models/userData.js")
const str=require("./models/storeData.js")
mongoose.connect("mongodb://127.0.0.1:27017/ShubhamTraders")
const cors=require("cors")
const session=require("express-session")
const bcrypt=require("bcrypt")
const nodemailer=require("nodemailer")
require("dotenv").config()
//authentication
//stateful and stateless
//statefull -> which maintain data on server side and stateless -> which has no state

app.use(session({
    secret:"this is my secret",
}))


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
app.use(express.static(__dirname + "/public"))      //to send public folder on /


app.use(express.urlencoded())

app.get("/strs",async (req,res)=>{
    const notes = await str.find()
    res.send(notes)
})
app.get("/",(req,res)=>{
    req.session.logged_In=true;
    res.sendFile(__dirname+"/index.html");
})
app.get("/logout",(req,res)=>{
    req.session.logged_In=false;
    res.cookie("logged_In",req.session.logged_In)
    res.sendFile(__dirname+"/public/index.html")
})
app.post("/login",async (req,res)=>{
    const database=await sch.find()
    const data=req.body;
    if(!data.username || !data.password ){
        res.send("pls enter correct username and password")
        return;
    }
    let f=1;
    const userTry=(await sch.find().where('username').equals(data.username))[0] ;
    let isTrue=false;
    if(userTry)
        isTrue=await bcrypt.compare(data.password, userTry.password)

    if(userTry && isTrue==false){
        f=0;
        res.send("Enter Correct Password")
        return;
    }
    if(!userTry){
        res.send("please register first")
        return;
    }
req.session.logged_In=true;
req.session.username=data.username;
res.cookie("username",req.session.username)
res.cookie("logged_In",req.session.logged_In)
res.sendFile(__dirname+"/public/index.html")
    
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
    const saltRound=10  //it will encrypt password 10 times
    const hashedPwd=await bcrypt.hash(data.password,saltRound)
    user.password = hashedPwd;
    await user.save();
    res.send("Password Reset Successfully")
})


//saving in database
//saving data on variable so that after checking otp we can store in data base
var MainData;
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
                return;
            }
            if(data.email==database[i].email){
                bo=true;
                res.send("Account already exist with this email");
                return;
            }
        }
        if(!data.password.includes("@") || !data.password.includes("_") || data.password.toString().length<8){
            bo=true;
            res.send("Use Strong Password, use underscores '_' and '@' in it and length must > 8");
            return;
        }
        if(bo==false){
            SendMail(data.email);
            res.sendFile(__dirname+"/public/OTP.html");
            const saltRound=10  //it will encrypt password 10 times
            const hashedPwd=await bcrypt.hash(data.password,saltRound)
            data.password=hashedPwd
            MainData=data;
            //we will not store data here in database 
            //when user get varified the we'll store its data in database
            // await sch.create(data);
        }
    }
})

//nodemailer
const transporter=nodemailer.createTransport({
    service:"gmail",
    auth:{
        user:'priyanshugarg2509@gmail.com',
        pass:process.env.PASS
    }
})


//we need to generate random otp with 5 digits so we will run javascript here
function generateRandomNumber() {
    // Generate a random number between 10000 and 99999
    // You can use the generated number as needed in your application
    var randomNumber = Math.floor(10000 + Math.random() * 90000);
    return randomNumber;

}
var OTP;    //otp variable to store otp so that we can use it in other function also
// Call the function to generate the random number
//send mail function
function SendMail(mailID){
    OTP=generateRandomNumber();
    const mail={
        to:mailID,
        from:'priyanshugarg2509@gmail.com',
        subject:"One Time Password To Register In Shubham Traders",
        html:`<p>${OTP}</p>`+"Do not share this one time password with anyone"
    }
    transporter.sendMail(mail)
}

//checking that entered otp is correct or not
app.post("/verify",async (req,res)=>{
    const data=req.body;
    const otp=data.OTP;
    if(otp==OTP) {
        await sch.create(MainData)
        req.session.logged_In=true;
        req.session.username=MainData.username;
        res.cookie("username",req.session.username)
        res.cookie("logged_In",req.session.logged_In)
        res.sendFile(__dirname+"/public/index.html")
        return;
    }
    else{
        res.send("Wrong OTP");
        return;
    }
})

//resend otp (Not Working)
app.post("/ResendOTP",(req,res)=>{
    SendMail(MainData.email)
    res.send("otp Resend")
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

function checkLogin(req, res, next) {
    if (req.session.logged_In) {
        next();
    } else {
        res.send("Please login");
    }
}
app.post("/payment",checkLogin,(req,res)=>{
    res.sendFile(__dirname+"/public/Payment.html")
})


