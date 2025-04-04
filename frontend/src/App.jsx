import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import DayBookInc from "./pages/BillWiseIncome.jsx";
import Datewisedaybook from "./pages/Datewisedaybook.jsx";
import Booking from "./pages/Booking.jsx";
import DayBook from "./pages/DayBook.jsx";
import SecurityReturn from "./pages/SecurityReturn";
import SecurityPending from "./pages/SecurityPending";
import Nav from "./components/Nav.jsx";
import Login from "./pages/Login.jsx";
import Security from "./pages/Security.jsx";

const App = () => {
  const location = useLocation();
  console.log(location.pathname);

  // Retrieve the current user from localStorage
  const currentuser = localStorage.getItem('rootfinuser');

  return (
    <div className="">
      {currentuser && <Nav />} {/* Show Nav only if user is logged in */}
      <div className="w-full">
        <Routes>
          {/* Login Route */}
          <Route path="/login" element={!currentuser ? <Login /> : <Navigate to="/" />} />

          {/* Protected Routes (Redirect to Login if Not Authenticated) */}
          <Route path="/" element={currentuser ? <DayBookInc /> : <Navigate to="/login" />} />
          <Route path="/datewisedaybook" element={currentuser ? <Datewisedaybook /> : <Navigate to="/login" />} />
          <Route path="/BookingReport" element={currentuser ? <Booking /> : <Navigate to="/login" />} />
          <Route path="/RentOutReport" element={currentuser ? <DayBook /> : <Navigate to="/login" />} />
          <Route path="/Income&Expenses" element={currentuser ? <SecurityReturn /> : <Navigate to="/login" />} />
          <Route path="/CashBankLedger" element={currentuser ? <SecurityPending /> : <Navigate to="/login" />} />
          <Route path="/securityReport" element={currentuser ? <Security /> : <Navigate to='/login' />} />

        </Routes>
      </div>
    </div>
  );
};

export default App;
