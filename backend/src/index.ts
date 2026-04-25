import express from "express";
import {ENV} from "./config/env";
import cors from "cors";

import { clerkMiddleware } from '@clerk/express';



const app = express();



app.use(cors({origin: ENV.FRONTEND_URL})); 
app.use(clerkMiddleware()); // auth object will be attached to the object
app.use(express.json());  //parses json requested bodies
app.use(express.urlencoded({extended: true})); // parses form data like html forms



app.get("/", (req, res) => {

    const {title, imgURL, desc} = req.body;
    res.json({
        message: "Welcome to Productify API",
        endpoints: {
            users: "/api/users",
            products: "/api/products",
            comments: "/api/comments"

        }
       
    })
});


app.listen(ENV.PORT, ()=> {
    console.log(`App is running on PORT: ${ENV.PORT}`);
    
   
});