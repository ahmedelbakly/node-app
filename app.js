import express from "express";
import dotenv from "dotenv";
import connectDB from "./DB/connect-to-DB.js";
dotenv.config();
import userRouter from "./routes/user-route.js";
import taskRouter from "./routes/task-route.js";
import authRouter from "./routes/auth-route.js";
import cors from "cors";

const port = process.env.PORT || 3000;

// create express app
const app = express();
// set port
// create basic express server
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// enable cors    
app.use(cors({
  origin: "*",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type,Authorization",
}));

connectDB();
app.get("/", (req, res) => {
  res.send("Hello World!");
});
//
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/task", taskRouter);

// handle 404
app.use((req, res) => {
  res.status(404).send("Route not found");
}
);

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
