import mongoose, { Schema } from "mongoose";

const usersSchema = new Schema({
  username: { type: String, required: true },
  password: { type: String, required: true, select: false },
  salt: { type: String, required: true, select: false },

  passwordChangedAt: {
    type: Date,
    default: Date.now,
  },

  createdDate: { type: Date, default: Date.now },
  currentGameId: { type: String, default: null },
});

usersSchema.methods.changedPasswordAfter = function (
  jwtTimeStamp: number
): boolean {
  if (this.passwordChangedAt) {
    const changedTimeStamp = Math.floor(
      this.passwordChangedAt.getTime() / 1000
    );

    return changedTimeStamp < jwtTimeStamp;
  }
  return false;
};

export const userModal = mongoose.model("userdetails", usersSchema);
