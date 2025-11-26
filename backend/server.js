
const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');

app.use(cors());
app.use(express.json());

const SECRET = "secret123";

let users = [
 { id:1, username:"gestor", password:"123", role:"gestor"},
 { id:2, username:"colaborador", password:"123", role:"colaborador"}
];

let tasks = [];

app.post('/login', (req,res)=>{
 const {username,password}=req.body;
 const user = users.find(u=>u.username===username && u.password===password);
 if(!user) return res.status(401).json({error:"invalid"});
 const token = jwt.sign({id:user.id, role:user.role}, SECRET);
 res.json({token, role:user.role});
});

function auth(req,res,next){
 const h=req.headers.authorization;
 if(!h) return res.status(401).end();
 try{
  req.user=jwt.verify(h.split(" ")[1],SECRET);
  next();
 }catch(e){return res.status(401).end();}
}

app.get('/tasks', auth, (req,res)=> res.json(tasks));

app.post('/tasks', auth, (req,res)=>{
 if(req.user.role!=="gestor") return res.status(403).end();
 tasks.push({id:Date.now(), ...req.body});
 res.json({ok:true});
});

app.listen(3000, ()=>console.log("Server running"));
