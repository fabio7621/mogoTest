const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema(
  {
    name: String,
    price: {
      type: Number,
      require: [true, "價格必填"],
    },
    rating: Number,
    createdAt: {
      type: Date,
      default: Date.now,
      select: false, //可以在shell使用find的時候不顯示出來
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

const Room = mongoose.model("Room", roomSchema);

module.exports = room;
//把room modal 傳出去外面就能直接使用
