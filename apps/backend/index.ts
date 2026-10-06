import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import loginRoutes from "./routes/login";
import organizationRoutes from "./routes/organization";
import membershipRoutes from "./routes/membership";
import boardRoutes from "./routes/boards";
import sectionRoutes from  "./routes/section";
import issueRoutes from "./routes/issue";
import commentRoutes from "./routes/comment";
dotenv.config({path:__dirname+"/.env"});
const app=express();

const allowedOrigins = [
  'http://localhost:5173',
  'https://trello-csvu.vercel.app',
  process.env.FRONTEND_URL,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      /\.vercel\.app$/.test(origin)
    ) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));

app.use(express.json())

app.use("/",loginRoutes);
app.use("/organization",organizationRoutes);
app.use("/",membershipRoutes);
app.use("/board",boardRoutes);
app.use("/section",sectionRoutes);
app.use("/issue",issueRoutes);
app.use("/comment",commentRoutes);

app.listen(3000,()=>console.log("Backend server started on port 3000"));