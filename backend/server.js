import "dotenv/config";
import app from "./src/app.js";
import connectDB from "./src/common/config/db.js";
import { expireActivePolls } from "./src/module/poll/poll-expiry.service.js";

const PORT=process.env.PORT || 8080;
const start = async()=>{
    await connectDB();
    await expireActivePolls();

    const expiryInterval = setInterval(() => {
        expireActivePolls().catch((err) => {
            console.error("Failed to expire polls", err);
        });
    }, 60 * 1000);
    expiryInterval.unref?.();

    app.listen(PORT,()=>{
        console.log(`Server is listening at ${PORT} in the ${process.env.NODE_ENV}`);

    })
}
start().catch((err)=>{
    console.error("Failed to start server", err);
    process.exit(1);
    
})
