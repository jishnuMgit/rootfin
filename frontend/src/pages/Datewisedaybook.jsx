import Headers from '../components/Header.jsx';
import { useEffect, useMemo, useRef, useState } from "react";
import Select from "react-select";
import useFetch from '../hooks/useFetch.jsx';
import baseUrl from '../api/api.js';
import { CSVLink } from 'react-csv';

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



// const opening = [{ cash: "60000", bank: "54000" }];
const Datewisedaybook = () => {

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");
    const [apiUrl, setApiUrl] = useState("");
    const [apiUrl1, setApiUrl1] = useState("");
    const [apiUrl2, setApiUrl2] = useState("");
    const [preOpen, setPreOpen] = useState([])

    const [apiUrl3, setApiUrl3] = useState("");
    const [apiUrl4, setApiUrl4] = useState("");
    const [apiUrl5, setApiUrl5] = useState("");
    console.log(apiUrl5);

    const currentusers = JSON.parse(localStorage.getItem("rootfinuser")); // Convert back to an object

    const handleFetch = () => {
        setPreOpen([])

        const fromDates = new Date(fromDate); // or use new Date() for current date

        // Subtract 1 day (24 hours)
        const previousDay = new Date(fromDates);
        previousDay.setDate(previousDay.getDate() - 1);
        const formattedDate = previousDay.toISOString().split('T')[0];

        const baseUrl1 = "https://rentalapi.rootments.live/api/GetBooking";
        const updatedApiUrl = `${baseUrl1}/GetBookingList?LocCode=${currentusers.locCode}&DateFrom=${fromDate}&DateTo=${toDate}`;
        const updatedApiUrl1 = `${baseUrl1}/GetRentoutList?LocCode=${currentusers.locCode}&DateFrom=${fromDate}&DateTo=${toDate}`;
        const updatedApiUrl2 = `${baseUrl1}/GetReturnList?LocCode=${currentusers.locCode}&DateFrom=${fromDate}&DateTo=${toDate}`;
        const updatedApiUrl3 = `${baseUrl.baseUrl}user/Getpayment?LocCode=${currentusers.locCode}&DateFrom=${fromDate}&DateTo=${toDate}`;
        const updatedApiUrl4 = `${baseUrl1}/GetDeleteList?LocCode=${currentusers.locCode}&DateFrom=${fromDate}&DateTo=${toDate}`
        const updatedApiUrl5 = `${baseUrl.baseUrl}user/getsaveCashBank?locCode=${currentusers.locCode}&date=${formattedDate}`

        setApiUrl(updatedApiUrl);
        setApiUrl1(updatedApiUrl1);
        setApiUrl2(updatedApiUrl2);
        // alert(updatedApiUrl3)
        setApiUrl3(updatedApiUrl3)
        setApiUrl4(updatedApiUrl4)
        setApiUrl5(updatedApiUrl5)
        GetCreateCashBank(updatedApiUrl5)

        // console.log("API URLs Updated:", updatedApiUrl2);
    };


    const GetCreateCashBank = async (api) => {
        try {
            const response = await fetch(api, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // alert(apiUrl5)

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
    }, [])
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

    // Memoizing fetch options
    const fetchOptions = useMemo(() => ({}), []);

    const { data } = useFetch(apiUrl, fetchOptions);//booking
    const { data: data1 } = useFetch(apiUrl1, fetchOptions);//rentout
    const { data: data2 } = useFetch(apiUrl2, fetchOptions);//return
    const { data: data3 } = useFetch(apiUrl3, fetchOptions);//cancel
    const { data: data4 } = useFetch(apiUrl4, fetchOptions);//all
    // alert(data3);
    // console.log(data2);

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
    const Transactionsall = (data3?.data || []).map(transaction => ({
        ...transaction,
        locCode: currentusers.locCode,
        date: transaction.date.split("T")[0],// Correctly extract only the date
        Category: transaction.type,
        cash1: transaction.cash,
        bank1: transaction.bank,
        subCategory: transaction.category,
        billValue: transaction.amount,




    }));
    // alert(Transactionsall);


    const canCelTransactions = (data4?.dataSet?.data || []).map(transaction => ({
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
    // alert(apiUrl4)
    // console.log("Hi" + data4);
    // alert(canCelTransactions)
    const allTransactions = [...bookingTransactions, ...rentOutTransactions, ...returnOutTransactions, ...canCelTransactions, ...Transactionsall];
    console.log(data4);

    // console.log(allTransactions);
    const [selectedCategory, setSelectedCategory] = useState(categories[0]);
    const [selectedSubCategory, setSelectedSubCategory] = useState(subCategories[0]);






    // Filter transactions based on category & subcategory
    const selectedCategoryValue = selectedCategory?.value?.toLowerCase() || "all";
    const selectedSubCategoryValue = selectedSubCategory?.value?.toLowerCase() || "all";

    const filteredTransactions = allTransactions.filter((t) =>
        (selectedCategoryValue === "all" || (t.category?.toLowerCase() === selectedCategoryValue || t.Category?.toLowerCase() === selectedCategoryValue || t.type?.toLowerCase() === selectedCategoryValue || t.type?.toLowerCase() === selectedCategoryValue)) &&
        (selectedSubCategoryValue === "all" || (t.subCategory?.toLowerCase() === selectedSubCategoryValue || t.SubCategory?.toLowerCase() === selectedSubCategoryValue || t.type?.toLowerCase() === selectedSubCategoryValue || t.type?.toLowerCase() === selectedSubCategoryValue || t.subCategory1?.toLowerCase() === selectedSubCategoryValue || t.SubCategory1?.toLowerCase() === selectedSubCategoryValue || t.category?.toLowerCase() === selectedSubCategoryValue || t.category?.toLowerCase() === selectedSubCategoryValue))
    );


    const totalBankAmount =
        (filteredTransactions?.reduce((sum, item) =>
            sum +
            (parseInt(item.bookingBank1, 10) || 0) +
            (parseInt(item.bank1, 10) || 0) +
            (parseInt(item.rentoutBankAmount, 10) || 0) +
            (parseInt(item.deleteBankAmount, 10) || 0) * -1 +
            (parseInt(item.returnBankAmount, 10) || 0),
            0
        ) || 0);

    // {parseInt(transaction.rentoutBankAmount) || transaction.bookingBank || parseInt(transaction.returnBankAmount) || parseInt(transaction.bank) || -(parseInt(transaction.deleteBankAmount) + parseInt(transaction.deleteUPIAmount)) || 0}


    const totalCash = (
        filteredTransactions?.reduce((sum, item) =>
            sum +
            (parseInt(item.bookingCashAmount, 10) || 0) +
            (parseInt(item.rentoutCashAmount, 10) || 0) +
            (parseInt(item.cash1, 10) || 0) +
            ((parseInt(item.deleteCashAmount, 10) || 0) * -1) + // Ensure deletion is properly subtracted
            (parseInt(item.returnCashAmount, 10) || 0),
            0
        ) + (parseInt(preOpen?.cash, 10) || 0)


    );


    const totalBankAmount1 =
        (filteredTransactions?.reduce((sum, item) =>
            sum +
            (parseInt(item.rentoutUPIAmount, 10) || 0) +
            (parseInt(item.returnUPIAmount, 10) || 0) +
            (parseInt(item.bookingUPIAmount, 10) || 0) +
            (parseInt(item.deleteUPIAmount, 10) || 0) * -1, // Ensure negative value is applied correctly
            0
        ) || 0);


    // const totalBankAmountupi =
    //     (filteredTransactions?.reduce((sum, item) =>
    //         sum +
    //         (parseInt(item.rentoutUPIAmount, 10) || 0) +
    //         (parseInt(item.bookingUPIAmount, 10) || 0) +
    //         (parseInt(item.returnUPIAmount, 10) || 0) +
    //         (parseInt(item.deleteUPIAmount, 10) || 0) * -1,
    //         0
    //     ) || 0);
    // alert(preOpen.bank)
    return (

        <div>
            <Headers title={"Financial Summary Report"} />
            <div className='ml-[240px]'>
                <div className="p-6 bg-gray-100 min-h-screen">
                    {/* Dropdowns */}
                    <div className="flex gap-4 mb-6 w-[800px]">
                        <div className='w-full flex flex-col '>
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

                    <div ref={printRef}>
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
                                        {/* Opening Balance */}
                                        <tr className="bg-gray-100 font-bold">
                                            <td colSpan="9" className="border p-2">OPENING BALANCE</td>
                                            <td className="border p-2">{preOpen.Closecash}</td>
                                            <td className="border p-2">0</td>
                                            <td className="border p-2">0</td>
                                        </tr>

                                        {/* Transactions */}
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
                                                                {-(parseInt(transaction.deleteCashAmount)) || parseInt(transaction.rentoutCashAmount) || parseInt(transaction.bookingCashAmount) || parseInt(transaction.returnCashAmount) || parseInt(transaction.cash) || 0}
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

                                    {/* Footer Totals */}
                                    <tfoot>
                                        <tr className="bg-white text-center font-semibold">
                                            <td colSpan="9" className="border px-4 py-2 text-left">Total:</td>
                                            <td className="border px-4 py-2">{totalCash}</td>
                                            <td className="border px-4 py-2">{totalBankAmount}</td>
                                            <td className="border px-4 py-2">{totalBankAmount1}</td>
                                        </tr>
                                    </tfoot>
                                </table>

                            </div>
                        </div>
                    </div>

                    <button onClick={handlePrint} className="mt-6 w-[200px] float-right cursor-pointer bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2">
                        <span>📥 Take pdf</span>
                    </button>


                    {/* 
                   */}

                    <CSVLink data={filteredTransactions} headers={headers} filename={`${fromDate} to ${toDate} report.csv`}>
                        <button className="mt-6 w-[200px] float-right cursor-pointer bg-blue-600 text-white py-2 rounded-lg mr-[30px] flex items-center justify-center gap-2">Export CSV</button>
                    </CSVLink>


                </div>

            </div>

        </div>
    )
}

export default Datewisedaybook