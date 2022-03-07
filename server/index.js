const express = require("express");
const app = express();
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const MongoClient = require("mongoose");

MongoClient.connect(
  `mongodb+srv://Choi:zpqls213@cluster0.lui3i.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  }
).then(() => {
  console.log("DB Connect");
});

app.get("/", (req, res) => res.send("반가워"));

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));

app.use(bodyParser.json());
app.use(cookieParser());

app.use("/api/users", require("./routes/users"));
app.use("/api/product", require("./routes/product"));

app.use("/uploads", express.static("uploads"));
app.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
  });
});

// 모든 JS와 CSS 파일 같은 static한 파일들은 이곳에서 처리된다.
if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

const port = process.env.PORT || 4000;

app.listen(port);
