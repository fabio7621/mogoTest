const http = require("http");
const mongoose = require("mongoose");
const Room = require("./models/room");

const dotenv =require("dotenv")
dotenv.config({path:"./config.env"})
//process.env.PORT

const DB =process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD
)
// 連接資料庫
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
    "Access-Control-Allow-Methods": "PATCH, POST, GET,OPTIONS,DELETE",
    "Content-Type": "application/json",
  };
  if (req.url == "/rooms" && req.method == "GET") {
    const rooms = await Room.find();
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        "status": "success",
        rooms,
      })
    );
    
    // Room.findOneAndDelete("660a68623a65aaa80b9f9910").then(() => {
    //   console.log("刪除成功");
    // });
    // Room.findByIdAndUpdate("660d1da89284f9db2dcb4431",{
    //   "name":"皮克斯四人房"
    // }).then(()=>{
    //   console.log("更新成功");
    // })
    res.end();
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
            "status": "success",
            "rooms": newRoom,
          })
        );
        res.end();
      } catch (error) {
        console.log(error);
        res.end();
      }
    });
  } else if ((req.url = "/rooms" && req.method == "DELETE")) {
    await Room.deleteMany({});
    res.writeHead(200, headers);
    res.write(
      JSON.stringify({
        "status": "success",
        rooms: [],
      })
    );
    res.end();
  } else if (req.method == "OPTIONS") {
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
server.listen(process.env.PORT);
