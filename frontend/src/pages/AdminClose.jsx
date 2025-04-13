import { useState } from "react";
import Select from "react-select";
import Header from "../components/Header";
import baseUrl from "../api/api";

// Raw location data
const rawLocations = [
    { value: "Z-Edapally1", locCode: "144" },
    { value: "G-Edappally", locCode: "702" },
    { value: "SG-Trivandrum", locCode: "700" },
    { value: "Z- Edappal", locCode: "100" },
    { value: "Z.Perinthalmanna", locCode: "133" },
    { value: "Z.Kottakkal", locCode: "122" },
    { value: "G.Kottayam", locCode: "701" },
    { value: "G.Perumbavoor", locCode: "703" },
    { value: "G.Thrissur", locCode: "704" },
    { value: "G.Chavakkad", locCode: "706" },
    { value: "G.Calicut ", locCode: "712" },
    { value: "G.Vadakara", locCode: "708" },
    { value: "G.Edappal", locCode: "707" },
    { value: "G.Perinthalmanna", locCode: "709" },
    { value: "G.Kottakkal", locCode: "711" },
    { value: "G.Manjeri", locCode: "710" },
    { value: "G.Palakkad ", locCode: "705" },
    { value: "G.Kalpetta", locCode: "717" },
    { value: "G.Kannur", locCode: "716" },
];

const AllLocations = rawLocations.map((loc) => ({
    ...loc,
    label: loc.value,
}));

const AdminClose = () => {
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [cashDate, setCashDate] = useState("");
    const [cash, setCash] = useState("");
    const [closingCash, setClosingCash] = useState("");
    const [bank, setBank] = useState("");
    const [loading, setLoading] = useState(false);

    const currentUser = JSON.parse(localStorage.getItem("rootfinuser"));
    const email = currentUser?.email;

    const apiUrl5 = `${baseUrl.baseUrl}user/saveCashBank`;

    const handleSubmit = async () => {
        if (!selectedLocation || !cashDate || !cash || !closingCash || !bank) {
            alert("Please fill in all fields.");
            return;
        }
    
        const payload = {
            totalAmount: cash,
            totalCash: closingCash,
            totalBankAmount: bank,
            date: cashDate, // fixed here
            locCode: selectedLocation.locCode,
            email,
        };
    
        try {
            setLoading(true);
            const res = await fetch(apiUrl5, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(payload),
            });
    
            const data = await res.json();
    
            if (!res.ok) {
                throw new Error(data.message || "Something went wrong");
            }
    
            alert(data.message || "Data saved successfully!");
        } catch (err) {
            console.error(err);
            alert(err.message || "An error occurred.");
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <>
            <Header title="Admin Close" />
            <div className="ml-[290px] mt-[80px] p-4">
                <div className="mb-6">
                    <label className="block mb-2 font-semibold text-gray-700">
                        Location
                    </label>
                    <Select
                        options={AllLocations}
                        value={selectedLocation}
                        onChange={setSelectedLocation}
                        placeholder="Select a location"
                        className="w-full"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block mb-2 font-semibold text-gray-700">
                            Cash Date
                        </label>
                        <input
                            type="date"
                            value={cashDate}
                            onChange={(e) => setCashDate(e.target.value)}
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold text-gray-700">
                            Cash
                        </label>
                        <input
                            type="text"
                            value={cash}
                            onChange={(e) => setCash(e.target.value)}
                            placeholder="Enter cash amount"
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold text-gray-700">
                            Closing Cash
                        </label>
                        <input
                            type="text"
                            value={closingCash}
                            onChange={(e) => setClosingCash(e.target.value)}
                            placeholder="Enter closing cash"
                            className="w-full p-2 border rounded"
                        />
                    </div>

                    <div>
                        <label className="block mb-2 font-semibold text-gray-700">
                            Bank
                        </label>
                        <input
                            type="text"
                            value={bank}
                            onChange={(e) => setBank(e.target.value)}
                            placeholder="Enter bank amount"
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                <button
                    className="mt-6 p-2 bg-blue-500 w-1/2 rounded-md text-white hover:bg-blue-700 transition-all duration-200 cursor-pointer"
                    onClick={handleSubmit}
                    disabled={loading}
                >
                    {loading ? "Saving..." : "Close"}
                </button>
            </div>
        </>
    );
};

export default AdminClose;
