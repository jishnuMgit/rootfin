import { Link, useLocation } from "react-router-dom";

const Head = () => {
    const location = useLocation();

    // Define which tab should have the active background
    const activePath = location.pathname;

    const getTabClasses = (path) =>
        `px-9 py-2 border border-gray-300 text-gray-700 whitespace-nowrap 
        ${activePath === path ? "bg-gray-700 text-white font-semibold" : "bg-white text-gray-700"}`;

    return (
        <div className="flex text-sm border border-gray-300 rounded-lg overflow-hidden">
            <Link to={'/'}>
                <div className={getTabClasses("/")}>

                    BILL WISE INCOME REPORT
                </div>

            </Link>
            <Link to={'/rent-out'}>

                <div className={getTabClasses("/rent-out")}>

                    RENT OUT REPORT

                </div>

            </Link>

            <Link to={'/booking'}>
                <div className={getTabClasses("/booking")}>
                    BOOKING REPORT
                </div></Link>


            <Link to={'/day-book'}>
                <div className={getTabClasses("/day-book")}>
                    DAY BOOK
                </div>
            </Link>

            <Link to={'/security-return'}>
                <div className={getTabClasses("/security-return")}>
                    SECURITY RETURN REPORT
                </div>
            </Link>

            <Link to={'/security-pending'}>
                <div className={getTabClasses("/security-pending")}>
                    SECURITY PENDING REPORT
                </div>
            </Link>
            <Link to={'/cancellation'}>
                <div className={getTabClasses("/cancellation")}>
                    CANCELLATION REPORT
                </div></Link>

        </div>
    );
}

export default Head;
