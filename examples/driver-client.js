const { io } = require("socket.io-client");

const DRIVER_TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dCI6IkRSSVZFUiIsImFpZCI6IjNmY2QwNjVjLTFlMjItNDdjNS1iOTllLTlmNDE3NmZlZjA3MyIsInNpZCI6ImUwYTM3OTc3LWZjZGMtNDAzYi1iNmNmLWUzZjBlNTJlZDIxNCIsImFlYSI6MTc4NDYwOTkxNjY1MSwicmVhIjoxNzg1MjEzODE2NjUxLCJpYXQiOjE3ODQ2MDkwMTYsImV4cCI6MTc4NDYwOTkxNn0.oLFypI7M57LdgFVXfZIdB8J-fAuiAr2J8v01UYLpMz8";

const socket = io("http://localhost:3000", {
  auth: {
    token: DRIVER_TOKEN,
  },
});

socket.on("connect", () => {
  console.log("connected");

  setInterval(() => {
    const lat = 948.5 + Math.random() * 0.01;
    const lng = 1100.2 + Math.random() * 0.01;

    socket.emit("driver:location", { lat, lng });
    console.log("send location", { lat, lng });
  }, 5000);
});

socket.on("trip:new", (trip) => {
  console.log("new trip:", trip);
});

socket.on("trip:accepted", (trip) => {
  console.log("trip accepted:", trip);
});

socket.on("trip:driver_arrived", (data) => {
  console.log("driver arrived:", data.driverId);
});

socket.on("trip:started", (data) => {
  console.log("trip started:", data.driverId);
});

socket.on("trip:finished", (data) => {
  console.log("trip finished:", data.driverId);
});

socket.on("disconnect", () => {
  console.log("disconnected");
});

socket.on("connect_error", (error) => {
  console.log(error.message);
});
