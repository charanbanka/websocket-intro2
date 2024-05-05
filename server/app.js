import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
import jwt from "jsonwebtoken";
import cookieParser from "cookie-parser";

const port = 8000;
const secretJwtkey = "765hnhbyhg6787hngy";
const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.get("/login", (req, res) => {
  const token = jwt.sign({ _Id: "gf8767jhuytjh876r36736by73" }, secretJwtkey);

  res
    .cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" })
    .json({ message: "Login Success" });
});

const user = false;
io.use((socket, next) => {
  cookieParser()(socket.request, socket.request.res, (err)=>{
    if(err)  return next(err);
    const token = socket.request.cookies.token;
    if(!token)  return next(new Error("Authentication error"))
    const decode = jwt.verify(token,secretJwtkey)
    if(!decode)  next(new Error("Authentication error"))
    next()
  })
});

io.on("connection", (socket) => {
  console.log("User connected", socket.id);

  socket.on("message", ({ room, message }) => {
    console.log("msg=>", room, message);
    socket.to(room).emit("receive-message", message);
  });

  socket.on("join-room", (roomName) => {
    console.log("user joined room ", roomName);
    socket.join(roomName);
  });

  socket.on("disconnect", () => {
    console.log("disconnecetd", socket.id);
  });
});

server.listen(port, () => {
  console.log("server running at port %s", port);
});
