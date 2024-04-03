const { error } = require("console");
const http = require("http");
const mongoose = require("mongoose");
const { version } = require("os");

//連接資料庫
mongoose
  .connect("mongodb://localhost:27017/hotel")
  .then(() => {
    console.log("資料庫連線成功");
  })
  .catch((error) => {
    console.log(error);
  });

//實例 實體    instance
const testRoom = new Room({
  name: "無敵海景雙人房",
  price: 2070,
  rating: 4.5,
});
//儲存
testRoom
  .save()
  .then(() => {
    console.log("新增資料成功");
  })
  .catch((error) => {
    console.log(error);
  });

const requestListener = (req, res) => {
  console.log(req);
  res.end();
};

const server = http.createServer(requestListener);
server.listen(3005);
