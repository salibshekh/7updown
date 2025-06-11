const queryModel = require("../models/queryHelper");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { successResponse } = require("../utils/responseHelper");
const {TABLES} = require('../common/constant')


exports.signUp = async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    // Validate input
    if (!email || !password || !firstName || !lastName)
      throw { message: "All fields are required!", statusCode: 200 };

    // Check if email already exists
    const existingUser = await queryModel.findOne(TABLES.USERS, { email });
    if (existingUser)
      throw { message: "Email already exists", statusCode: 200 };

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert new user
    const result = await queryModel.insert(TABLES.USERS, {
      email,
      password: hashedPassword,
      firstName,
      lastName,
      balance: 1000.00, 
    });

    
    const payload = { id: result.insertId, email };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d"
    });

    const respData = {
      userId: result.insertId,
      email,
      token
    };

    return successResponse(res, respData, "Sign-up successful");

  } catch (error) {
    console.error("SignUp Error:", error);
    next(error);
  }
};

exports.signIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) throw ({message : "Email or Password is required!", statusCode : 200})
     
    const user = await queryModel.findOne(TABLES.USERS, { email });
    if (!user) throw ({message : "User not found", statusCode : 200})

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw ({message : "Password doesn't match our record", statusCode : 200})

    // JWT payload (avoid sending full user)
    const payload = {
      id: user.id,
      email: user.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN || "1d"
    });

    let respData = {
        userId : user.id,
        email: user.email,
        token
    }

    return successResponse(res, respData, "Sign-in successful");

  } catch (error) {
    console.error("SignIn Error:", error);
    next(error);
  }
};
