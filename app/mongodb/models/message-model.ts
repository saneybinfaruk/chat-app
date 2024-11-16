import { model, models, Schema, Types } from "mongoose";

const MessageSchema = new Schema(
  {
    messageId: {
      type: String,
      unique: true,
      required: true,
    },
    chatId: {
      type: Types.ObjectId,
      ref: "Chat",
      required: true,
    },

    content: {
      type: String,
      required: false,
    },

    sender: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    isRead: {
      type: Boolean,
      default: false,
    },

    readBy: [
      {
        type: Types.ObjectId,
        ref: "User",
      },
    ],

    attachments: [
      {
        url: {
          type: String,
          required: false,
        },
        thumbnail_url: {
          type: String,
          required: false,
        },
      },
    ],
  },
  { timestamps: true }
);

 
const MessageModel = models.Message || model("Message", MessageSchema);
export default MessageModel;
