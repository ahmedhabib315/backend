import mongoose from "mongoose";
const { Schema } = mongoose;

const expenseSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  difference: {
    type: Number,
    required: true
  },
  oldAmount: {
    type: Number,
    required: true,
  },
  currentAmount: {
    type: Number,
    required: true,
  },
  method: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  createdAt: {
    type: Date
  },
  lastModifiedAt: {
    type: Date,
    default: Date.now,
  },
  isDeleted: {
    type: Boolean
  },
  attachment: {
    type: String
  }
});

export const Expense = mongoose.model("expense", expenseSchema);