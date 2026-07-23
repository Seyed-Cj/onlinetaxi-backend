const { io } = require("socket.io-client");

const PASSENGER_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1dCI6IlBBU1NFTkdFUiIsImFpZCI6IjE2Y2QyZGQyLWI0ZGYtNDI3NS04NmY4LTFiMzI5OGUwMzI4MiIsInNpZCI6IjQyNTI5MjlkLTI2NWMtNDg5Yy1iMTMxLTIxZjI3ZGJjN2NiNyIsImFlYSI6MTc4NDYxMTE1MzI5NCwicmVhIjoxNzg1MjE1MDUzMjk0LCJpYXQiOjE3ODQ2MTAyNTMsImV4cCI6MTc4NDYxMTE1M30.4gU-6m3rJYtKP3BMLhLyZTn4BaVcVAbN3t6z6cSn66Q";

const socket = io("http://localhost:3000", {
  auth: {
    token: PASSENGER_TOKEN,
  },
});

socket.on("connect", () => {
  console.log("connected");
});

socket.on("trip:accepted", (trip) => {
  console.log("trip accepted:", trip.driverId);
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
