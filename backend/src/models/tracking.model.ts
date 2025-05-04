import mongoose, { Schema, Document } from "mongoose";

export interface ITracking extends Document {
  url_id: mongoose.Schema.Types.ObjectId;
  timestamp: Date;
  userAgent: string;
  ipAddress?: string;
}

const trackingSchema = new Schema<ITracking>({
  url_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Link",
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  userAgent: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
  },
});

export default mongoose.model<ITracking>("Tracking", trackingSchema);
