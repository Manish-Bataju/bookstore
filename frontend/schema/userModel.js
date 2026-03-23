import mongoose from "mongoose";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    title:      {type:String, trim: true},
    firstName:  { type: String, required: true, trim: true },
    middleName: { type: String, trim: true, default: ""},
    lastName:   { type: String, required: true, trim: true },
    fullName:   {type:String, trim: true},
    password:    { type: String, required:true },
    userName:   { type: String, trim: true, immutable: true },

    //Business Details
    shopName:   {type: String, trim: true},
    isShop:     {type: Boolean},
    panNumber: {type: String},
  
    gender:     {type: Boolean},

    role: {
      type: String,
      enum: ["user","admin"],
      default: "user",
    },
    yob: { type: Number, min:1960, max: 2026},

    address: {
      houseNo: { type: String, trim: true },
      street: { type: String, trim: true },
      landMark: { type: String, trim: true },
      city: { type: String, trim: true },
      district: { type: String, trim: true },
      zipCode: { type: String, trim: true },
    },

    email: { type: String, required: true, unique: true, trim: true },
    isEmailVerified: { type: Boolean, default: false },

    mobileNo: { type: String, unique: true, required:true },
    isMobileVerified: { type: Boolean, default: false },

    profileImage: { type: String },

    orderHistory: [{ type: mongoose.Schema.Types.ObjectId, ref: "Order" }],
  },
  { timestamps: true },
);

//----------UserName Slug Middleware----------

userSchema.pre("save", async function (next) {
  if (
    this.isModified("firstName") || this.isModified("lastName") ||   this.isNew || this.isModified("mobileNo")) {
    const initial = this.firstName.slice(0, 2).trim().toLowerCase();
    const lName = this.lastName.trim().toLowerCase();

    let mobilePart = "0000";
    if(this.mobileNo){
      mobilePart = this.mobileNo.toString().slice(-4);
    }
    this.userName = [initial, lName, mobilePart].join(".");
  }

  //fullname creator:
  this.fullName = [this.firstName, this.middleName, this.lastName].filter(Boolean).join(" ");

  //password generator if new or  already registered..
  if (!this.isModified("password")) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    next(error);
  }
});

//Method to check password during login
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

export default mongoose.model('User', userSchema);
