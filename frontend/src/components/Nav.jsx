import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { FileText, ChevronDown, ShoppingBag, LineChart, DollarSign, FolderClosed,  Notebook } from "lucide-react";
const Nav = () => {
    const location = useLocation();
    const currentuser = JSON.parse(localStorage.getItem("rootfinuser")); // Convert back to an object

    const activePath = location.pathname;

    const getTabClasses = (path) =>
        `
        ${activePath === path ? "bg-[#3758F9] text-white font-semibold" : ""}`;

    const getTabClasses1 = (path) =>
        `
            ${activePath === path ? "text-[#3758F9]" : ""}`;

    const [isOpen, setIsOpen] = useState(true);
    const [homeOpen, setHomeOpen] = useState(false);

    const [homeOpen1, setHomeOpen1] = useState(false);
    console.log(setIsOpen);

    // alert(location.pathname)
    return (
        <div className={`flex ${location.pathname === "/login" ? "hidden" : "block"}`}
        >
            {/* Sidebar */}
            <div className={`fixed top-0 left-0 h-full bg-[#EEF1FF] text-[#53545C] w-64 p-5 transform ${isOpen ? "translate-x-0" : "-translate-x-64"} transition-transform duration-300`}>
                {/* <button className="text-white mb-5" onClick={() => setIsOpen(false)}>
                <X size={24} />
            </button> */}
                <nav className="space-y-4">
                    {/* Home with Submenu */}
                    <div>
                        <Link to={'/'}>
                            <button
                                onClick={() => setHomeOpen(!homeOpen)}
                                className={`flex items-center justify-between w-full p-3 rounded hover:bg-[#3758F9] hover:text-white ${getTabClasses('/')}${getTabClasses('/datewisedaybook')}${getTabClasses('/securityReport')}${getTabClasses('/Revenuereport')}`}>
                                <div className="flex items-center space-x-3">
                                    <FileText size={20} />
                                    <span>Reports</span>
                                </div>
                                <ChevronDown size={20} className={`${homeOpen ? "rotate-180" : "rotate-0"} transition-transform`} />
                            </button>

                        </Link>
                        {homeOpen && (
                            <div className="ml-8 space-y-2">
                                <Link to="/" className={`block p-2 rounded hover:bg-[#86aeff] hover:text-white ${getTabClasses1("/")}`}>Day Book</Link>
                                <Link to="/datewisedaybook" className={`block p-2 rounded hover:bg-[#86aeff] hover:text-white ${getTabClasses1('/datewisedaybook')}`}>Financial Summary Report</Link>
                                <Link to="/securityReport" className={`block p-2 rounded hover:bg-[#86aeff] hover:text-white ${getTabClasses1('/securityReport')}`}>Security Report</Link>
                                <Link to="/Revenuereport" className={`block p-2 rounded hover:bg-[#86aeff] hover:text-white ${getTabClasses1('/Revenuereport')}`}>Revenue Report</Link>

                            </div>
                        )}
                    </div>

                    <div>
                        <Link to={'/BookingReport'}>
                            <button
                                onClick={() => setHomeOpen1(!homeOpen1)}
                                className={`flex items-center justify-between w-full p-3 rounded hover:bg-[#3758F9] hover:text-white ${getTabClasses('/BookingReport')} ${getTabClasses('/RentOutReport')}`}>
                                <div className="flex items-center space-x-3">
                                    <ShoppingBag size={20} />
                                    <span>Quantity Reports</span>
                                </div>
                                <ChevronDown size={20} className={`${homeOpen1 ? "rotate-180" : "rotate-0"} transition-transform`} />
                            </button>

                        </Link>
                        {homeOpen1 && (
                            <div className="ml-8 space-y-2">
                                <Link to="/BookingReport" className={`block p-2 rounded hover:bg-[#86aeff] hover:text-white ${getTabClasses1('/BookingReport')}`}>Booking Report</Link>
                                <Link to="/RentOutReport" className={`block p-2 rounded hover:bg-[#86aeff] hover:text-white ${getTabClasses1('/RentOutReport')} `}>Rent Out Report</Link>
                            </div>
                        )}
                    </div>

                    <Link to="/Income&Expenses" className={`flex items-center space-x-3 p-3 rounded hover:bg-[#3758F9] hover:text-white ${getTabClasses1("/Income&Expenses")}`}>
                        <LineChart size={20} />
                        <span>Income & Expenses</span>
                    </Link>
                    <Link to="/CashBankLedger" className={`flex items-center space-x-3 p-3 rounded hover:bg-[#3758F9] hover:text-white ${getTabClasses1("/CashBankLedger")}`}>
                        <DollarSign size={20} />
                        <span>Cash / Bank Ledger</span>
                    </Link>

                    {
                        currentuser.power === 'admin' && <Link to="/CloseReport" className={`flex items-center space-x-3 p-3 rounded hover:bg-[#3758F9] hover:text-white ${getTabClasses1("/CloseReport")}`}>
                            <FolderClosed size={20} />
                            <span>Close  Report</span>
                        </Link>

                    }
                     {
                        currentuser.power === 'admin' && <Link to="/AdminClose" className={`flex items-center space-x-3 p-3 rounded hover:bg-[#3758F9] hover:text-white ${getTabClasses1("/AdminClose")}`}>
                            <Notebook size={20} />
                            <span>Admin Close</span>
                        </Link>

                    }
                </nav>

            </div>

            {/* Menu Button */}
            {/* <button className="fixed top-5 left-5 text-gray-900 bg-gray-200 p-2 rounded-md shadow-md" onClick={() => setIsOpen(true)}>
            <Menu size={24} />
        </button> */}
        </div>
    )
}

export default Nav





// import { IoPersonCircleOutline } from "react-icons/io5";








