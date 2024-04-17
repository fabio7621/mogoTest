const http = require("http");
const mongoose = require("mongoose");
const Room = require("./models/room");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const DB = process.env.DATABASE.replace(
  "<password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB)
  .then(() => {
    console.log("資料庫連線成功");
  })
  .catch((error) => {
    console.log(error);
  });

const requestListener = async (req, res) => {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk;
  });

  const headers = {
    "Access-Control-Allow-Headers":
      "Content-Type, Authorization, Content-Length, X-Requested-With",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "PATCH, POST, GET, OPTIONS, DELETE",
    "Content-Type": "application/json",
  };

  if (req.url == "/rooms" && req.method == "GET") {
    try {
      const rooms = await Room.find();
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: "success",
          rooms,
        })
      );
      res.end();
    } catch (error) {
      console.log(error);
      res.writeHead(500, headers);
      res.end();
    }
  } else if (req.url == "/rooms" && req.method == "POST") {
    req.on("end", async () => {
      try {
        const data = JSON.parse(body);
        const newRoom = await Room.create({
          name: data.name,
          price: data.price,
          rooms: data.rating,
        });
        res.writeHead(200, headers);
        res.write(
          JSON.stringify({
            status: "success",
            rooms: newRoom,
          })
        );
        res.end();
      } catch (error) {
        console.log(error);
        res.writeHead(500, headers);
        res.end();
      }
    });
  } else if (req.url === "/rooms" && req.method === "DELETE") {
    try {
      await Room.deleteMany({});
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: "success",
          rooms: [],
        })
      );
      res.end();
    } catch (error) {
      console.log(error);
      res.writeHead(500, headers);
      res.end();
    }
  } else if (req.url.startsWith("/rooms/") && req.method === "DELETE") {
    const roomId = req.url.split("/").pop();
    try {
      const room = await Room.findByIdAndDelete(roomId);
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: "success",
          room,
        })
      );
      res.end();
    } catch (error) {
      console.log(error);
      res.writeHead(500, headers);
      res.end();
    }
  }else if (req.url.startsWith("/rooms/") && req.method === "PATCH") {
    const roomId = req.url.split("/").pop();
    try {
      const data = JSON.parse(body);
      const updatedRoom = await Room.findByIdAndUpdate(
        roomId,
        { $set: data }
      );
      res.writeHead(200, headers);
      res.write(
        JSON.stringify({
          status: "success",
          room: updatedRoom,
        })
      );
      res.end();
    } catch (error) {
      console.log(error);
      res.writeHead(500, headers);
      res.end();
    }
  }else if (req.method === "OPTIONS") {
    res.writeHead(200, headers);
    res.end();
  } else {
    res.writeHead(404, headers);
    res.write(
      JSON.stringify({
        status: "false",
        message: "無此網站路由",
      })
    );
    res.end();
  }
};

const server = http.createServer(requestListener);
server.listen(process.env.PORT || 3005);
