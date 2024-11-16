import mongoose, { Schema, Types } from "mongoose";

const FriendShipSchema = new Schema(
  {
    status: {
      type: String,
      default: "pending",
      enum: ["pending", "accapted", "rejected", "blocked"],
    },

    sender: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    receiver: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const FriendShipModel =
  mongoose.models.FriendShip || mongoose.model("FriendShip", FriendShipSchema);

export default FriendShipModel;
