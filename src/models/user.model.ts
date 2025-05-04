import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const accessTokenSecret: string = process.env.ACCESS_TOKEN_SECRET || "";
const refreshTokenSecret: string = process.env.REFRESH_TOKEN_SECRET || "";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  avatarUrl?: string;
  refreshToken?: string;
  bio?: string;
  displayName?: string;
  profileViews?: number;
  socialLinks: any[];
  theme?: {
    color: string;
    background: string;
    font: string;
  };
  confirmed?: boolean;
  confirmationCode?: string;
  generateAccessToken: () => string;
  generateRefreshToken: () => string;
  isPasswordCorrect: (password: string) => Promise<boolean>;
}

const userSchema = new Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: true,
  },
  avatarUrl: {
    type: String,
  },
  bio: {
    type: String,
    maxlength: 160,
  },
  displayName: {
    type: String,
    maxlength: 50,
  },
  socialLinks: [
    {
      type: mongoose.Schema.ObjectId,
      ref: "Link",
    },
  ],
  refreshToken: {
    type: String,
  },
  profileViews: {
    type: Number,
    default: 0
  },  
  confirmed: {
    type: Boolean,
    default: false,
  },
  confirmationCode: {
    type: String,
  },
  theme: {
    color: {
      type: String,
      default: "#000000",
    },
    background: {
      type: String,
      default: "#FFFFFF",
    },
    font: {
      type: String,
      default: "Arial",
    },
    image: {
      type: String,
    },
  },
});

userSchema.pre("save", async function (next) {
  // why we used function instead of arrow function because arrow function does not have this content and funtion has this context

  if (!this.isModified("password")) {
    return next();
    // if this was not here the password will be saved each time there is somechanges occur in the user
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.isPasswordCorrect = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    accessTokenSecret,
    {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        ? parseInt(process.env.ACCESS_TOKEN_EXPIRY, 10)
        : undefined,
    }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,
    },
    refreshTokenSecret,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        ? parseInt(process.env.REFRESH_TOKEN_EXPIRY, 10)
        : undefined,
    }
  );
};

export default mongoose.model<IUser>("User", userSchema);
