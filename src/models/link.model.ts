import mongoose, { Schema, Document } from "mongoose";

export interface ILink {
  user: mongoose.Schema.Types.ObjectId;
  url: string;
  title: string;
  logo: string;
}

const linkSchema = new Schema<ILink>({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  url: {
    type: String,
    required: true,
    trim: true,
  },
  title: {
    type: String,
    trim: true,
  },
  logo: {
    type: String,
    trim: true,
  },
});

export default mongoose.model<ILink>("Link", linkSchema);
