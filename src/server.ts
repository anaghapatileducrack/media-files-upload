import mongoose from 'mongoose';
import app from './app';
require('dotenv').config()

mongoose.connect("mongodb://localhost:27017/Multer", {useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true})
.then(() => console.log("Successfully connected to the following database"))
.catch((err:Error) => {
   console.log(err);
});

//mongoose.set('useFindAndModify', false);
const port  = process.env.PORT || 4000;

// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to multer video upload application." });
});

const server = app.listen(port, ()=> {
   console.log(`Server is running on port: ${port}`);
});
export  {server as server};
