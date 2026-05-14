import cookieParser from "cookie-parser";
import express from "express";
import authRoute from "./module/auth/auth.routes.js"
import ApiError from "./common/utils/api-error.js";
import pollRoute from "./module/poll/poll.routes.js"
import publicRoute from "./module/public/public.routes.js"
import voteRoute from "./module/vote/vote.routes.js";


const app =express();
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.get("/api/health", (req, res) => {
  res.status(200).json({ status: "ok" });
});
app.use("/api/auth", authRoute);
app.use("/api/polls", pollRoute);
app.use("/api/public", publicRoute);
app.use("/api/votes", voteRoute);


app.all("{*path}", (req,res)=>{
    throw ApiError.notFound(`Route ${req.originalUrl} not found`);
})
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: err.message || "Internal Server Error",
  });
});

export default app;
