import http from "http";

const PORT = 4000;
const server = http.createServer();

server.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}.`)
})
