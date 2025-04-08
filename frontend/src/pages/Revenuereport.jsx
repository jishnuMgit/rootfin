




import Headers from '../components/Header.jsx';
import { useEffect, useMemo, useRef, useState } from "react";
// import Select from "react-select";
import useFetch from '../hooks/useFetch.jsx';
// import baseUrl from '../api/api.js';

// const categories = [
//     { value: "all", label: "All" },
//     { value: "booking", label: "Booking" },
//     { value: "RentOut", label: "Rent Out" },
//     { value: "Refund", label: "Refund" },
//     { value: "Return", label: "Return" },
//     { value: "Cancel", label: "Cancel" },

//     { value: "income", label: "income" },
//     { value: "expense", label: "Expense" },
//     { value: "money transfer", label: "Cash to Bank" },
// ];

// const subCategories = [
//     { value: "all", label: "All" },
//     { value: "advance", label: "Advance" },
//     { value: "Balance Payable", label: "Balance Payable" },
//     { value: "security", label: "Security" },
//     { value: "cancellation Refund", label: "Cancellation Refund" },
//     { value: "security Refund", label: "Security Refund" },
//     { value: "compensation", label: "Compensation" },
//     { value: "petty expenses", label: "petty expenses" },
// ];



// const opening = [{ cash: "60000", bank: "54000" }];
const Revenuereport = () => {

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [apiUrl, setApiUrl] = useState("");
    const [apiUrl1, setApiUrl1] = useState("");
    // const [apiUrl2, setApiUrl2] = useState("");
    // const [preOpen, setPreOpen] = useState([])

    // const [apiUrl3, setApiUrl3] = useState("");
    // const [apiUrl4, setApiUrl4] = useState("");
    // const [apiUrl5, setApiUrl5] = useState("");
    // console.log(apiUrl5);

    const currentusers = JSON.parse(localStorage.getItem("rootfinuser")); // Convert back to an object

    const handleFetch = () => {

        const baseUrl1 = "https://rentalapi.rootments.live/api/GetBooking";
        const updatedApiUrl = `${baseUrl1}/GetBookingList?LocCode=${currentusers.locCode}&DateFrom=${fromDate}&DateTo=${toDate}`;
        const updatedApiUrl1 = `${baseUrl1}/GetRentoutList?LocCode=${currentusers.locCode}&DateFrom=${fromDate}&DateTo=${toDate}`;
        // const updatedApiUrl2 = `${baseUrl1}/GetReturnList?LocCode=${currentusers.locCode}&DateFrom=${fromDate}&DateTo=${toDate}`;
        // const updatedApiUrl3 = `${baseUrl.baseUrl}user/Getpayment?LocCode=${currentusers.locCode}&DateFrom=${fromDate}&DateTo=${toDate}`;
        // const updatedApiUrl4 = `${baseUrl1}/GetDeleteList?LocCode=${currentusers.locCode}&DateFrom=${fromDate}&DateTo=${toDate}`
        // const updatedApiUrl5 = `${baseUrl.baseUrl}user/getsaveCashBank?locCode=${currentusers.locCode}&date=${toDate}`

        setApiUrl(updatedApiUrl);
        setApiUrl1(updatedApiUrl1);
        // setApiUrl2(updatedApiUrl2);
        // alert(updatedApiUrl2)
        // setApiUrl3(updatedApiUrl3)
        // setApiUrl4(updatedApiUrl4)
        // setApiUrl5(updatedApiUrl5)
        // GetCreateCashBank(updatedApiUrl5)

        // console.log("API URLs Updated:", updatedApiUrl2);
    };


    // const GetCreateCashBank = async (api) => {
    //     try {
    //         const response = await fetch(api, {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //             },
    //         });
    //         // alert(apiUrl5)

    //         if (!response.ok) {
    //             throw new Error('Error saving data');
    //         }

    //         const data = await response.json();
    //         console.log("Data saved successfully:", data);
    //         setPreOpen(data?.data)
    //     } catch (error) {
    //         console.error("Error saving data:", error);
    //     }
    // };
    useEffect(() => {
    }, [])

    // Memoizing fetch options
    const fetchOptions = useMemo(() => ({}), []);

    const { data } = useFetch(apiUrl, fetchOptions);
    const { data: data1 } = useFetch(apiUrl1, fetchOptions);
    // const { data: data2 } = useFetch(apiUrl2, fetchOptions);
    // const { data: data3 } = useFetch(apiUrl3, fetchOptions);
    // const { data: data4 } = useFetch(apiUrl4, fetchOptions);
    // alert(data3);
    // console.log(data2);
    const printRef = useRef(null);

    const handlePrint = () => {
        const printContent = printRef.current.innerHTML;
        const originalContent = document.body.innerHTML;
        console.log(originalContent);


        document.body.innerHTML = `<html><head><title>Dummy Report</title>
            <style>
                @page { size: tabloid; margin: 10mm; }
                body { font-family: Arial, sans-serif; }
                table { width: 100%; border-collapse: collapse; }
                th, td { border: 1px solid black; padding: 8px; text-align: left; white-space: nowrap; }
                tr { break-inside: avoid; }
            </style>
        </head><body>${printContent}</body></html>`;

        window.print();
        window.location.reload(); // Reload to restore content
    };


    const bookingTransactions = (data?.dataSet?.data || []).map(transaction => ({
        ...transaction,
        bookingCashAmount: parseInt(transaction.bookingCashAmount, 10) || 0,
        bookingBankAmount: parseInt(transaction.bookingBankAmount, 10) || 0,
        invoiceAmount: parseInt(transaction.invoiceAmount, 10) || 0,
        bookingBank: parseInt(transaction.bookingBankAmount) + parseInt(transaction.bookingUPIAmount),
        TotaltransactionBooking: parseInt(transaction.bookingBankAmount) + parseInt(transaction.bookingUPIAmount) + parseInt(transaction.bookingCashAmount),
        Category: "Booking",
        SubCategory: "Advance"
    }));



    const rentOutTransactions = (data1?.dataSet?.data || []).map(transaction => ({
        ...transaction,
        bookingCashAmount: parseInt(transaction.bookingCashAmount, 10) || 0,
        bookingBankAmount: parseInt(transaction.bookingBankAmount, 10) || 0,
        invoiceAmount: parseInt(transaction.invoiceAmount, 10) || 0,
        securityAmount1: parseInt(transaction.securityAmount, 10) || 0,
        advanceAmount: parseInt(transaction.advanceAmount, 10) || 0,
        Balance: (parseInt(transaction.invoiceAmount ?? 0, 10) - parseInt(transaction.advanceAmount ?? 0, 10)) || 0,
        rentoutUPIAmount: (parseInt(transaction.rentoutUPIAmount) + parseInt(transaction.rentoutBankAmount) + parseInt(transaction.rentoutCashAmount)) - parseInt(transaction.securityAmount),
        Category: "RentOut",
        SubCategory: "Balance Payable",
        SubCategory1: "Balance Payable"

    }));


    // const returnOutTransactions = (data2?.dataSet?.data || []).map(transaction => ({
    //     ...transaction,
    //     returnBankAmount: -(parseInt(transaction.returnBankAmount, 10) + parseInt(transaction.returnUPIAmount) || 0),
    //     returnCashAmount: -(parseInt(transaction.returnCashAmount, 10) || 0),
    //     invoiceAmount: parseInt(transaction.invoiceAmount, 10) || 0,
    //     advanceAmount: parseInt(transaction.advanceAmount, 10) || 0,
    //     RsecurityAmount: (parseInt(transaction.securityAmount, 10) * -1 || 0),
    //     Category: "Return",
    //     SubCategory: "security Refund"
    // }));
    // const Transactionsall = (data3?.data || []).map(transaction => ({
    //     ...transaction,
    //     locCode: currentusers.locCode,
    //     date: transaction.date.split("T")[0] // Correctly extract only the date
    // }));

    // const canCelTransactions = (data4?.dataSet?.data || []).map(transaction => ({
    //     ...transaction,
    //     Category: "Cancel",
    //     SubCategory: "cancellation Refund"


    // }));
    // alert(apiUrl4)
    // console.log("Hi" + data4);
    // alert(canCelTransactions)
    const allTransactions = [...rentOutTransactions, ...bookingTransactions,];

    // console.log(allTransactions);
    // const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    // const [selectedSubCategory, setSelectedSubCategory] = useState(subCategories[0]);






    // Filter transactions based on category & subcategory
    // const selectedCategoryValue = selectedCategory?.value?.toLowerCase() || "all";
    // const selectedSubCategoryValue = selectedSubCategory?.value?.toLowerCase() || "all";

    // const filteredTransactions = allTransactions.filter((t) =>
    //     (selectedCategoryValue === "all" || (t.category?.toLowerCase() === selectedCategoryValue || t.Category?.toLowerCase() === selectedCategoryValue || t.type?.toLowerCase() === selectedCategoryValue || t.type?.toLowerCase() === selectedCategoryValue)) &&
    //     (selectedSubCategoryValue === "all" || (t.subCategory?.toLowerCase() === selectedSubCategoryValue || t.SubCategory?.toLowerCase() === selectedSubCategoryValue || t.type?.toLowerCase() === selectedSubCategoryValue || t.type?.toLowerCase() === selectedSubCategoryValue || t.subCategory1?.toLowerCase() === selectedSubCategoryValue || t.SubCategory1?.toLowerCase() === selectedSubCategoryValue || t.category?.toLowerCase() === selectedSubCategoryValue || t.category?.toLowerCase() === selectedSubCategoryValue))
    // );


    // const totalBankAmount =
    //     (allTransactions?.reduce((sum, item) =>
    //         sum +
    //         (parseInt(item.bookingBankAmount, 10) || 0) +
    //         (parseInt(item.rentoutBankAmount, 10) || 0) +
    //         (parseInt(item.bank, 10) || 0) +
    //         (parseInt(item.rentoutUPIAmount, 10) || 0) +
    //         (parseInt(item.bookingUPIAmount, 10) || 0) +
    //         (parseInt(item.deleteBankAmount, 10) || 0) * -1 +
    //         (parseInt(item.deleteUPIAmount, 10) || 0) * -1 + // Ensure negative value is applied correctly
    //         (parseInt(item.returnBankAmount, 10) || 0),
    //         0
    //     ) || 0);

    // const totalCash = (
    //     allTransactions?.reduce((sum, item) =>
    //         sum +
    //         (parseInt(item.bookingCashAmount, 10) || 0) +
    //         (parseInt(item.rentoutCashAmount, 10) || 0) +
    //         (parseInt(item.cash, 10) || 0) +
    //         ((parseInt(item.deleteCashAmount, 10) || 0) * -1) + // Ensure deletion is properly subtracted
    //         (parseInt(item.returnCashAmount, 10) || 0),
    //         0
    //     )
    // );
    // alert(preOpen.bank)
    return (

        <div>
            <Headers title={"Revenue Report"} />
            <div className='ml-[240px]'>
                <div className="p-6 bg-gray-100 min-h-screen">
                    {/* Dropdowns */}
                    <div className="flex gap-4 mb-6 w-[800px]">
                        <div className='w-full flex flex-col'>
                            <label htmlFor="">From *</label>
                            <input
                                type="date"
                                id="fromDate"
                                value={fromDate}
                                onChange={(e) => setFromDate(e.target.value)}
                                className="border border-gray-300 py-2 px-3"
                            />                        </div>
                        <div className='w-full flex flex-col '>
                            <label htmlFor="">To *</label>
                            <input
                                type="date"
                                id="toDate"
                                value={toDate}
                                onChange={(e) => setToDate(e.target.value)}
                                className="border border-gray-300 py-2 px-3"
                            />
                        </div>

                        <button
                            onClick={handleFetch}
                            className="bg-blue-500 h-[40px] mt-6 rounded-md text-white px-10 cursor-pointer"
                        >
                            Fetch
                        </button>

                        {/* <div className='w-full'>
                            <label htmlFor="">Category</label>
                            <Select
                                options={categories}
                                value={selectedCategory}
                                onChange={setSelectedCategory}

                            />
                        </div> */}
                        {/* <div className='w-full'>
                            <label htmlFor="">Sub Category</label>
                            <Select
                                options={subCategories}
                                value={selectedSubCategory}
                                onChange={setSelectedSubCategory}
                            />
                        </div> */}

                    </div>
                    <div ref={printRef} >

                        {/* Table */}
                        <div className="bg-white p-4 shadow-md rounded-lg ">
                            <table className="w-full border-collapse border rounded-md border-gray-300">
                                <thead className='rounded-md'>
                                    <tr className="bg-[#7C7C7C] rounded-md text-white">
                                        <th className="border p-2">Date</th>
                                        <th className="border p-2">Invoice No.</th>
                                        <th className="border p-2">Customer Name</th>
                                        <th className="border p-2">Category</th>
                                        <th className="border p-2">Sub Category</th>
                                        {/* <th className="border p-2">Remarks</th> */}
                                        <th className="border p-2">Amount</th>
                                        {/* <th className="border p-2">Total Transaction</th> */}
                                        {/* <th className="border p-2">Bill Value</th> */}
                                        {/* <th className="border p-2">Cash</th>
                                    <th className="border p-2">Bank</th> */}
                                    </tr>
                                </thead>
                                <tbody>
                                    {/* Opening Balance */}
                                    {/* <tr className="bg-gray-100">
                                    <td colSpan="9" className="border p-2 font-bold">OPENING BALANCE</td>
                                    <td className="border p-2 font-bold">{preOpen.cash
                                    }</td>
                                    <td className="border p-2 font-bold">0</td>
                                </tr> */}

                                    {/* Transactions */}
                                    {allTransactions.length > 0 ? (
                                        allTransactions.map((transaction, index) => (
                                            <>
                                                {transaction.Category === 'RentOut' ? (
                                                    <>
                                                        <tr key={`${index}-1`}>
                                                            <td className="border p-2">{transaction.rentOutDate}</td>
                                                            <td className="border p-2">{transaction.invoiceNo}</td>
                                                            <td className="border p-2">{transaction.customerName}</td>
                                                            <td className="border p-2">{transaction.Category}</td> {/* Merged Row */}
                                                            <td className="border p-2">{transaction.SubCategory}</td>
                                                            {/* <td className="border p-2"></td> */}
                                                            <td className="border p-2">{transaction.rentoutUPIAmount || 0}</td>
                                                            {/* <td className="border p-2">
                                                            {transaction.securityAmount}
                                                        </td>
                                                        <td className="border p-2" >{transaction.invoiceAmount}</td> */}
                                                            {/* <td className="border p-2" >{transaction.rentoutCashAmount || 0}</td>
                                                        <td className="border p-2" >{parseInt(transaction.rentoutBankAmount) + parseInt(transaction.rentoutUPIAmount) || 0}</td> */}
                                                        </tr>


                                                    </>
                                                ) : (
                                                    <tr key={index}>
                                                        <td className="border p-2">{transaction.returnedDate || transaction.rentOutDate || transaction.cancelDate || transaction.bookingDate || transaction.date}</td>
                                                        <td className="border p-2">{transaction.invoiceNo || transaction.locCode}</td>
                                                        <td className="border p-2">{transaction.customerName}</td>
                                                        <td className="border p-2">{transaction.Category || transaction.type}</td>
                                                        <td className="border p-2">{transaction.SubCategory || transaction.category}</td>
                                                        {/* <td className="border p-2">{transaction.remark}</td> */}
                                                        <td className="border p-2">

                                                            {parseInt(transaction.TotaltransactionBooking || 0)
                                                            }
                                                        </td>
                                                        {/* <td className="border p-2">
                                                        {parseInt(transaction.returnCashAmount || 0) + parseInt(transaction.returnBankAmount || 0)}
                                                    </td>
                                                    <td className="border p-2">
                                                        {parseInt(transaction.invoiceAmount) || parseInt(transaction.amount) || 0}
                                                    </td> */}
                                                        {/* <td className="border p-2">
                                                        {parseInt(transaction.rentoutCashAmount) || parseInt(transaction.bookingCashAmount) || parseInt(transaction.returnCashAmount) || parseInt(transaction.cash) || -(parseInt(transaction.deleteCashAmount)) || 0}
                                                    </td>
                                                    <td className="border p-2">
                                                        {parseInt(transaction.rentoutBankAmount) || transaction.bookingBank || parseInt(transaction.returnBankAmount) || parseInt(transaction.bank) || -(parseInt(transaction.deleteBankAmount) + parseInt(transaction.deleteUPIAmount)) || 0}
                                                    </td> */}
                                                    </tr>

                                                )}
                                            </>



                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="11" className="text-center border p-4">No transactions found</td>
                                        </tr>
                                    )}
                                </tbody>

                                {/* Footer Totals */}
                                <tfoot>
                                    <tr className="bg-white text-center font-semibold">
                                        <td className="border border-gray-300 px-4 py-2 text-left" colSpan="5">Total:</td>

                                        <td className="border border-gray-300 px-4 py-2">

                                            {
                                                allTransactions.reduce(
                                                    (sum, item) =>
                                                        sum +
                                                        (parseInt(item.rentoutUPIAmount, 10) || 0) +
                                                        (parseInt(item.TotaltransactionBooking, 10) || 0),

                                                    0
                                                )

                                            }


                                        </td>

                                        {/* <td className="border border-gray-300 px-4 py-2">
                                        {allTransactions.reduce((sum, item) =>
                                            sum +
                                            (parseInt(item.bookingCashAmount, 10) || 0) +
                                            (parseInt(item.bookingBankAmount, 10) || 0) +
                                            (parseInt(item.rentoutCashAmount, 10) || 0) +
                                            (parseInt(item.rentoutBankAmount, 10) || 0) +
                                            (parseInt(item.returnCashAmount, 10) || 0) +
                                            (parseInt(item.returnBankAmount, 10) || 0),
                                            0)}
                                    </td> */}

                                        {/* Total Booking Cash Amount */}
                                        {/* <td className="border border-gray-300 px-4 py-2">
                                        {allTransactions.reduce((sum, item) => sum + (parseInt(item.bookingCashAmount, 10) || 0), 0)}
                                    </td> */}

                                        {/* Total Cash (including opening balance) */}
                                        {/* <td className="border border-gray-300 px-4 py-2">
                                        {

                                            totalCash

                                        }
                                    </td> */}

                                        {/* Total Bank (including opening balance) */}
                                        {/* <td className="border border-gray-300 px-4 py-2">
                                        {

                                            totalBankAmount
                                        }
                                    </td> */}
                                    </tr>
                                </tfoot>

                            </table>
                        </div>

                    </div>
                    <button onClick={handlePrint} className="mt-6 w-[200px] float-right cursor-pointer bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2">
                        <span>📥 Take pdf</span>
                    </button>
                </div>


            </div>



        </div>
    )
}

export default Revenuereport