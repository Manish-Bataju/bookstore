import { response } from "express";
import User from "../schema/userModel.js";
import generateToken from "../utils/jwtGenerator.js";

//Route for user login
const userLogin = async (req, res) => {
  console.log("LOGIN ATTEMPT:", req.body);
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  try {
    if (user && (await user.matchPassword(password))) {
      return res.json({
        _id: user._id,
        name: user.fullName,
        userName: user.userName,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      return res.status(401).json({ message: "Invalid Email or Password" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//Router for User Registration
const userRegistration = async (req, res) => {
  const {
    firstName,
    middleName,
    lastName,
    email,
    password,
    isShop,
    shopName,
    mobileNo,
    panNumber,
  } = req.body;

  try {
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }
    //assigning the user role ... those who has shop is given admin status
    const role = isShop === true ? "admin" : "user";

    // create a user
    const user = await User.create({
      firstName,
      middleName: middleName || "",
      lastName,
      email,
      password,
      mobileNo,
      isShop: isShop || false,
      role,
      shopName: isShop ? shopName : "",
      panNumber: isShop ? panNumber : "",
    });

    if (user) {
      //if User then common fields to display
      const responseData = {
        id: user._id,
        name: user.fullName,
        username: user.userName,
        role: user.role,
        token: generateToken(user._id),
      };

      // if they are admin when we will add on extra details
      if (user.role === "admin") {
        responseData.shopName = user.shopName;
        responseData.panNumber = user.panNumber;
      }
      return res.status(201).json({ responseData });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

//route for Admin Login
const adminLogin = async (req, res) => {
  const { email, password, shopName } = req.body;

  try {
    //if the user is found then admin is assigned.
    const admin = await User.findOne({ email });

    //check if the admin exists or not
    if (!admin) {
      return res.status(400).json({
        success: false,
        message: "No account found with this email address",
      });
    }

    // 3. Verify: Is this user an admin AND does the shopName match their record?
    if (admin.role !== "admin" || admin.shopName !== shopName) {
      return res.status(401).json({
        success: false,
        message: "Authentication failed: Shop name does not match this account",
      });
    }

    //verify the password
    if (await admin.matchPassword(password)) {
      return res.status(200).json({
        id: admin._id,
        name: admin.fullName,
        email: admin.email,
        shopName: admin.shopName,
        token: generateToken(admin._id),
      });
    } else {
      return res.status(401).json({ message: "Invalid Password" });
    }
  } catch (error) {
    return res.status(501).json({ message: error.message });
  }
};
export { userLogin, userRegistration, adminLogin };
