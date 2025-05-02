import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  username: string;
  email: string;
  passwordHash: string;
  avatarUrl?: string;
  bio?: string;
  displayName?: string;
  socialLinks?: Record<string, string>;
  theme?: {
    color: string;
    background: string;
    font: string;
  };
}

const userSchema = new Schema<IUser>({
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
  passwordHash: {
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

export default mongoose.model<IUser>("User", userSchema);
