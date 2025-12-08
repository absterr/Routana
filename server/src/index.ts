import { toNodeHandler } from "better-auth/node";
import express from "express";
import http from "http";
import path from "path";
import goalRoutes from "./goals/goal.controllers.js";
import { auth } from "./lib/auth.js";
import env from "./lib/env.js";

const rootDir = process.cwd();
const PORT = env.PORT;
const app = express();

app.use("/api/auth", toNodeHandler(auth))

app.use(express.json());
app.use("/api", goalRoutes);

app.use(express.static(path.join(rootDir, "client/dist/")));
app.use((_req, res) => {
  res.sendFile(path.join(rootDir, "client/dist/", "index.html"));
});

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}.`)
})
