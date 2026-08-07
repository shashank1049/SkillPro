import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { ApiError } from "./utils/apiError.js";
import authRouter from "./routes/auth.routes.js";
import professionalRouter from "./routes/professional.routes.js"
import serviceRouter from "./routes/service.routes.js"
import bookingRouter from "./routes/booking.routes.js"

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN || "http://localhost:3000",
    credentials: true
}))

app.use(express.json({limit: "16kb"}));
app.use(express.urlencoded({extended: true, limit: "16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

app.get("/api/v1/health", (req, res) => {
    res.status(200).json({ success: true, message: "SkillPro API is running" });
});

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/professional", professionalRouter);
app.use("/api/v1/service", serviceRouter)
app.use("/api/v1/booking", bookingRouter)

app.use((req, res, next) => {
    next(new ApiError(404, "Route not found"));
});

app.use((err, req, res, next) => {
    // console.error("ERROR:", err);
    // console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        message: err.message || "Internal server error",
        errors: err.errors || [],
    });
});

export {app}
