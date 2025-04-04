

import { useState } from "react";
import Head from "../components/Head";


// Sample JSON Data
const jsonData = [
    { date: "01-02-2025", invoice: "17623536783", customer: "John Doe", contact: "7736724727", Reason: "unknown", mode: "Cash", Total: 6700 },
    { date: "01-02-2025", invoice: "17623536784", customer: "Alice Smith", contact: "7736724727", Reason: "unknown", mode: "Cash", Total: 6450 },
    { date: "01-02-2025", invoice: "17623536785", customer: "Michael Lee", contact: "7736724727", Reason: "unknown", mode: "Bank", Total: 64600 }
];

const Cancellation = () => {
    const [tableData, setTableData] = useState(jsonData); // Load JSON Data
    console.log(setTableData);
 
    return (
        <div className="border border-gray-200 shadow-lg rounded-md mx-10 mt-10">
            <div className="w-full">
                <Head />
            </div>
            <div className="flex ml-10 gap-6 mt-5">
                <div className="flex flex-col">
                    <label>From <span className="text-red-500">*</span></label>
                    <input type="date" className="border w-52 p-2 rounded-md border-gray-400" />
                </div>

                <div className="flex flex-col">
                    <label>To <span className="text-red-500">*</span></label>
                    <input type="date" className="border w-52 p-2 rounded-md border-gray-400" />
                </div>



                <div className="h-10 mt-6 cursor-pointer px-4 py-2 rounded-md text-white bg-blue-600 flex items-center ">
                    <button className="cursor-pointer ">Show Report</button>
                </div>
            </div>

            {/* Table Section */}
            <div className="border border-gray-400 rounded-md mt-6 mx-10 mb-10 overflow-hidden">
                <table className="rounded-md table-auto w-full border-collapse border border-gray-300">
                    <thead className="rounded-md">
                        <tr className="bg-gray-100 text-center">
                            <th className="border border-gray-300 px-4 py-2">Date</th>
                            <th className="border border-gray-300 px-4 py-2">Invoice No.</th>
                            <th className="border border-gray-300 px-4 py-2">Customer Name</th>
                            <th className="border border-gray-300 px-4 py-2">Contact no</th>
                            <th className="border border-gray-300 px-4 py-2">Reason for cancellation</th>
                            <th className="border border-gray-300 px-4 py-2">Mode Of Payment</th>
                            <th className="border border-gray-300 px-4 py-2">Total</th>

                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((item, index) => (
                            <tr key={index} className={index % 2 === 0 ? "bg-gray-50 text-center" : "text-center"}>
                                <td className="border border-gray-300 px-4 py-2">{item.date}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.invoice}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.customer}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.contact}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.Reason}</td>

                                <td className="border border-gray-300 px-4 py-2">{item.mode}</td>
                                <td className="border border-gray-300 px-4 py-2">{item.Total}</td>
                            </tr>
                        ))}
                    </tbody>

                    {/* Summary Section */}
                    <tfoot>
                        <tr className="bg-white text-center font-semibold">
                            <td className="border border-gray-300 px-4 py-2 text-left" colSpan="6">Total:</td>
                           
                            <td className="border border-gray-300 px-4 py-2">{tableData.reduce((sum, item) => sum + item.Total, 0)}</td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
};

export default Cancellation;
