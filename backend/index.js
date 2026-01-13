import 'dotenv/config';
import connectDB from "./db/index.js";
import { app } from './app.js';

connectDB()
.then(() => {
    app.listen(process.env.PORT || 8000 , () => {
        console.log(`Server is running at port:${process.env.PORT}`)
    })
    app.on("error",(err)=>{
        console.log(err);
        process.exit(1);
    })
})
.catch((err) => {
    console.log("MongoDB connection failed !!!", err);
})

