import { useState } from "react";
import Header from "../components/Header";
import baseUrl from "../api/api";

const SecurityPending = () => {
    const currentusers = JSON.parse(localStorage.getItem("rootfinuser")); // Convert back to an object

    const [selectedOption, setSelectedOption] = useState("radioDefault01");
    const [remark, setRemark] = useState("");
    const [amount, setAmount] = useState("");

    const currentDate = new Date().toISOString().split("T")[0];

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const parsedAmount = parseFloat(amount) || 0;
            if (parsedAmount <= 0) {
                alert("Please enter a valid amount.");
                return;
            }

            const transactionData = {
                type: "money transfer",
                category: selectedOption === "radioDefault01" ? "Cash to Bank" : "Bank to Cash",
                remark: remark,
                locCode: currentusers.locCode,
                amount: `${parsedAmount}`,
                bank: selectedOption === "radioDefault01" ? `${parsedAmount}` : `-${parsedAmount}`,
                cash: selectedOption === "radioDefault01" ? `-${parsedAmount}` : `${parsedAmount}`,
                paymentMethod: selectedOption === "radioDefault01" ? "cash" : "bank",
                date: currentDate
            };
            const response = await fetch(`${baseUrl.baseUrl}user/createPayment`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(transactionData)
            });

            const result = await response.json();

            if (response.ok) {
                alert("Transaction successfully created!");
                console.log("Success:", result);
            } else {
                alert("Error: " + result.message);
                console.error("Error:", result);
            }

            console.log(transactionData);
            alert("Transaction submitted successfully!");
        } catch (error) {
            console.error("Error submitting transaction:", error);
        }
    };

    return (
        <>
            <Header title="Cash Bank Ledger" />
            <div>
                <div className="ml-[290px] mt-[80px]">
                    <form onSubmit={handleSubmit}>
                        {/* Radio Buttons */}
                        <div className="flex gap-[50px]">
                            <div className="mb-2 flex items-center gap-2">
                                <input
                                    className="w-5 h-5 accent-blue-500"
                                    type="radio"
                                    name="flexRadioDefault"
                                    id="radioDefault01"
                                    value="radioDefault01"
                                    checked={selectedOption === "radioDefault01"}
                                    onChange={(e) => setSelectedOption(e.target.value)}
                                />
                                <label htmlFor="radioDefault01" className="cursor-pointer">
                                    Cash to Bank
                                </label>
                            </div>


                            {currentusers.power === "admin" && (
                                <div className="mb-2 flex items-center gap-2">
                                    <input
                                        className="w-5 h-5 accent-blue-500"
                                        type="radio"
                                        name="flexRadioDefault"
                                        id="radioDefault02"
                                        value="radioDefault02"
                                        checked={selectedOption === "radioDefault02"}
                                        onChange={(e) => setSelectedOption(e.target.value)}
                                    />
                                    <label htmlFor="radioDefault02" className="cursor-pointer">
                                        Bank to Cash
                                    </label>
                                </div>
                            )}

                        </div>

                        {/* Amount & Remarks */}
                        <div className="mt-4 flex flex-col gap-[50px]">
                            <div className="flex flex-col">
                                <div className="flex flex-col">
                                    <label htmlFor="amount">Amount</label>
                                    <input
                                        type="number"
                                        min="1"
                                        className="border border-gray-500 p-2 px-8 w-[250px] rounded-md"
                                        value={amount}
                                        onChange={(e) => setAmount(e.target.value)}
                                        placeholder="Enter Amount"
                                    />
                                </div>
                                <div className="flex flex-col w-[250px] rounded-md mt-[50px]">
                                    <label htmlFor="remark">Remarks</label>
                                    <input
                                        type="text"
                                        className="border border-gray-500 p-2 py-10 px-8 rounded-md"
                                        placeholder="Enter your remarks"
                                        value={remark}
                                        onChange={(e) => setRemark(e.target.value)}
                                    />
                                </div>
                            </div>
                            <div>
                                <input
                                    type="submit"
                                    className="bg-blue-500 text-white px-6 py-2 rounded-md mt-4 cursor-pointer hover:bg-blue-600 transition"
                                    value="Submit"
                                />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
};

export default SecurityPending;
