const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
// 10자리인 salt를 생성
const saltRounds = 10;
const jwt = require("jsonwebtoken");
const moment = require("moment");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    // 스페이스를 없애주는 효과
    trim: true,
    // 같은 이메일 사용X
    unique: 1,
  },
  password: {
    type: String,
    minglength: 5,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  role: {
    type: Number,
    default: 0,
  },
  cart: {
    type: Array,
    default: [],
  },
  history: {
    type: Array,
    default: [],
  },
  image: String,
  // 유효성 관리
  token: {
    type: String,
  },

  // 토큰 유효기간
  tokenExp: {
    type: Number,
  },
});

userSchema.pre("save", function (next) {
  let user = this;

  //패스워드가 변화될때
  if (user.isModified("password")) {
    // 비밀번호를 암호화 시킨다.
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);

      bcrypt.hash(user.password, salt, function (err, hash) {
        if (err) return next(err);
        //암호화를 성공 했으면 처리
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, function (err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function (cb) {
  // jsonwebtoken을 이용해서 token을 생성하기
  let user = this;

  let token = jwt.sign(user._id.toHexString(), "secret");
  let oneHour = moment().add(1, "hour").valueOf();

  user.tokenExp = oneHour;
  user.token = token;
  user.save(function (err, user) {
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  let user = this;

  // 토큰을 decode 한다.
  jwt.verify(token, "secret", function (err, decode) {
    //유저 아이디를 이용해서 유저를 찾은다음
    // 클라이언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인
    user.findOne({ _id: decode, token: token }, function (err, user) {
      if (err) return cb(err);
      cb(null, user);
    });
  });
};

const User = mongoose.model("User", userSchema);

module.exports = { User };
