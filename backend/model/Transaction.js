import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      // enum: ["income", "expense", "money transfer"],
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    remark: {
      type: String,
      default: "",
    },
    amount: {
      type: String, // Keeping it as a string to store negative values properly
      required: true,
    },
    cash: {
      type: String,
      required: true,
    },
    bank: {
      type: String,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ["cash", "bank", "split"],
      required: true,
    },
    date: {
      type: Date,
      required: true,
    },
    locCode: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Transaction = mongoose.model("Transaction", transactionSchema);
export default Transaction;
