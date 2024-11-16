import mongoose, { model, models, Schema } from "mongoose";
 

const ChatSchema = new Schema(
  {
    groupChat: {
      type: Boolean,
      default: false,
    },
    groupName: {
      type: String,
      required: function (this: any) {
        return this.groupChat;
      }, // Only required for group chats
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);




if (models.Chat) {
  delete models.Chat;
}
const ChatModel = models.Chat || model("Chat", ChatSchema);

export default ChatModel;
