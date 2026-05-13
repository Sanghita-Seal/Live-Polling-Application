import cookieParser from "cookie-parser";
import express from "express";
import authRoute from "./module/auth/auth.routes.js"
import ApiError from "./common/utils/api-error.js";
import pollRoute from "./module/poll/poll.routes.js"
import publicRoute from "./module/public/public.routes.js"

const app =express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use("/api/auth", authRoute);
app.use("/api/polls", pollRoute);
app.use("/api/public", publicRoute);

app.all("{*path}", (req,res)=>{
    throw ApiError.notFound(`Route ${req.originalUrl} not found`);
})
export default app;