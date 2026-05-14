import "dotenv/config";
import http from "http";
import { Server } from "socket.io";
import app from "./src/app.js";
import connectDB from "./src/common/config/db.js";
import { expireActivePolls } from "./src/module/poll/poll-expiry.service.js";
import { Poll } from "./src/module/poll/poll.model.js";
import { verifyAcccessToken } from "./src/common/utils/jwt.utils.js";

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

    const httpServer = http.createServer(app);
    const allowedOrigins = [
        process.env.FRONTEND_URL,
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ].filter(Boolean);

    const io = new Server(httpServer, {
        cors: {
            origin(origin, callback) {
                if (!origin || allowedOrigins.includes(origin)) {
                    callback(null, true);
                    return;
                }

                callback(new Error("Socket origin not allowed"));
            },
            credentials: true,
        },
    });

    app.set("io", io);

    io.on("connection", (socket) => {
        socket.on("join-poll-room", async (pollId) => {
            try {
                const token = socket.handshake.auth?.token;

                if (!token) {
                    socket.emit("poll-room-error", "Authentication required");
                    return;
                }

                const decoded = verifyAcccessToken(token);
                const poll = await Poll.findOne({ _id: pollId, createdBy: decoded.id });

                if (!poll) {
                    socket.emit("poll-room-error", "You cannot view realtime updates for this poll");
                    return;
                }

                socket.join(`poll:${pollId}`);
                socket.emit("poll-room-joined", { pollId });
            } catch {
                socket.emit("poll-room-error", "Realtime connection could not be authorized");
            }
        });

        socket.on("leave-poll-room", (pollId) => {
            socket.leave(`poll:${pollId}`);
        });
    });

    httpServer.listen(PORT,()=>{
        console.log(`Server is listening at ${PORT} in the ${process.env.NODE_ENV}`);

    })
}
start().catch((err)=>{
    console.error("Failed to start server", err);
    process.exit(1);
    
})
