import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import { ApiError } from "./utils/apiError.js";

import authRouter from "./routes/auth.routes.js";
import professionalRouter from "./routes/professional.routes.js";
import serviceRouter from "./routes/service.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import reviewRouter from "./routes/review.routes.js";
import paymentRouter from "./routes/payment.routes.js";

const app = express();


app.use(
    cors({
        origin:
            process.env.CORS_ORIGIN ||
            "http://localhost:5173",
        credentials: true,
    })
);

app.use(
    express.json({
        limit: "16kb",
    })
);

app.use(
    express.urlencoded({
        extended: true,
        limit: "16kb",
    })
);

app.use(express.static("public"));

app.use(cookieParser());

console.log("🔥 HIREPRO APP.JS LOADED");

app.get("/", (req, res) => {
    res.status(200).send(
        "HirePro Backend is Working!"
    );
});

app.get("/api/v1/health", (req, res) => {
    res.status(200).json({
        success: true,
        message: "HirePro API is running",
    });
});

app.use(
    "/api/v1/auth",
    authRouter
);


app.use(
    "/api/v1/professional",
    professionalRouter
);


app.use(
    "/api/v1/service",
    serviceRouter
);


app.use(
    "/api/v1/booking",
    bookingRouter
);


app.use(
    "/api/v1/review",
    reviewRouter
);


app.use(
    "/api/v1/payment",
    paymentRouter
);

app.use((req, res, next) => {
    next(
        new ApiError(
            404,
            "Route not found"
        )
    );
});


app.use(
    (err, req, res, next) => {

        const statusCode =
            err.statusCode || 500;

        res.status(statusCode).json({
            success: false,
            message:
                err.message ||
                "Internal server error",
            errors: err.errors || [],
        });
    }
);


export { app };