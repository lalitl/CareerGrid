import mongoose from "mongoose";
import { USER_ROLE } from "../utils/constants.js";

const UserModel = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  lastName: {
    type: String,
    default: "last name",
  },
  location: {
    type: String,
    default: "my city",
  },
  role: {
    type: String,
    user: Object.values(USER_ROLE),
    default: "user",
  },
  avatar: String,
  avatarPublicId: String,
});

UserModel.methods.removePassword = function () {
  let obj = this.toObject();
  delete obj.password;
  return obj;
};

export default mongoose.model("User", UserModel);
