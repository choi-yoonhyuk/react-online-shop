const express = require("express");
const router = express.Router();
const { User } = require("../models/User");
const { auth } = require("../middleware/auth");
const { Product } = require("../models/Product");
const { Payment } = require("../models/Payment");
const async = require("async");

//=================================
//             User
//=================================

router.get("/auth", auth, (req, res) => {
  // 미들웨어가 통과했다는 얘기는 auth가 true라는 말
  res.status(200).json({
    _id: req.user._id,
    // rold 0 -> 일반유저
    isAdmin: req.user.role === 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
    cart: req.user.cart,
    history: req.user.history,
  });
});

router.post("/register", (req, res) => {
  const user = new User(req.body);

  user.save((err, doc) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({
      success: true,
    });
  });
});

router.post("/login", (req, res) => {
  // 요청된 이메일을 데이터베이스에서 있는지 찾는다.
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user)
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다",
      });
    // 요청된 이메일이 데이터베이스에 있다면 맞는 비밀번호인지 확인
    user.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          loginSuccess: false,
          message: "비밀번호가 틀렸습니다",
        });

      // 비밀번호까지 맞다면 토큰을 생성하기
      user.generateToken((err, user) => {
        if (err) return res.status(400).send(err);
        res.cookie("w_authExp", user.tokenExp);
        res.cookie("w_auth", user.token).status(200).json({
          loginSuccess: true,
          userId: user._id,
        });
      });
    });
  });
});

router.get("/logout", auth, (req, res) => {
  User.findOneAndUpdate(
    { _id: req.user._id },
    { token: "", tokenExp: "" },
    (err, doc) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({
        success: true,
      });
    }
  );
});

router.post("/addToCart", auth, (req, res) => {
  // User Collection에 해당 유저의 정보를 가져오기

  User.findOne({ _id: req.user._id }, (err, userInfo) => {
    // 가져온 정보에서 Cart에 넣으려 하는 상품이 이미 들어있는지 확인

    let duplicate = false;
    userInfo.cart.forEach((item) => {
      if (item.id === req.body.productId) {
        duplicate = true;
      }
    });
    // 상품이 이미 있을때
    if (duplicate) {
      User.findOneAndUpdate(
        {
          _id: req.user._id,
          "cart.id": req.body.productId,
        },
        // quantity 1만큼 올리기
        { $inc: { "cart.$.quantity": 1 } },
        // 업데이트 정보를 받기위함
        { new: true },
        (err, userInfo) => {
          if (err) return res.status(400).json({ success: false, err });

          res.status(200).send(userInfo.cart);
        }
      );
    }
    // 상품이 이미 있지 않을때
    else {
      User.findOneAndUpdate(
        { _id: req.user._id },
        {
          $push: {
            cart: {
              id: req.body.productId,
              quantity: 1,
              date: Date.now(),
            },
          },
        },
        { new: true },
        (err, userInfo) => {
          if (err) return res.status(400).json({ success: false, err });

          res.status(200).send(userInfo.cart);
        }
      );
    }
  });
});

router.get("/removeFromCart", auth, (req, res) => {
  //먼저 cart안에 내가 지우려고 한 상품을 지워주기
  User.findOneAndUpdate(
    { _id: req.user._id },
    {
      $pull: { cart: { id: req.query.id } },
    },
    { new: true },
    (err, userInfo) => {
      let cart = userInfo.cart;
      let array = cart.map((item) => {
        return item.id;
      });

      //product collection에서  현재 남아있는 상품들의 정보를 가져오기

      //productIds = ['5e8961794be6d81ce2b94752', '5e8960d721e2ca1cb3e30de4'] 이런식으로 바꿔주기
      Product.find({ _id: { $in: array } })
        .populate("writer")
        .exec((err, productInfo) => {
          return res.status(200).json({
            productInfo,
            cart,
          });
        });
    }
  );
});

router.post("/successBuy", auth, (req, res) => {
  //1. User Collection 안에 history 필드안에 간단한 결제 정보 넣어주기
  let history = [];
  let transactionData = {};

  req.body.cartDetail.forEach((item) => {
    history.push({
      dateOfPurchase: Date.now(),
      name: item.title,
      id: item._id,
      price: item.price,
      quantity: item.quantity,
      paymentId: req.body.paymentData.paymentID,
    });
  });
  //2. Payment Collection안에 자세한 결제 정보들 넣어주기
  transactionData.user = {
    id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  };
  transactionData.data = req.body.paymentData;
  transactionData.product = history;

  //history 정보 저장
  User.findOneAndUpdate(
    { _id: req.user._id },
    { $push: { history: history }, $set: { cart: [] } },
    { new: true },
    (err, user) => {
      if (err) return res.json({ success: false, err });

      //payment에다가  transactionData정보 저장
      const payment = new Payment(transactionData);
      payment.save((err, doc) => {
        if (err) return res.json({ success: false, err });

        //3. Product Collection 안에 있는 sold 필드 정보 업데이트 시켜주기

        //상품 당 몇개의 quantity를 샀는지

        let products = [];
        doc.product.forEach((item) => {
          products.push({ id: item.id, quantity: item.quantity });
        });

        async.eachSeries(
          products,
          (item, callback) => {
            Product.update(
              { _id: item.id },
              {
                $inc: {
                  sold: item.quantity,
                },
              },
              { new: false },
              callback
            );
          },
          (err) => {
            if (err) return res.status(400).json({ success: false, err });
            res.status(200).json({
              success: true,
              cart: user.cart,
              cartDetail: [],
            });
          }
        );
      });
    }
  );
});

module.exports = router;
