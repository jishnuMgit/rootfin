import { useMemo, useState } from 'react';
import Headers from '../components/Header.jsx';
import useFetch from '../hooks/useFetch.jsx';

// const transactions = [
//     {
//         date: "01-01-2025",
//         Bills: "38",
//         Quantity: "54",
//         BillValue: 10000,
//     },
//     {
//         date: "01-01-2025",
//         Bills: "33",
//         Quantity: "24",
//         BillValue: 30000,
//     }
// ];
const DayBook = () => {

    const [fromDate, setFromDate] = useState("");

    const [toDate, setToDate] = useState("");
    const [apiUrl, setApiUrl] = useState("");


    const handleFetch = () => {
        const baseUrl = "https://rentalapi.rootments.live/api/GetBooking";
        if (!fromDate || !toDate) {
            return alert("select date ")
        } else {
            const updatedApiUrl = `${baseUrl}/GetRentoutListDateWise?LocCode=144&DateFrom=${fromDate}&DateTo=${toDate}`;

            // alert(apiUrl)
            // Updating state
            setApiUrl(updatedApiUrl);


            console.log("API URLs Updated:", updatedApiUrl);
        }

        // Dynamically updating API URLs

    };
    const fetchOptions = useMemo(() => ({}), []);

    const { data } = useFetch(apiUrl, fetchOptions);
    console.log(data);


    return (
        <div>
            <Headers title={'Rent out Report'} />
            <div className='ml-[240px]'>
                <div className="p-6 bg-gray-100 min-h-screen">
                    {/* Date Inputs */}
                    <div className="flex gap-4 mb-6 w-[600px]">
                        <div className='w-full flex flex-col '>
                            <label htmlFor="from">From *</label>
                            <input type="date" id="from"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)} className='border border-gray-300 py-[6px]' />
                        </div>
                        <div className='w-full flex flex-col '>
                            <label htmlFor="to">To *</label>
                            <input type="date" id="to"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)} className='border border-gray-300 py-[6px]' />
                        </div>

                        <button className='bg-blue-500 w-[400px] h-[40px] mt-[20px] rounded-md text-white ' onClick={handleFetch}>Fetch</button>
                    </div>

                    {/* Table */}
                    <div className="bg-white p-4 shadow-md rounded-lg ">
                        <table className="w-full border-collapse border rounded-md border-gray-300">
                            <thead className='rounded-md'>
                                <tr className="bg-[#7C7C7C] rounded-md text-white">
                                    <th className="border p-2">Date</th>
                                    <th className="border p-2">No. of Bills</th>
                                    <th className="border p-2">Quantity</th>
                                    <th className="border p-2">Bill Value</th>
                                </tr>
                            </thead>
                            <tbody>
                                {data?.dataSet?.data.length > 0 ? (
                                    data?.dataSet?.data.map((transaction, index) => (
                                        <tr key={index}>
                                            <td className="border p-2">{transaction.rentoutDate.split('T')[0]
                                            }</td>
                                            <td className="border p-2">{transaction.noofbills}</td>
                                            <td className="border p-2">{transaction.quantity}</td>
                                            <td className="border p-2">{transaction.billValue}</td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center border p-4">{!toDate || !fromDate ? "Select Data range first" : "No transactions found"}</td>
                                    </tr>
                                )}
                            </tbody>

                            {/* Footer Totals */}
                            <tfoot>
                                <tr className="bg-white text-center font-semibold">
                                    <td className="border border-gray-300 px-4 py-2 text-left" colSpan="1">Total:</td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {data?.dataSet?.data.reduce((sum, item) => sum + item.noofbills, 0)}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {data?.dataSet?.data.reduce((sum, item) => sum + item.quantity, 0)}
                                    </td>
                                    <td className="border border-gray-300 px-4 py-2">
                                        {data?.dataSet?.data.reduce((sum, item) => sum + item.billValue, 0)}
                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DayBook