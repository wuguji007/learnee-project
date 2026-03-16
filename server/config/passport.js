const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models').user;


// 從cookie提取token
const cookieExtractor = (req) => {
  let token = null;
  if (req && req.cookies) {
    token = req.cookies["jwt"];
  }
  return token;
};


module.exports = (passport) => {
  let opts = {};
  // opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("jwt");
  opts.jwtFromRequest = cookieExtractor; // 改用cookieExtractor
  opts.secretOrKey = process.env.PASSPORT_SECRET;

  passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {
      console.log("Passport 正在驗證 Payload:", jwt_payload);

      try {
        let foundUser = await User.findOne({ _id: jwt_payload._id }).exec();

        if (foundUser) {
          console.log('驗證成功，找到使用者:', foundUser);
          return done(null, foundUser);
        } else {
          console.log('驗證失敗，找不到使用者');  
          return done(null, false);
        }
      } catch (error) {
        console.log('驗證過程中發生錯誤:', error);
        return done(error, false);
      }
    })
  );
};