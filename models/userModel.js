const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      
    },
    firstName: {
  type: String,
  default: "",
},
lastName: {
  type: String,
  default: "",
},
dateOfBirth: {
  type: Date, 
  default: "",
},
    email: {
      type: String,
      require: [true, "Please add a email"],
      unique: true,
      trim: true,
      match: [
        /^\s*[\w\-\+_]+(\.[\w\-\+_]+)*\@[\w\-\+_]+\.[\w\-\+_]+(\.[\w\-\+_]+)*\s*$/,
        "Please enter a valid email",
      ],
    },
    password: {
      type: String,
      require: [true, "Please add a password"],
      minLength: [8, "Password must be up to 8 characters"],
    },
    photo: {
      type: String,
      require: [true, "Please add a photo"],
      default: "https://cdn-icons-png.flaticon.com/512/2202/2202112.png",
    },
    phone: {
      type: Number,
    },
    country: {
      type: String,
      require: [true, "Please add a country"],
    },
    currency: {
      type: String,
      require: [true, "Please add a currency"],
      default: "USD",
    },
    account_type: {
      type: String,
      enum: ["demo", "live"],
      default: "live",
    },
    account_level: {
      type: String,
      enum: ["Standard", "Pro", "VIP"],
      default: "Standard",
    },
    balance: {
      type: Number,
      default: 0,
    },
    profit: {
        type: Number,
        default: 0,
        },
    isVerified: {
      type: Boolean,
      default: false,
    },
    withdrawal_amount: {
      type: Number,
      default: 0,
    },
    total_amount: {
      type: Number,
      default: 0,
    },
    comission: {
      type: Number,
      default: 0,
    },
    referral_code: {
      type: String,
      default: null,
    },
    isBlocked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(this.password, salt);
  this.password = hashedPassword;
  next();
});
const User = mongoose.model("User", userSchema);
module.exports = User;
