import { useState } from 'react';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import img12 from '../assets/image.png';
import baseUrl from '../api/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [EmpId, setEmpId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(email, EmpId);
    try {
      const response = await fetch(baseUrl.baseUrl + 'user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, EmpId }),
      });

      const data = await response.json();

      console.log("API Response:", data.user); // Debugging: Log the full response

      if (response.ok) {
        // Assuming the response has `userId` and `role` at the root level
        console.log("User Info from API:", data.user?.userId, data.user?.role);

        // Dispatch the user info to Redux store

        setLoading(true)
        // Store JWT in localStorage
        localStorage.setItem("rootfinuser", JSON.stringify(data.user));
        // Display success message and redirect
        alert('Login successful');
        navigate('/'); // Redirect to the desired route
      } else {
        setLoading(true)
        // Handle non-200 responses
        console.error("Login failed:", data.message);
        alert('Login failed: ' + (data.message || 'Unknown error'));
        setLoading(false)
      }
    } catch (error) {
      setLoading(false)
      // Handle fetch or network errors
      console.error('Error during login:', error);
      alert('An error occurred during login');
    }


  };

  return (
    <div className="flex h-screen z-40">
      {/* Left Side - Form */}
      <div className="md:w-1/2 w-full flex flex-col justify-center items-center bg-gray-100 px-4 " style={{ backgroundImage: `url("/image2.png")`, backgroundRepeat: 'no-repeat', backgroundSize: 'cover', }}
      >
        <p className="text-2xl mb-10 text-white font-semibold text-center md:w-[400px]">
          Secure & Efficient <span className="text-[#ffffff]">Financial</span>  Software
        </p>
        <form onSubmit={handleSubmit} className="bg-white shadow-lg rounded-lg p-8 w-full max-w-sm">
          <h2 className="text-2xl font-semibold text-center mb-6 text-[#016E5B]">Login</h2>

          {/* Email Field */}
          <label className="border py-2 px-3 flex items-center border-gray-300 gap-2 mb-4 bg-white rounded-lg shadow-sm">
            <input
              type="email"
              className="grow text-[#016E5B] font-semibold focus:ring-0 focus:border-none outline-none placeholder-gray-500"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </label>

          {/* Password Field */}
          <label className="border py-2 px-3 flex items-center gap-2 mb-4 border-gray-300 bg-white rounded-lg shadow-sm relative">
            <input
              type={showPassword ? "text" : "password"}
              className="grow text-[#016E5B] font-semibold pr-10 focus:ring-0 focus:border-none outline-none placeholder-gray-500"
              placeholder="Admin Password"
              value={EmpId}
              onChange={(e) => setEmpId(e.target.value)}
              required
            />
            <span
              className="absolute right-4 text-[#016E5B] text-xl cursor-pointer"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </label>


          {/* Submit Button */}
          <div className="flex justify-center">
            <button
              type="submit"
              className={`w-[50%] py-2 rounded-lg mt-5 text-white ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-[#016E5B] hover:bg-[#014f42]"}`}
              disabled={loading}
            >
              {loading ? "Loading..." : "Login"}
            </button>
          </div>
        </form>
      </div>

      {/* Right Side - Image */}
      <div className="hidden md:flex w-1/2 bg-[#016E5B] justify-center items-center">
        <img src={img12} width="500px" alt="Login Illustration" />
      </div>
    </div>
  );
};

export default Login;
