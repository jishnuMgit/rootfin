import { CSVLink } from "react-csv";
import Headers from '../components/Header.jsx';
import React, { useEffect, useMemo, useState } from "react";
import Select from "react-select";
import useFetch from '../hooks/useFetch.jsx';
import baseUrl from '../api/api.js';
import { useRef } from "react";



const headers = [
    { label: "Date", key: "date", },
    { label: "Invoice No", key: "invoiceNo" },
    { label: "Customer Name", key: "customerName" },
    { label: "Category", key: "Category" },
    { label: "Sub Category", key: "SubCategory" },
    { label: "Balance Payable", key: "SubCategory1" },
    { label: "Remarks", key: "remarks" },
    { label: "Amount", key: "amount" },
    { label: "Total Transaction", key: "totalTransaction" },
    { label: "Bill Value", key: "billValue" },
    { label: "Cash", key: "cash" },
    { label: "Bank", key: "bank" },
    { label: "UPI", key: "upi" },
];

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
    { value: "shoe sales", label: "shoe sales" }
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
    const [preOpen1, setPreOpen1] = useState([])
    const [loading, setLoading] = useState(false)


    const date1 = new Date();
    const previousDate = new Date(date1);
    previousDate.setDate(date1.getDate() - 1);
    const TodayDate = `${String(date1.getDate()).padStart(2, '0')}-${String(date1.getMonth() + 1).padStart(2, '0')}-${date1.getFullYear()}`;
    const previousDate1 = `${String(previousDate.getDate()).padStart(2, '0')}-${String(previousDate.getMonth() + 1).padStart(2, '0')}-${previousDate.getFullYear()}`;
    const date = TodayDate;

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
    const apiUrl7 = `${baseUrl.baseUrl}user/getsaveCashBank?locCode=${currentusers.locCode}&date=${currentDate}`

    // alert(apiurl1)

    const locCode = currentusers?.locCode
    const email = currentusers?.email

    // alert(apiurl1)

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
    // alert(apiUrl2)
    const { data: data3 } = useFetch(apiUrl3, fetchOptions);

    const { data: data4 } = useFetch(apiUrl4, fetchOptions);

    // console.log(data1);
    const bookingTransactions = (data?.dataSet?.data || []).map(transaction => {
        const bookingCashAmount = parseInt(transaction?.bookingCashAmount || 0, 10);
        const bookingBankAmount = parseInt(transaction?.bookingBankAmount || 0, 10);
        const bookingUPIAmount = parseInt(transaction?.bookingUPIAmount || 0, 10);
        const invoiceAmount = parseInt(transaction?.invoiceAmount || 0, 10);

        const totalAmount = bookingCashAmount + bookingBankAmount + bookingUPIAmount;

        return {
            ...transaction,
            date: transaction?.bookingDate || null,
            bookingCashAmount,
            bookingBankAmount,
            billValue: transaction.invoiceAmount,

            invoiceAmount,
            bookingBank1: bookingBankAmount,
            TotaltransactionBooking: totalAmount,
            Category: "Booking",
            SubCategory: "Advance",
            totalTransaction: totalAmount,
            cash: bookingCashAmount,
            bank: bookingBankAmount,
            upi: bookingUPIAmount,
            amount: totalAmount,
        };
    });

    const canCelTransactions = (data3?.dataSet?.data || []).map(transaction => ({
        ...transaction,
        date: transaction.cancelDate,
        Category: "Cancel",
        SubCategory: "cancellation Refund",
        billValue: transaction.invoiceAmount,
        amount: parseInt(transaction.deleteUPIAmount) + parseInt(transaction.deleteCashAmount) + parseInt(transaction.deleteBankAmount),
        totalTransaction: parseInt(transaction.deleteUPIAmount) + parseInt(transaction.deleteCashAmount) + parseInt(transaction.deleteBankAmount),
        cash: parseInt(transaction.deleteCashAmount),
        bank: parseInt(transaction.deleteBankAmount),
        upi: parseInt(transaction.deleteUPIAmount),

    }));
    const Transactionsall = (data4?.data || []).map(transaction => ({
        ...transaction,
        locCode: currentusers.locCode,
        date: transaction.date.split("T")[0],// Correctly extract only the date
        Category: transaction.type,
        subCategory: transaction.category,
        billValue: transaction.amount,



    }));
    const rentOutTransactions = (data1?.dataSet?.data || []).map(transaction => {
        const rentoutCashAmount = parseInt(transaction?.rentoutCashAmount ?? 0, 10);
        const rentoutBankAmount = parseInt(transaction?.rentoutBankAmount ?? 0, 10);
        const invoiceAmount = parseInt(transaction?.invoiceAmount ?? 0, 10);

        const advanceAmount = parseInt(transaction?.advanceAmount ?? 0, 10);
        const rentoutUPIAmount = parseInt(transaction?.rentoutUPIAmount ?? 0, 10);
        const securityAmount = parseInt(transaction?.securityAmount ?? 0, 10);

        return {
            ...transaction,
            date: transaction?.rentOutDate ?? "",
            rentoutCashAmount,
            rentoutBankAmount,
            invoiceAmount,
            billValue: transaction.invoiceAmount,

            securityAmount,
            advanceAmount,
            Balance: invoiceAmount - advanceAmount,
            rentoutUPIAmount,
            Category: "RentOut",
            SubCategory: "Security",
            SubCategory1: "Balance Payable",
            totalTransaction: rentoutCashAmount + rentoutBankAmount + rentoutUPIAmount,
            cash: rentoutCashAmount,
            bank: rentoutBankAmount,
            upi: rentoutUPIAmount,
            amount: rentoutCashAmount + rentoutBankAmount + rentoutUPIAmount,
        };
    });



    //return

    const returnOutTransactions = (data2?.dataSet?.data || []).map(transaction => {
        const returnBankAmount = -(parseInt(transaction?.returnBankAmount || 0, 10));
        const returnCashAmount = -(parseInt(transaction?.returnCashAmount || 0, 10));
        const returnUPIAmount = -(parseInt(transaction?.returnUPIAmount || 0, 10));
        const invoiceAmount = parseInt(transaction?.invoiceAmount || 0, 10);
        const advanceAmount = parseInt(transaction?.advanceAmount || 0, 10);
        const RsecurityAmount = -(parseInt(transaction?.securityAmount || 0, 10));

        const totalAmount = returnBankAmount + returnCashAmount + returnUPIAmount;

        return {
            ...transaction,
            date: transaction?.returnedDate || null,
            returnBankAmount,
            returnCashAmount,
            returnUPIAmount,
            invoiceAmount,
            advanceAmount,
            billValue: invoiceAmount,
            amount: totalAmount,
            totalTransaction: totalAmount,
            RsecurityAmount,
            Category: "Return",
            SubCategory: "Security Refund",
            cash: returnCashAmount,
            bank: returnBankAmount,
            upi: returnUPIAmount,
        };
    });



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

    const totalBankAmount1 =
        (filteredTransactions?.reduce((sum, item) =>
            sum +
            (parseInt(item.bookingBank1, 10) || 0) +
            (parseInt(item.bank, 10) || 0) +
            (parseInt(item.rentoutBankAmount, 10) || 0) +
            (parseInt(item.deleteBankAmount, 10) || 0) * -1 +
            (parseInt(item.returnBankAmount, 10) || 0),
            0
        ) || 0);


    const totalBankAmountupi =
        (filteredTransactions?.reduce((sum, item) =>
            sum +
            (parseInt(item.rentoutUPIAmount, 10) || 0) +
            (parseInt(item.bookingUPIAmount, 10) || 0) +
            (parseInt(item.returnUPIAmount, 10) || 0) +
            (parseInt(item.deleteUPIAmount, 10) || 0) * -1,
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
        date,
        locCode,
        email,
        totalCash,
        totalAmount,
        totalBankAmount

    }
    // console.log(savedData);

    const CreateCashBank = async () => {



        // alert(savedData.totalAmount)
        if (savedData.totalAmount === 0) {
            return alert('You have entered 0 as cash. If cash is missing, please inform the Rootments office.')
        }
        setLoading(true)
        try {
            const response = await fetch(apiUrl5, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(savedData),
            });

            if (response.status === 401) {
                setLoading(false)
                return alert("Error: Data already saved for today.");
            } else if (!response.ok) {
                setLoading(false)
                return alert(JSON.stringify(response), null, 2);
            }

            const data = await response.json();
            console.log("Data saved successfully:", data);

            alert("Data saved successfully");
            setLoading(false)
            window.location.reload();

        } catch (error) {
            console.error("Error saving data:", error);
            alert("An unexpected error occurred.");
            setLoading(false)

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

    const takeCreateCashBank = async () => {
        try {
            const response = await fetch(apiUrl7, {
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
            setPreOpen1(data?.data)
        } catch (error) {
            console.error("Error saving data:", error);
        }
    };
    useEffect(() => {
        GetCreateCashBank()
        takeCreateCashBank()
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
                                        <thead>
                                            <tr className="bg-[#7C7C7C] text-white">
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
                                                <th className="border p-2">UPI</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {/* Opening Balance Row */}
                                            <tr className="bg-gray-100 font-bold">
                                                <td colSpan="9" className="border p-2">OPENING BALANCE</td>
                                                <td className="border p-2">{preOpen.Closecash}</td>
                                                <td className="border p-2">0</td>
                                                <td className="border p-2">0</td>
                                            </tr>

                                            {/* Transaction Rows */}
                                            {filteredTransactions.length > 0 ? (
                                                filteredTransactions.map((transaction, index) => (
                                                    <>
                                                        {transaction.Category === 'RentOut' ? (
                                                            <>
                                                                <tr key={`${index}-1`}>
                                                                    <td className="border p-2">{transaction.date}</td>
                                                                    <td className="border p-2">{transaction.invoiceNo}</td>
                                                                    <td className="border p-2">{transaction.customerName}</td>
                                                                    <td rowSpan="2" className="border p-2">{transaction.Category}</td>
                                                                    <td className="border p-2">{transaction.SubCategory}</td>
                                                                    <td className="border p-2"></td>
                                                                    <td className="border p-2">{transaction.securityAmount || 0}</td>
                                                                    <td rowSpan="2" className="border p-2">
                                                                        {transaction.securityAmount + transaction.Balance}
                                                                    </td>
                                                                    <td rowSpan="2" className="border p-2">{transaction.invoiceAmount}</td>
                                                                    <td rowSpan="2" className="border p-2">{transaction.rentoutCashAmount || 0}</td>
                                                                    <td rowSpan="2" className="border p-2">{parseInt(transaction.rentoutBankAmount) || 0}</td>
                                                                    <td rowSpan="2" className="border p-2">{parseInt(transaction.rentoutUPIAmount) || 0}</td>
                                                                </tr>
                                                                <tr key={`${index}-2`}>
                                                                    <td className="border p-2">{transaction.rentOutDate || transaction.bookingDate}</td>
                                                                    <td className="border p-2">{transaction.invoiceNo}</td>
                                                                    <td className="border p-2">{transaction.customerName}</td>
                                                                    <td className="border p-2">{transaction.SubCategory1}</td>
                                                                    <td className="border p-2"></td>
                                                                    <td className="border p-2">{transaction.Balance}</td>
                                                                </tr>
                                                            </>
                                                        ) : (
                                                            <tr key={index}>
                                                                <td className="border p-2">{transaction.date}</td>
                                                                <td className="border p-2">{transaction.invoiceNo || transaction.locCode}</td>
                                                                <td className="border p-2">{transaction.customerName}</td>
                                                                <td className="border p-2">{transaction.Category || transaction.type}</td>
                                                                <td className="border p-2">{transaction.SubCategory || transaction.category}</td>
                                                                <td className="border p-2">{transaction.remark}</td>
                                                                <td className="border p-2">
                                                                    {parseInt(transaction.returnCashAmount || 0) + parseInt(transaction.returnBankAmount || 0) ||
                                                                        parseInt(transaction.rentoutCashAmount || 0) + parseInt(transaction.rentoutBankAmount || 0) ||
                                                                        parseInt(transaction.bookingCashAmount || 0) + parseInt(transaction.bookingBankAmount || 0) + parseInt(transaction.bookingUPIAmount || 0) ||
                                                                        parseInt(transaction.amount || -(parseInt(transaction.advanceAmount || 0)) || 0)}
                                                                </td>
                                                                <td className="border p-2">
                                                                    {parseInt(transaction.returnCashAmount || 0) + parseInt(transaction.returnBankAmount || 0) ||
                                                                        parseInt(transaction.rentoutCashAmount || 0) + parseInt(transaction.rentoutBankAmount || 0) ||
                                                                        transaction.TotaltransactionBooking ||
                                                                        parseInt(transaction.amount || -(parseInt(transaction.deleteBankAmount || 0) + parseInt(transaction.deleteCashAmount || 0)) || 0)}
                                                                </td>
                                                                <td className="border p-2">
                                                                    {parseInt(transaction.invoiceAmount) || parseInt(transaction.amount) || 0}
                                                                </td>
                                                                <td className="border p-2">
                                                                    {parseInt(transaction.rentoutCashAmount) || parseInt(transaction.bookingCashAmount) || parseInt(transaction.returnCashAmount) || parseInt(transaction.cash) || -(parseInt(transaction.deleteCashAmount)) || 0}
                                                                </td>
                                                                <td className="border p-2">
                                                                    {parseInt(transaction.rentoutBankAmount) || parseInt(transaction.bank) || parseInt(transaction.bookingBank1) || parseInt(transaction.returnBankAmount) || parseInt(transaction.deleteBankAmount) * -1 || 0}
                                                                </td>
                                                                <td className="border p-2">
                                                                    {parseInt(transaction.rentoutUPIAmount) || parseInt(transaction.bookingUPIAmount) || parseInt(transaction.returnUPIAmount) || parseInt(transaction.deleteUPIAmount) * -1 || 0}
                                                                </td>
                                                            </tr>
                                                        )}
                                                    </>
                                                ))
                                            ) : (
                                                <tr>
                                                    <td colSpan="12" className="text-center border p-4">No transactions found</td>
                                                </tr>
                                            )}
                                        </tbody>

                                        <tfoot>
                                            <tr className="bg-white text-center font-semibold">
                                                <td colSpan="9" className="border border-gray-300 px-4 py-2 text-left">Total:</td>
                                                <td className="border border-gray-300 px-4 py-2">{totalCash}</td>
                                                <td className="border border-gray-300 px-4 py-2">{totalBankAmount1}</td>
                                                <td className="border border-gray-300 px-4 py-2">{totalBankAmountupi}</td>
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
                                            <span>{preOpen1?.cash || totalAmount}</span>
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
                                                <span className="font-bold">{preOpen1?.Closecash ? preOpen1?.cash : totalAmount}</span>
                                            </div>
                                            <div className="flex justify-between text-red-600">
                                                <span>Differences</span>
                                                <span className="font-bold">{preOpen1?.cash ? (totalCash - preOpen1?.cash) * -1 : (totalCash - totalAmount) * -1}</span>
                                            </div>
                                        </div>
                                        <div className='flex gap-2'>
                                            {
                                                loading ? !preOpen1?.cash && <button className="mt-6 w-full cursor-pointer bg-yellow-400 text-white py-2 rounded-lg flex items-center justify-center gap-2">
                                                    <span>🔃 Loading...! </span>
                                                </button> : !preOpen1?.cash && <button onClick={CreateCashBank} className="mt-6 w-full h-10 cursor-pointer bg-yellow-400 text-white py-2 rounded-lg flex items-center justify-center gap-2">
                                                    <span>💾 save </span>
                                                </button>
                                            }
                                            {!loading ? preOpen1?.cash && <button onClick={handlePrint} className="mt-6 w-full cursor-pointer bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2">
                                                <span>📥 Take pdf</span>
                                            </button> : ""}
                                            <CSVLink data={filteredTransactions} headers={headers} filename={`${currentDate} DayBook report.csv`}>
                                                <button className="bg-blue-500 text-white ml-10  h-10  w-[100px] mt-5 p-2 rounded">Export CSV</button>
                                            </CSVLink>
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
