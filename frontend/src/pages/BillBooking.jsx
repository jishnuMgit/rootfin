import { useState } from "react";
const options = [
    { value: "all", label: "All" },
    { value: "balance_due", label: "Balance Due Collected" },
    { value: "security_received", label: "Security Received" },
    { value: "booking_advance", label: "Booking Advance" }
];

// Sample JSON Data
const jsonData = [
    { date: "01-02-2025", invoice: "012345678900", customer: "Ziyad", category: "Booking Advance", categoryAmt: 4000, totalTransaction: 4000, cash: 1500, bank: 2500, totalBill: 8500 },
    { date: "01-02-2025", invoice: "012345678900", customer: "Ziyad", category: "Balance Due Collected", categoryAmt: 4500, totalTransaction: 7500, cash: 3000, bank: 4500, totalBill: 8500 },
    { date: "01-02-2025", invoice: "012345678900", customer: "Ziyad", category: "Security Received", categoryAmt: 3000, cash: 0, totalTransaction: 7500, bank: 3000, totalBill: 8500 },
    { date: "02-02-2025", invoice: "012345678900", customer: "Jishnu", category: "Booking Advance", categoryAmt: 2500, totalTransaction: 2500, cash: 2500, bank: 0, totalBill: 4500 },
    { date: "02-02-2025", invoice: "012345678900", customer: "Jishnu", category: "Cancellation Amount", categoryAmt: -2500, totalTransaction: -2500, cash: -2500, bank: 0, totalBill: -4500 },
    { date: "03-02-2025", invoice: "012345678900", customer: "Ziyad", category: "Security Refund", categoryAmt: -3000, totalTransaction: -3000, cash: 0, bank: -3000, totalBill: 0 },
    { date: "05-02-2025", invoice: "012345678900", customer: "Nidhin", category: "Booking Advance", categoryAmt: 2500, totalTransaction: 2500, cash: 1000, bank: 1500, totalBill: 5000 },
    { date: "05-02-2025", invoice: "012345678900", customer: "Nidhin", category: "Balance Due Collected", categoryAmt: 2500, totalTransaction: 4000, cash: 2000, bank: 2000, totalBill: 5000 },
    { date: "05-02-2025", invoice: "012345678900", customer: "Nidhin", category: "Security Received", categoryAmt: 1500, totalTransaction: 1500, cash: 0, bank: 1500, totalBill: 0 }
];

const BillBooking = () => {


    const [selectedCategory, setSelectedCategory] = useState(null);
    const [tableData, setTableData] = useState(jsonData);
    console.log(setTableData);

    // Calculate totals
    const totalCategoryAmt = tableData.reduce((sum, item) => sum + item.categoryAmt, 0);
    const totalTransaction = tableData.reduce((sum, item) => sum + item.categoryAmt, 0);
    const totalCash = tableData.reduce((sum, item) => sum + item.cash, 0);
    const totalBank = tableData.reduce((sum, item) => sum + item.bank, 0);
    const totalBillValue = tableData.reduce((sum, item) => sum + item.totalBill, 0);

    console.log(options);
    console.log(selectedCategory);
    console.log(setSelectedCategory);



    return (
        <div>

            <div className="border border-gray-400 rounded-md mt-6 mx-10 mb-10 overflow-hidden">
                <table className="rounded-md table-auto w-full border-collapse border border-gray-300">
                    <thead>
                        <tr className="bg-gray-100 text-center">
                            <th className="border border-gray-300 px-4 py-2">Date</th>
                            <th className="border border-gray-300 px-4 py-2">Invoice No.</th>
                            <th className="border border-gray-300 px-4 py-2">Customer Name</th>
                            <th className="border border-gray-300 px-4 py-2">Bill Category</th>
                            <th className="border border-gray-300 px-4 py-2">Category Amt</th>
                            <th className="border border-gray-300 px-4 py-2">Total Transaction</th>
                            <th className="border border-gray-300 px-4 py-2">Amount (Cash)</th>
                            <th className="border border-gray-300 px-4 py-2">Amount (Bank)</th>
                            <th className="border border-gray-300 px-4 py-2">Total Bill Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((item, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-gray-50 text-center" : "text-center"}>
                                <td className="border border-gray-300 px-4 py-2">{item.date}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.invoice}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.customer}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.category}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.categoryAmt}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.totalTransaction}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.cash}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.bank}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.totalBill}</td>
                            </tr>
                        ))}
                        <tr className="bg-gray-200 font-bold text-center">
                            <td className="border border-gray-300 px-4 py-2" colSpan="4">Total :</td>
                            <td className="border border-gray-300 px-4 py-2">{totalCategoryAmt}</td>
                            <td className="border border-gray-300 px-4 py-2">{totalTransaction}</td>
                            <td className="border border-gray-300 px-4 py-2">{totalCash}</td>
                            <td className="border border-gray-300 px-4 py-2">{totalBank}</td>
                            <td className="border border-gray-300 px-4 py-2">{totalBillValue}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default BillBooking