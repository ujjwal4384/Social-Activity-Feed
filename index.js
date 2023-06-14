const express = require('express');
const app = express();
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const helmet=require('helmet');
const morgan=require('morgan');
const userRoute=require('./routes/users');
const authRoute=require('./routes/auth');
const postRoute=require('./routes/posts');
const activityRoute=require('./routes/activities');
const PORT= process.env.PORT || 8800;
dotenv.config();

// Database connection
mongoose.connect(`${process.env.MONGO_URL}`, {useNewUrlParser: true, useUnifiedTopology: true})
.then(()=>{
    console.log("MongoDB connected");
}).catch(error=>console.log(error));


// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));



// Routes
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/posts", postRoute);
app.use("/api/activities", activityRoute); 

app.get("/",(req,res)=>{
   res.send("Welcome to my Social Activity Feed homepage"); 
})



app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})