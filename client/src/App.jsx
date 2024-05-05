import React, { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const App = () => {
  const socket = useMemo(
    () => io("http://localhost:8000", { withCredentials: true }),
    []
  );
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [room, setRoom] = useState("");
  const [socketId, setSocketId] = useState("");
  const [roomName, setRoomName] = useState("");

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("Connected", socket.id);
    });

    socket.on("receive-message", (msg) => {
      console.log(msg);
      setMessages((prev) => [...prev, msg]);
    });

    socket.on("welcome", (s) => [console.log(s)]);

    return () => {
      socket.disconnect();
    };
  }, []);

  const onHandleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
    setMessage("");
  };

  const onHandleJoin = (e) => {
    e.preventDefault();
    socket.emit("join-room", roomName);
    setRoomName("");
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ height: 200 }} />
      <Typography variant="h6" component="div" gutterBottom>
        {socketId}
      </Typography>
      <form onSubmit={onHandleJoin}>
        <TextField
          id="ulined-basic"
          label="RoomName"
          variant="outlined"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
        ></TextField>
        <Button variant="outlined" color="primary" type="submit">
          Join
        </Button>
      </form>
      <form onSubmit={onHandleSubmit}>
        <TextField
          id="ulined-basic"
          label="Outlined"
          variant="outlined"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></TextField>
        <TextField
          id="ulined-basic"
          label="Room"
          variant="outlined"
          value={room}
          onChange={(e) => setRoom(e.target.value)}
        ></TextField>
        <Button variant="outlined" color="primary" type="submit">
          Submit
        </Button>
      </form>

      <Typography>Messages List</Typography>
      <Stack>
        {messages.map((msg, i) => {
          return (
            <Typography key={i} gutterBottom variant="h6">
              {msg}
            </Typography>
          );
        })}
      </Stack>
    </Container>
  );
};

export default App;
