import Headers from '../components/Header.jsx';
import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import useFetch from '../hooks/useFetch.jsx';
import baseUrl from '../api/api.js';
import { useRef } from "react";

const categories = [
    { value: "all", label: "All" },
    { value: "booking", label: "Booking" },
    { value: "RentOut", label: "Rent Out" },
    { value: "Refund", label: "Refund" },
    { value: "Return", label: "Return" },
    { value: "Cancel", label: "Cancel" },

    { value: "income", label: "income" },
    { value: "expense", label: "Expense" },
    { value: "money transfer", label: "Cash to Bank" },
];

const subCategories = [
    { value: "all", label: "All" },
    { value: "advance", label: "Advance" },
    { value: "Balance Payable", label: "Balance Payable" },
    { value: "security", label: "Security" },
    { value: "cancellation Refund", label: "Cancellation Refund" },
    { value: "security Refund", label: "Security Refund" },
    { value: "compensation", label: "Compensation" },
    { value: "petty expenses", label: "petty expenses" },
];



const denominations = [
    { label: "500", value: 500 },
    { label: "200", value: 200 },
    { label: "100", value: 100 },
    { label: "50", value: 50 },
    { label: "20", value: 20 },
    { label: "10", value: 10 },
    { label: "Coins", value: 1 },
];

// const opening = [{ cash: "60000", bank: "54000" }];

const DayBookInc = () => {

    const [preOpen, setPreOpen] = useState([])
    const date = new Date();
    const previousDate = new Date(date);
    previousDate.setDate(date.getDate() - 1);
    const TodayDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()}`;
    const previousDate1 = `${String(previousDate.getDate()).padStart(2, '0')}-${String(previousDate.getMonth() + 1).padStart(2, '0')}-${previousDate.getFullYear()}`;

    // alert(TodayDate);
    const currentusers = JSON.parse(localStorage.getItem("rootfinuser")); // Convert back to an object
    // console.log(currentusers);
    const currentDate = new Date().toISOString().split("T")[0];
    // Convert "04-04-2025" to "2025-04-04"
    const formatDate = (inputDate) => {
        const [day, month, year] = inputDate.split("-");
        return `${year}-${month}-${day}`;
    };

    // Example usage:

    const formattedDate = formatDate(previousDate1); // "2025-04-04"
    console.log(formattedDate);


    const apiUrl = `https://rentalapi.rootments.live/api/GetBooking/GetBookingList?LocCode=${currentusers?.locCode}&DateFrom=${currentDate}&DateTo=${currentDate}`;
    const apiurl1 = `https://rentalapi.rootments.live/api/GetBooking/GetRentoutList?LocCode=${currentusers?.locCode}&DateFrom=${currentDate}&DateTo=${currentDate}`;
    const apiUrl2 = `https://rentalapi.rootments.live/api/GetBooking/GetReturnList?LocCode=${currentusers?.locCode}&DateFrom=${currentDate}&DateTo=${currentDate}`
    const apiUrl3 = `https://rentalapi.rootments.live/api/GetBooking/GetDeleteList?LocCode=${currentusers.locCode}&DateFrom=${currentDate}&DateTo=${currentDate}`
    const apiUrl4 = `${baseUrl.baseUrl}user/Getpayment?LocCode=${currentusers.locCode}&DateFrom=${currentDate}&DateTo=${currentDate}`;
    const apiUrl5 = `${baseUrl.baseUrl}user/saveCashBank`
    const apiUrl6 = `${baseUrl.baseUrl}user/getsaveCashBank?locCode=${currentusers.locCode}&date=${formattedDate}`
    // alert(apiurl1)

    const locCode = currentusers.locCode


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


    // alert(previousDate1)


    const fetchOptions = useMemo(() => ({}), []);

    const { data } = useFetch(apiUrl, fetchOptions);
    const { data: data1 } = useFetch(apiurl1, fetchOptions);
    const { data: data2 } = useFetch(apiUrl2, fetchOptions);
    const { data: data3 } = useFetch(apiUrl3, fetchOptions);

    const { data: data4 } = useFetch(apiUrl4, fetchOptions);

    // console.log(data1);

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
    const canCelTransactions = (data3?.dataSet?.data || []).map(transaction => ({
        ...transaction,
        Category: "Cancel",
        SubCategory: "cancellation Refund"


    }));
    const Transactionsall = (data4?.data || []).map(transaction => ({
        ...transaction,
        locCode: currentusers.locCode,
        date: transaction.date.split("T")[0] // Correctly extract only the date
    }));
    const rentOutTransactions = (data1?.dataSet?.data || []).map(transaction => ({
        ...transaction,
        bookingCashAmount: parseInt(transaction.bookingCashAmount, 10) || 0,
        bookingBankAmount: parseInt(transaction.bookingBankAmount, 10) || 0,
        invoiceAmount: parseInt(transaction.invoiceAmount, 10) || 0,
        securityAmount: parseInt(transaction.securityAmount, 10) || 0,
        advanceAmount: parseInt(transaction.advanceAmount, 10) || 0,
        Balance: (parseInt(transaction.invoiceAmount ?? 0, 10) - parseInt(transaction.advanceAmount ?? 0, 10)) || 0,
        rentoutUPIAmount: parseInt(transaction.rentoutUPIAmount),
        Category: "RentOut",
        SubCategory: "Security",
        SubCategory1: "Balance Payable"

    }));

    const returnOutTransactions = (data2?.dataSet?.data || []).map(transaction => ({
        ...transaction,
        returnBankAmount: -(parseInt(transaction.returnBankAmount, 10) || 0),
        returnCashAmount: -(parseInt(transaction.returnCashAmount, 10) || 0),
        invoiceAmount: parseInt(transaction.invoiceAmount, 10) || 0,
        advanceAmount: parseInt(transaction.advanceAmount, 10) || 0,
        RsecurityAmount: -(parseInt(transaction.securityAmount, 10) || 0),
        Category: "Return",
        SubCategory: "security Refund",
    }));


    const allTransactions = [...bookingTransactions, ...rentOutTransactions, ...returnOutTransactions, ...canCelTransactions, ...Transactionsall];

    // console.log(allTransactions);


    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const [selectedSubCategory, setSelectedSubCategory] = useState(subCategories[0]);
    const [quantities, setQuantities] = useState(Array(denominations.length).fill(""));

    const handleChange = (index, value) => {
        const newQuantities = [...quantities];
        newQuantities[index] = value === "" ? "" : parseInt(value, 10);
        setQuantities(newQuantities);
    };

    const totalAmount = denominations.reduce(
        (sum, denom, index) => sum + (quantities[index] || 0) * denom.value,
        0
    );



    // const closingCash = 200000;
    // const physicalCash = 190000;
    // const differences = physicalCash - closingCash;
    const selectedCategoryValue = selectedCategory?.value?.toLowerCase() || "all";
    const selectedSubCategoryValue = selectedSubCategory?.value?.toLowerCase() || "all";

    const filteredTransactions = allTransactions.filter((t) =>
        (selectedCategoryValue === "all" || (t.category?.toLowerCase() === selectedCategoryValue || t.Category?.toLowerCase() === selectedCategoryValue || t.type?.toLowerCase() === selectedCategoryValue || t.type?.toLowerCase() === selectedCategoryValue)) &&
        (selectedSubCategoryValue === "all" || (t.subCategory?.toLowerCase() === selectedSubCategoryValue || t.SubCategory?.toLowerCase() === selectedSubCategoryValue || t.type?.toLowerCase() === selectedSubCategoryValue || t.type?.toLowerCase() === selectedSubCategoryValue || t.subCategory1?.toLowerCase() === selectedSubCategoryValue || t.SubCategory1?.toLowerCase() === selectedSubCategoryValue || t.category?.toLowerCase() === selectedSubCategoryValue || t.category?.toLowerCase() === selectedSubCategoryValue))
    );




    // console.log(allTransactions);
    const totalBankAmount =
        (filteredTransactions?.reduce((sum, item) =>
            sum +
            (parseInt(item.bookingBankAmount, 10) || 0) +
            (parseInt(item.rentoutBankAmount, 10) || 0) +
            (parseInt(item.bank, 10) || 0) +
            (parseInt(item.rentoutUPIAmount, 10) || 0) +
            (parseInt(item.bookingUPIAmount, 10) || 0) +
            (parseInt(item.deleteBankAmount, 10) || 0) * -1 +
            (parseInt(item.deleteUPIAmount, 10) || 0) * -1 + // Ensure negative value is applied correctly
            (parseInt(item.returnBankAmount, 10) || 0),
            0
        ) || 0);


    const totalCash = (
        filteredTransactions?.reduce((sum, item) =>
            sum +
            (parseInt(item.bookingCashAmount, 10) || 0) +
            (parseInt(item.rentoutCashAmount, 10) || 0) +
            (parseInt(item.cash, 10) || 0) +
            ((parseInt(item.deleteCashAmount, 10) || 0) * -1) + // Ensure deletion is properly subtracted
            (parseInt(item.returnCashAmount, 10) || 0),
            0
        ) + (parseInt(preOpen?.Closecash, 10) || 0)
    );

    const savedData = {
        TodayDate,
        locCode,
        totalCash,
        totalAmount,
        totalBankAmount

    }
    // console.log(savedData);

    const CreateCashBank = async () => {
        try {
            const response = await fetch(apiUrl5, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(savedData),
            });

            if (response.status === 401) {
                return alert("Error: Data already saved for today.");
            } else if (!response.ok) {
                return alert("Error: Failed to save data.");
            }

            const data = await response.json();
            console.log("Data saved successfully:", data);
            alert("Data saved successfully");
        } catch (error) {
            console.error("Error saving data:", error);
            alert("An unexpected error occurred.");
        }
    };


    const GetCreateCashBank = async () => {
        try {
            const response = await fetch(apiUrl6, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // alert(apiUrl6)

            if (!response.ok) {
                throw new Error('Error saving data');
            }

            const data = await response.json();
            console.log("Data saved successfully:", data);
            setPreOpen(data?.data)
        } catch (error) {
            console.error("Error saving data:", error);
        }
    };
    useEffect(() => {
        GetCreateCashBank()
    }, [])

    return (
        <>
            <div>
                <Headers title={"Day Book"} />
                <div className='ml-[240px]'>
                    <div className="p-6 bg-gray-100 min-h-screen">
                        {/* Dropdowns */}
                        <div className="flex gap-4 mb-6 w-[600px]">
                            <div className='w-full'>
                                <label htmlFor="">Category</label>
                                <Select
                                    options={categories}
                                    value={selectedCategory}
                                    onChange={setSelectedCategory}

                                />
                            </div>
                            <div className='w-full'>
                                <label htmlFor="">Sub Category</label>
                                <Select
                                    options={subCategories}
                                    value={selectedSubCategory}
                                    onChange={setSelectedSubCategory}
                                />
                            </div>
                        </div>

                        <div ref={printRef} >




                            {/* Table */}
                            <div className="bg-white p-4 shadow-md rounded-lg ">
                                <div className="bg-white p-4 shadow-md rounded-lg ">
                                    <table className="w-full border-collapse border rounded-md border-gray-300">
                                        <thead className='rounded-md'>
                                            <tr className="bg-[#7C7C7C] rounded-md text-white">
                                                <th className="border p-2">Date</th>
                                                <th className="border p-2">Invoice No.</th>
                                                <th className="border p-2">Customer Name</th>
                                                <th className="border p-2">Category</th>
                                                <th className="border p-2">Sub Category</th>
                                                <th className="border p-2">Remarks</th>
                                                <th className="border p-2">Amount</th>
                                                <th className="border p-2">Total Transaction</th>
                                                <th className="border p-2">Bill Value</th>
                                                <th className="border p-2">Cash</th>
                                                <th className="border p-2">Bank</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {/* Opening Balance */}
                                            <tr className="bg-gray-100">
                                                <td colSpan="9" className="border p-2 font-bold">OPENING BALANCE</td>
                                                <td className="border p-2 font-bold">{preOpen.Closecash
                                                }</td>
                                                <td className="border p-2 font-bold">0</td>
                                            </tr>

                                            {/* Transactions */}
                                            {filteredTransactions.length > 0 ? (
                                                filteredTransactions.map((transaction, index) => (
                                                    <>
                                                        {transaction.Category === 'RentOut' ? (
                                                            <>
                                                                <tr key={`${index}-1`}>
                                                                    <td className="border p-2">{transaction.rentOutDate || transaction.bookingDate}</td>
                                                                    <td className="border p-2">{transaction.invoiceNo}</td>
                                                                    <td className="border p-2">{transaction.customerName}</td>
                                                                    <td rowSpan="2" className="border p-2">{transaction.Category}</td> {/* Merged Row */}
                                                                    <td className="border p-2">{transaction.SubCategory}</td>
                                                                    <td className="border p-2"></td>
                                                                    <td className="border p-2">{transaction.securityAmount || 0}</td>
                                                                    <td rowSpan="2" className="border p-2">
                                                                        {transaction.securityAmount + transaction.Balance}
                                                                    </td>
                                                                    <td className="border p-2" rowSpan="2">{transaction.invoiceAmount}</td>
                                                                    <td className="border p-2" rowSpan="2">{transaction.rentoutCashAmount || 0}</td>
                                                                    <td className="border p-2" rowSpan="2">{parseInt(transaction.rentoutBankAmount) + parseInt(transaction.rentoutUPIAmount) || 0}</td>
                                                                </tr>

                                                                <tr key={`${index}-2`}>
                                                                    <td className="border p-2">{transaction.rentOutDate || transaction.bookingDate}</td> {/* Repeated Row */}
                                                                    <td className="border p-2">{transaction.invoiceNo}</td>
                                                                    <td className="border p-2">{transaction.customerName}</td>
                                                                    {/* Category is skipped due to rowSpan */}
                                                                    <td className="border p-2">{transaction.SubCategory1
                                                                    }</td>
                                                                    <td className="border p-2"></td>
                                                                    <td className="border p-2">{transaction.Balance}</td>

                                                                    {/* <td className="border p-2">{transaction.invoiceAmount}</td> */}
                                                                    {/* <td className="border p-2">{transaction.rentoutCashAmount || transaction.bookingCashAmount || transaction.returnCashAmount || 0}</td>
                                                            <td className="border p-2">{transaction.rentoutBankAmount || transaction.bookingBankAmount || transaction.returnBankAmount || 0}</td> */}
                                                                </tr>
                                                            </>
                                                        ) : (
                                                            <tr key={index}>
                                                                <td className="border p-2">{transaction.returnedDate || transaction.rentOutDate || transaction.cancelDate || transaction.bookingDate || transaction.date}</td>
                                                                <td className="border p-2">{transaction.invoiceNo || transaction.locCode}</td>
                                                                <td className="border p-2">{transaction.customerName}</td>
                                                                <td className="border p-2">{transaction.Category || transaction.type}</td>
                                                                <td className="border p-2">{transaction.SubCategory || transaction.category}</td>
                                                                <td className="border p-2">{transaction.remark}</td>
                                                                <td className="border p-2">

                                                                    {parseInt(transaction.returnCashAmount || 0) + parseInt(transaction.returnBankAmount || 0) ||
                                                                        parseInt(transaction.rentoutCashAmount || 0) + parseInt(transaction.rentoutBankAmount || 0) ||
                                                                        parseInt(transaction.bookingCashAmount || 0) + parseInt(transaction.bookingBankAmount || 0) + parseInt(transaction.bookingUPIAmount) ||
                                                                        parseInt(transaction.amount || -(parseInt(transaction.advanceAmount)) || 0)}                                                    </td>
                                                                <td className="border p-2">
                                                                    {parseInt(transaction.returnCashAmount || 0) + parseInt(transaction.returnBankAmount || 0) ||
                                                                        parseInt(transaction.rentoutCashAmount || 0) + parseInt(transaction.rentoutBankAmount || 0) ||
                                                                        transaction.TotaltransactionBooking ||
                                                                        parseInt(transaction.amount || -(parseInt(transaction.deleteBankAmount) + parseInt(transaction.deleteCashAmount)) || 0)}
                                                                </td>
                                                                <td className="border p-2">
                                                                    {parseInt(transaction.invoiceAmount) || parseInt(transaction.amount) || 0}
                                                                </td>
                                                                <td className="border p-2">
                                                                    {parseInt(transaction.rentoutCashAmount) || parseInt(transaction.bookingCashAmount) || parseInt(transaction.returnCashAmount) || parseInt(transaction.cash) || -(parseInt(transaction.deleteCashAmount)) || 0}
                                                                </td>
                                                                <td className="border p-2">
                                                                    {parseInt(transaction.rentoutBankAmount) || transaction.bookingBank || parseInt(transaction.returnBankAmount) || parseInt(transaction.bank) || -(parseInt(transaction.deleteBankAmount) + parseInt(transaction.deleteUPIAmount)) || 0}
                                                                </td>
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
                                                <td className="border border-gray-300 px-4 py-2 text-left" colSpan="9">Total:</td>

                                                {/* <td className="border border-gray-300 px-4 py-2">
                                       
                                        {
                                            filteredTransactions.reduce((sum, item) =>
                                                sum +
                                                (parseInt(item.securityAmount, 10) || 0) +
                                                (parseInt(item.Balance, 10) || 0) +
                                                (parseInt(item.returnCashAmount, 10) || 0) +
                                                (parseInt(item.returnBankAmount, 10) || 0) +
                                                (parseInt(item.rentoutCashAmount, 10) || 0) -
                                                (parseInt(item.bookingCashAmount, 10) || 0) + 
                                                (parseInt(item.bookingBankAmount, 10) || 0) +
                                                (parseInt(item.amount, 10) || 0),
                                                (parseInt(item.rentoutBankAmount, 10) || 0) +
                                                (parseInt(item.returnBankAmount, 10) || 0),
                                                0
                                            )
                                        }

                                    </td> */}

                                                {/* <td className="border border-gray-300 px-4 py-2">
                                        {filteredTransactions.reduce((sum, item) =>
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
                                        {filteredTransactions.reduce((sum, item) => sum + (parseInt(item.bookingCashAmount, 10) || 0), 0)}
                                    </td> */}

                                                {/* Total Cash (including opening balance) */}
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {

                                                        totalCash

                                                    }
                                                </td>

                                                {/* Total Bank (including opening balance) */}
                                                <td className="border border-gray-300 px-4 py-2">
                                                    {

                                                        totalBankAmount
                                                    }
                                                </td>
                                            </tr>
                                        </tfoot>

                                    </table>
                                </div>
                            </div>



                            <div>
                                <div className="p-6 flex  mt-[60px] bg-white relative shadow-md rounded-lg gap-[500px] w-full mx-auto">
                                    <div className='absolute top-2 right-2'>
                                        <button className='h-[50px] bg-blue-500 px-2 text-white  rounded-md hover:bg-blue-800 cursor-pointer' onClick={() => window.location.reload()}>Click Before save</button>
                                    </div>
                                    <div className=''>
                                        <div className="grid grid-cols-3 gap-4 border-b pb-4">
                                            <div className="font-bold">Denomination</div>
                                            <div className="font-bold">Quantity</div>
                                            <div className="font-bold">Amount</div>
                                            {denominations.map((denom, index) => (
                                                <React.Fragment key={index}>
                                                    <div className="p-2 bg-gray-100 rounded">{denom.label}</div>
                                                    <input
                                                        type="number"
                                                        value={quantities[index]}
                                                        onChange={(e) => handleChange(index, e.target.value)}
                                                        className="p-2 border rounded text-center"
                                                    />
                                                    <div className="p-2 bg-gray-100 rounded">
                                                        {quantities[index] ? quantities[index] * denom.value : "-"}
                                                    </div>
                                                </React.Fragment>
                                            ))}
                                        </div>

                                        <div className="flex justify-between mt-4 text-lg font-semibold">
                                            <span>TOTAL</span>
                                            <span>{totalAmount}</span>
                                        </div>
                                    </div>
                                    <div className='!w-[500px] mt-[300px]'>
                                        <div className="mt-6 border p-4 rounded-md">
                                            <div className="flex justify-between">
                                                <span>Closing Cash</span>
                                                <span className="font-bold">{totalCash}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span>Physical Cash</span>
                                                <span className="font-bold">{totalAmount}</span>
                                            </div>
                                            <div className="flex justify-between text-red-600">
                                                <span>Differences</span>
                                                <span className="font-bold">{(totalCash - totalAmount) * -1}</span>
                                            </div>
                                        </div>
                                        <div className='flex gap-2'>
                                            <button onClick={CreateCashBank} className="mt-6 w-full cursor-pointer bg-yellow-400 text-white py-2 rounded-lg flex items-center justify-center gap-2">
                                                <span>💾 save </span>
                                            </button>
                                            <button onClick={handlePrint} className="mt-6 w-full cursor-pointer bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2">
                                                <span>📥 Take pdf</span>
                                            </button>
                                        </div>

                                    </div>
                                </div>

                            </div>

                        </div>



                    </div>

                </div>


            </div>

        </>
    );
};

export default DayBookInc;
