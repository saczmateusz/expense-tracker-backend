import mongoose, { Schema, Document, Model } from "mongoose";

// Define an interface for the user document
export interface IUser extends Document {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

// Define the schema
const userSchema = new Schema<IUser>({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "",
  },
});

// Create the model
const User: Model<IUser> = mongoose.model<IUser>("User", userSchema);

export default User;
