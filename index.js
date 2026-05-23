import express from "express";
import bodyParser from "body-parser";
import cors from "cors"
import PG from "pg"
import 'dotenv/config'


const port = 3000;

const app = express();
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors());

const db = new PG.Client({
    user:"postgres",
    host:"localhost",
    database:"commit",
    port:5432,
    password:process.env.sqlpassword
})

db.connect()

app.get("/",async (req,res)=>{
    const joke =  await getData(req.query.extype);
    console.log(joke);
    res.send(joke);
})


app.listen(port,()=>{
    console.log("Server is runnig on ",port);
})

const getData = async(type)=>{
    console.log(type);
    try{
        let response;
        if(type == "Any")
            response = await db.query("select * from commit");
        else{
            response = await db.query("select * from commit where extype=$1",[type]);
        }
        
        if(response.rows.length == 0){
            return("No commit msg found")
        }
        
        return  response.rows[Math.floor(Math.random()*response.rows.length)].text;
        
    }
    catch(err){
        console.log("Error when connecting to database ||",err);
        return("Data base error");
    }
}