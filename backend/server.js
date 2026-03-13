import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import { connectDB } from './config/db.js';
import userRouter from './routes/user.route.js';


const app = express();
const port = process.env.PORT || 4000;


// Middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({extended: true}))

// DB
connectDB();

// Routes
app.use("/api/v1/user", userRouter);

app.get('/', (req,res) => {
  res.send("API Working !!")
})

app.listen(port, ()=> {
  console.log(`Server Started on http://localhost:${port}`);
  
})