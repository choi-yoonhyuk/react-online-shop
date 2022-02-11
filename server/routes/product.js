const express = require("express");
const multer = require("multer");
const router = express.Router();
const { Product } = require("../models/Product");

//=================================
//             Product
//=================================

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, `${Date.now()}_${file.originalname}` + "-" + uniqueSuffix);
  },
});

const upload = multer({ storage: storage }).single("file");

router.post("/image", (req, res) => {
  // 가져온 이미지를 저장 해주면 된다.

  upload(req, res, (err) => {
    if (err) {
      return res.json({ success: false, err });
    }
    return res.json({
      success: true,
      filePath: res.req.file.path,
      fileName: res.req.file.filename,
    });
  });
});

router.post("/", (req, res) => {
  // 받아온 정보들을 DB에 저장한다.
  const product = new Product(req.body);
  product.save((err) => {
    if (err) return res.status(400).json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

router.post("/products", async (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 20;
  let skip = req.body.skip ? parseInt(req.body.skip) : 0;

  let term = req.body.searchTerm;

  let findArgs = {};

  for (let key in req.body.filters) {
    if (req.body.filters[key].length > 0) {
      if (key === "price") {
        findArgs[key] = {
          // Mongo DB

          //Greater than equal  ex) 200
          $gte: req.body.filters[key][0],
          //Less than equal  ex) 249
          $lte: req.body.filters[key][1],
        };
      } else {
        findArgs[key] = req.body.filters[key];
      }
    }
  }

  console.log("findArgs", findArgs);

  // product collection에 들어 있는 상품 정보를 가져오기
  if (term) {
    try {
      const productInfo = await Product.find(findArgs)
        // Mongo DB
        .find({ $text: { $search: term } })
        .populate("writer")
        .skip(skip)
        .limit(limit);
      return res
        .status(200)
        .json({ success: true, productInfo, postSize: productInfo.length });
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }
  } else {
    try {
      const productInfo = await Product.find(findArgs)
        .populate("writer")
        .skip(skip)
        .limit(limit);
      return res
        .status(200)
        .json({ success: true, productInfo, postSize: productInfo.length });
    } catch (error) {
      return res.status(400).json({ success: false, error });
    }
  }
});

router.get("/products_by_id", (req, res) => {
  let type = req.query.type; // single
  let productIds = req.query.id; // 4125125125125

  if (type === "array") {
    //id=123123123,324234234,324234234 이거를
    //productIds = ['123123123', '324234234', '324234234'] 이런식으로 바꿔주기
    let ids = req.query.id.split(",");
    productIds = ids.map((item) => {
      return item;
    });
  }

  //productId를 이용해서 DB에서 productId와 같은 상품의 정보를 가져온다.

  Product.find({ _id: { $in: productIds } })
    .populate("writer")
    .exec((err, product) => {
      if (err) return res.status(400).send(err);
      return res.status(200).send(product);
    });
});

module.exports = router;
