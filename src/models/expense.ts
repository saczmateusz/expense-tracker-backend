import mongoose, { Schema, Document, Model, Types } from "mongoose";

// Define an interface for the user document
export interface IExpense extends Document {
  description: string;
  value: number;
  currency: string;
  category: string; // TODO: categoryId?
  dateCreated: Date;
  userId: Types.ObjectId;
}

// Define the schema
const expenseSchema = new Schema<IExpense>({
  description: {
    type: String,
    required: true,
  },
  value: {
    type: Number,
    required: true,
  },
  currency: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  dateCreated: {
    type: Date,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
});

// Create the model
const Expense: Model<IExpense> = mongoose.model<IExpense>(
  "Expense",
  expenseSchema
);

export default Expense;
