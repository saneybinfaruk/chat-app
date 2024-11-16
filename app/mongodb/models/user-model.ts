import { model, models, Schema } from "mongoose";

const UserSchema = new Schema(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatarUrl: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const UserModel = models.User || model("User", UserSchema);
export default UserModel;
