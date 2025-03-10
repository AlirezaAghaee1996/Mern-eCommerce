import jwt from "jsonwebtoken";
import User from "../Models/UserMd.js";
import catchAsync from "../Utils/catchAsync.js";
import HandleERROR from "../Utils/handleError.js";
import { sendAuthCode, verifyCode } from "../Utils/smsHandler.js";
import bcryptjs from "bcryptjs";
export const auth = catchAsync(async (req, res, next) => {
  const { phoneNumber = null } = req.body;
  if (!phoneNumber) {
    return next(new HandleERROR("phone is required", 400));
  }
  const user = await User.findOne({ phoneNumber });
  if (user && user?.password) {
    return res.status(200).json({
      success: true,
      newAccount: false,
      password: true,
    });
  } else {
    const resultSms = await sendAuthCode(phoneNumber);
    if (resultSms?.success) {
      return res.status(200).json({
        success: true,
        newAccount: user?._id ? false : true,
        password: false,
        message: "code sent",
      });
    } else {
      return res.status(404).json({
        success: false,
        newAccount: user?._id ? false : true,
        password: false,
        message:resultSms.message,
      });
    }
  }
});
export const checkOtp = catchAsync(async (req, res, next) => {
  const { phoneNumber = null, code = null, newAccount = "unknown" } = req.body;
  if (!phoneNumber || !code || newAccount == "unknown") {
    return next(
      new HandleERROR("phone and newAccount and password is required", 400)
    );
  }
  const verifyResult = await verifyCode(phoneNumber, code);
  if (!verifyResult.success) {
    return next(new HandleERROR("invalid code", 400));
  }
  let user;
  
  if (newAccount=='true') {
    user = await User.create({ phoneNumber });
  } else {
    user = await User.findOne({ phoneNumber });
  }
  const token = jwt.sign(
    { id: user._id, role: user.role, phoneNumber: user.phoneNumber },
    process.env.JWT_SECRET
  );
  return res.status(200).json({
    success: true,
    data: {
      user: {
        phoneNumber,
        id: user._id,
        role: user.role,
        favoriteProduct: user?.favoriteProduct,
        fullName: user?.fullname,
      },
      token,
    },
    message: newAccount=='true' ? "register successfully" : "login successfully",
  });
});
export const checkPassword = catchAsync(async (req, res, next) => {
  const { phoneNumber = null, password = null } = req.body;
  if (!phoneNumber || !password) {
    return next(new HandleERROR("phone and password is required", 400));
  }
  const user = await User.findOne({ phoneNumber });
  if (!user) {
    return next(new HandleERROR("user not found", 400));
  }
  const validPassword = bcryptjs.compareSync(password, user?.password);
  if (!validPassword) {
    return next(new HandleERROR("password incorrect", 400));
  }
  const token = jwt.sign(
    { id: user._id, role: user.role, phoneNumber: user.phoneNumber },
    process.env.JWT_SECRET
  );
  return res.status(200).json({
    success: true,
    data: {
      user: {
        phoneNumber,
        id: user._id,
        role: user.role,
        favoriteProduct: user?.favoriteProduct,
        fullName: user?.fullname,
      },
      token,
    },
    message: "login successfully",
  });
});
export const forgetPassword = catchAsync(async (req, res, next) => {
  const { phoneNumber = null, code = null, password = null } = req.body;
  if (!phoneNumber || !code || !password) {
    return next(
      new HandleERROR("phone and code and password is required", 400)
    );
  }
  const verifyResult = await verifyCode(phoneNumber, code);
  if (!verifyResult.success) {
    return next(new HandleERROR("invalid code", 400));
  }
  const regexPass = new RegExp(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/);
  if (!regexPass.test(password)) {
    return next(new HandleERROR("invalid password", 400));
  }
  const hashPassword = bcryptjs.hashSync(password, 10);
  const user = await User.findOneAndUpdate(
    { phoneNumber },
    { password: hashPassword }
  );
  if(!user?._id){
    return next(new HandleERROR("user not found", 400));

  }
  const token = jwt.sign(
    { id: user._id, role: user.role, phoneNumber: user.phoneNumber },
    process.env.JWT_SECRET
  );
  return res.status(200).json({
    success: true,
    data: {
      user: {
        phoneNumber,
        id: user._id,
        role: user.role,
        favoriteProduct: user?.favoriteProduct,
        fullName: user?.fullname,
      },
      token,
    },
  });
});
export const resendCode = catchAsync(async (req, res, next) => {
  const { phoneNumber = null } = req.body;
  if (!phoneNumber) {
    return next(new HandleERROR("phone is required", 400));
  }
  const resultSms = await sendAuthCode(phoneNumber);
  return res.status(200).json({
    success: resultSms.success,
    message: resultSms.success ? "code sent" : resultSms?.message,
  });
});

export const adminLogin=catchAsync(async(req,res,next)=>{
  const { phoneNumber = null, password = null } = req.body;

  if (!phoneNumber || !password) {
    return next(new HandleERROR("phone and password is required", 400));
  }
  const user = await User.findOne({ phoneNumber });
  if (!user) {
    return next(new HandleERROR("user not found", 400));
  }
  if (user.role !='admin') {
    return next(new HandleERROR("you do not have permission", 401));
  }
  const validPassword = bcryptjs.compareSync(password, user?.password);
  if (!validPassword) {
    return next(new HandleERROR("password incorrect", 401));
  }
  const token = jwt.sign(
    { id: user._id, role: user.role, phoneNumber: user.phoneNumber },
    process.env.JWT_SECRET
  );
  return res.status(200).json({
    success: true,
    data: {
      user: {
        phoneNumber,
        id: user._id,
        role: user.role,
        fullName: user?.fullname,
      },
      token,
    },
    message: "login successfully",
  });
})