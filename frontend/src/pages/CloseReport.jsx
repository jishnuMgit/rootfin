import { useRef, useState } from 'react';
import Headers from '../components/Header';
import baseUrl from '../api/api';

const CloseReport = () => {
  const AllLoation = [
    { "locName": "Z-Edapally1", "locCode": "144" },
    // { "locName": "Warehouse", "locCode": "858" },
    { "locName": "G-Edappally", "locCode": "702" },
    // { "locName": "HEAD OFFICE01", "locCode": "759" },
    { "locName": "SG-Trivandrum", "locCode": "700" },
    { "locName": "Z- Edappal", "locCode": "100" },
    { "locName": "Z.Perinthalmanna", "locCode": "133" },
    { "locName": "Z.Kottakkal", "locCode": "122" },
    { "locName": "G.Kottayam", "locCode": "701" },
    { "locName": "G.Perumbavoor", "locCode": "703" },
    { "locName": "G.Thrissur", "locCode": "704" },
    { "locName": "G.Chavakkad", "locCode": "706" },
    { "locName": "G.Calicut ", "locCode": "712" },
    { "locName": "G.Vadakara", "locCode": "708" },
    { "locName": "G.Edappal", "locCode": "707" },
    { "locName": "G.Perinthalmanna", "locCode": "709" },
    { "locName": "G.Kottakkal", "locCode": "711" },
    { "locName": "G.Manjeri", "locCode": "710" },
    { "locName": "G.Palakkad ", "locCode": "705" },
    { "locName": "G.Kalpetta", "locCode": "717" },
    { "locName": "G.Kannur", "locCode": "716" }
  ];

  const [fromDate, setFromDate] = useState("");
  const [data, setData] = useState([]);
  const [filter, setFilter] = useState("All");
  const printRef = useRef(null);

  const currentuser = JSON.parse(localStorage.getItem("rootfinuser"));

  const formatDate = (inputDate) => {
    const [year, month, day] = inputDate.split("-");
    return `${year}-${month}-${day}`;
  };

  const handleFetch = async () => {
    if (!fromDate) return alert("Please select a date first.");

    const formattedDate = formatDate(fromDate);
    const updatedApiUrl = `${baseUrl?.baseUrl}user/AdminColseView?date=${formattedDate}&role=${currentuser?.power}`;

    try {
      const response = await fetch(updatedApiUrl);
      if (response.status === 401) {
        return alert("Error: Data already saved for today.");
      } else if (!response.ok) {
        return alert("Error: Failed to fetch data.");
      }

      const result = await response.json();
      const mappedData = (result?.data || []).map(transaction => {
        const match = transaction.Closecash === transaction.cash ? 'Match' : 'Mismatch';
        const foundLoc = AllLoation.find(item => item.locCode === transaction.locCode);
        const storeName = foundLoc ? foundLoc.locName : "Unknown";
        return { ...transaction, match, storeName };
      });

      setData({ ...result, data: mappedData });
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("An unexpected error occurred.");
    }
  };

  const filteredTransactions = (data?.data || []).filter(transaction => {
    if (filter === "All") return true;
    return transaction.match === filter;
  });

  const NotClosingBranch = AllLoation.filter((loc) => {
    return !filteredTransactions.some((txn) => txn.storeName === loc.locName);
  });



  const handlePrint = () => {
    const printContent = printRef.current.innerHTML;
    const originalContent = document.body.innerHTML;
    console.log(originalContent);


    document.body.innerHTML = `<html><head><title>Booking Report</title>
      <style>
        @page { size: tabloid; margin: 10mm; }
        body { font-family: Arial, sans-serif; }
        table { width: 100%; border-collapse: collapse; }
        th, td { border: 1px solid black; padding: 8px; text-align: left; white-space: nowrap; }
        tr { break-inside: avoid; }
      </style>
    </head><body>${printContent}</body></html>`;

    window.print();
    window.location.reload();
  };

  return (
    <div>
      <Headers title={'Booking Report'} />
      <div className='ml-[240px]'>
        <div className="p-6 bg-gray-100 min-h-screen">
          {/* Date Input */}
          <div className="flex gap-4 mb-6 w-[600px]">
            <div className='w-full flex flex-col'>
              <label htmlFor="from">From *</label>
              <input
                type="date"
                id="from"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className='border border-gray-300 py-[6px]'
              />
            </div>

            <button
              disabled={!fromDate}
              className={`w-[400px] h-[40px] mt-[20px] rounded-md text-white ${fromDate ? 'bg-blue-500' : 'bg-blue-300 cursor-not-allowed'}`}
              onClick={handleFetch}
            >
              Fetch
            </button>
          </div>

          {/* Match Filter Buttons */}
          <div className="mb-4 flex gap-4">
            <button onClick={() => setFilter("All")} className={`px-4 py-2 rounded ${filter === 'All' ? 'bg-blue-600 text-white' : 'bg-gray-300'}`}>All</button>
            <button onClick={() => setFilter("Match")} className={`px-4 py-2 rounded ${filter === 'Match' ? 'bg-green-600 text-white' : 'bg-gray-300'}`}>Match</button>
            <button onClick={() => setFilter("Mismatch")} className={`px-4 py-2 rounded ${filter === 'Mismatch' ? 'bg-red-600 text-white' : 'bg-gray-300'}`}>Mismatch</button>
          </div>

          {/* Table */}
          <div ref={printRef}>
            <div className="bg-white p-4 shadow-md rounded-lg">
              <table className="w-full border-collapse border rounded-md border-gray-300">
                <thead>
                  <tr className="bg-[#7C7C7C] text-white">
                    <th className="border p-2">No.of</th>
                    <th className="border p-2">Date</th>
                    <th className="border p-2">Store</th>
                    <th className="border p-2">locCode</th>
                    <th className="border p-2">Bank</th>
                    <th className="border p-2">Cash</th>
                    <th className="border p-2">Close Cash</th>
                    <th className="border p-2">difference</th>
                    <th className="border p-2">Match</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.length > 0 ? (
                    filteredTransactions.map((transaction, index) => (

                      <tr key={index}>
                        <td className="border p-2">{index + 1}</td>

                        <td className="border p-2">{transaction.date.split('T')[0]}</td>
                        <td className="border p-2">{transaction.storeName}</td>
                        <td className="border p-2">{transaction.locCode}</td>
                        <td className="border p-2">{transaction.bank}</td>
                        <td className="border p-2">{transaction.cash}</td>
                        <td className="border p-2">{transaction.Closecash}</td>
                        <td className='border p-2'>{Math.abs(transaction.cash - transaction.Closecash)}</td>
                        <td className={`border p-2 ${transaction.match === 'Match' ? 'text-green-600 font-bold' : 'text-red-600 font-bold'}`}>
                          {transaction.match}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="9" className="text-center border p-4">
                        {!fromDate ? "Select date first" : "No transactions found"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>

          <h1 className='mt-10 mb-10 ml-10 text-xl font-bold text-red-500'>
            They haven’t closed their store balance          </h1>

          <table className="w-full border-collapse border rounded-md border-red-400">
            <thead>
              <tr className="bg-[#7C7C7C] text-white">
                <th className="border border-red-400 p-2">No.of</th>
                <th className="border border-red-400 p-2">Date</th>
                <th className="border border-red-400 p-2">Store</th>
                <th className="border border-red-400 p-2">locCode</th>

              </tr>
            </thead>
            <tbody>
              {NotClosingBranch.length > 0 ? (
                NotClosingBranch.map((transaction, index) => (

                  <tr key={index}>
                    <td className="border border-red-400 p-2">{index + 1}</td>

                    <td className="border border-red-400 p-2">{fromDate}</td>
                    <td className="border border-red-400 p-2">{transaction.locName}</td>
                    <td className="border border-red-400 p-2">{transaction.locCode}</td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="9" className="text-center border border-red-400 p-4">
                    {!fromDate ? "Select date first" : "No transactions found"}
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          {/* Print Button */}
          <button
            onClick={handlePrint}
            className="mt-6 w-[200px] float-right bg-blue-600 text-white py-2 rounded-lg flex items-center justify-center gap-2"
          >
            📥 Take PDF
          </button>
        </div>
      </div>
    </div>
  );
};

export default CloseReport;
