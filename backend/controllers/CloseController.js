import CloseTransaction from "../model/Closing.js";

export const CloseController = async (req, res) => {
    try {
        const { totalBankAmount: bank, totalAmount: cash, locCode, date } = req.body;

        if (bank === undefined || cash === undefined || !locCode) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        // Get today's date in YYYY-MM-DD format
        const today = new Date().toISOString().split("T")[0];

        console.log("Today's Date:", today, date);

        // Check if an entry already exists for today's date
        const existingClose = await CloseTransaction.findOne({
            locCode,
            date: today,
        });

        if (existingClose) {
            return res.status(401).json({
                message: "Already saved the cash for today",
            });
        }

        // Save the transaction with today's date
        const CloseCashBank = new CloseTransaction({
            bank,
            cash,
            locCode,
            date: today, // Ensure date is today
        });

        await CloseCashBank.save();

        res.status(201).json({
            message: "Cash and bank details saved successfully",
            data: CloseCashBank,
        });
    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({
            message: "An error occurred while saving the data.",
            error: error.message,
        });
    }
};


export const GetCloseController = async (req, res) => {
    try {

        const { date, locCode } = req.query
        console.log(date, locCode);


        const data = await CloseTransaction.findOne({
            date, locCode
        })
        if (!data) {
            return res.status(404).message({
                message: "No Data Found"
            })
        }
        res.status(200).json({
            message: "data Found",
            data: data
        })
    } catch (error) {
        res.status(500).json({
            message: "Internal server Error"
        })
    }
}