
import Transaction from "../model/Transaction.js";




export const CreatePayment = async (req, res) => {
    try {
        const { type, category, remark, amount, cash, bank, paymentMethod, locCode, date } = req.body;

        // Ensure all required fields are provided
        if (!type || !category || !amount || !cash || !bank || !paymentMethod || !date || !locCode) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const newTransaction = new Transaction({
            type,
            category,
            remark,
            amount,
            cash,
            bank,
            locCode,
            paymentMethod,
            date,
        });

        const savedTransaction = await newTransaction.save();
        res.status(201).json(savedTransaction);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
}


export const GetPayment = async (req, res) => {
    try {
        const { LocCode, DateFrom, DateTo } = req.query;

        if (!LocCode) {
            return res.status(400).json({ message: "'LocCode' is required" });
        }

        if (!DateFrom || !DateTo) {
            return res.status(400).json({ message: "Both 'DateFrom' and 'DateTo' are required" });
        }

        // Convert to Date objects and normalize to start and end of the day
        const fromDate = new Date(DateFrom);
        const toDate = new Date(DateTo);

        fromDate.setUTCHours(0, 0, 0, 0); // Start of the day
        toDate.setUTCHours(23, 59, 59, 999); // End of the day

        // Query transactions based on LocCode and Date Range
        const transactions = await Transaction.find({
            locCode: LocCode, // Match location code
            date: { $gte: fromDate, $lte: toDate }, // Match date range
        }).sort({ date: -1 });

        res.status(200).json({
            data: transactions
        });
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};





