import express from "express";
import http from "http";
import goalRoutes from "./goals/goal.controller.js";
import env from "./lib/env.js";
import { auth } from "./lib/auth.js";
import { toNodeHandler } from "better-auth/node";

const PORT = env.PORT;
const app = express();
app.use("/api/auth", toNodeHandler(auth))

app.use(express.json());
app.use("/api", goalRoutes);

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}.`)
})
