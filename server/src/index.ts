import express from "express";
import http from "http";
import goalRoutes from "./goals/goal.controller.js";
import env from "./lib/env.js";

const PORT = env.PORT;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", goalRoutes);

const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}.`)
})
