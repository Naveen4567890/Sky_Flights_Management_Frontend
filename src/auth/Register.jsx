import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../slice/AuthSlice";
import { FiEye, FiEyeOff } from "react-icons/fi";

const Register = () => {
  const [user, setUser] = useState({ name: "", email: "", password: "", confirmPassword: "", phone: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password, confirmPassword, phone } = user;

    if (!name || !email || !password || !confirmPassword || !phone) {
      toast.error("Please fill all the fields");
      return;
    }

    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
      toast.error("Invalid email address");
      return;
    }

    if (password.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return;
    }

    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    if (!passwordRegex.test(password)) {
      toast.error("Password must contain uppercase, lowercase, number and special character");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (!/^\d{10}$/.test(phone)) {
      toast.error("Phone number must be 10 digits");
      return;
    }

    const payload = new FormData();
    payload.append("name", name);
    payload.append("email", email);
    payload.append("password", password);
    payload.append("phone", phone);

    try {
      await dispatch(registerUser(payload)).unwrap();
      toast.success("Registration successful!");
      navigate("/login");
    } catch (err) {
      toast.error(typeof err === "string" ? err : err?.message || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 py-8 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat relative" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2000&q=85')" }}>
      <div className="absolute inset-0 bg-blue-950/55" />

      <div className="relative z-10 w-full max-w-md bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8">
        <div className="text-center mb-6">
          <div className="mx-auto mb-4 flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-2xl bg-linear-to-br from-blue-500 to-purple-600 shadow-lg">
            <span className="text-2xl sm:text-3xl">✈️</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Create Account</h1>
          <p className="mt-2 text-sm sm:text-base text-gray-500">Register with Sky Flights</p>
        </div>

        <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">Name</label>
            <input id="name" type="text" placeholder="Enter your name" name="name" value={user.name} onChange={handleChange} required className="w-full h-11 sm:h-12 border border-gray-300 rounded-lg px-4 text-sm sm:text-base bg-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
            <input id="email" type="email" placeholder="Enter your email" name="email" value={user.email} onChange={handleChange} required className="w-full h-11 sm:h-12 border border-gray-300 rounded-lg px-4 text-sm sm:text-base bg-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          </div>

          <div className="w-full">
            <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-700">Password</label>
            <div className="relative">
              <input id="password" type={showPassword ? "text" : "password"} placeholder="Enter your password" name="password" value={user.password} onChange={handleChange} required className="w-full h-12 rounded-lg border border-gray-300 bg-white px-4 pr-12 text-sm sm:text-base outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition" aria-label={showPassword ? "Hide password" : "Show password"}>
                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
            <div className="relative">
              <input id="confirmPassword" type={showConfirmPassword ? "text" : "password"} placeholder="Confirm your password" name="confirmPassword" value={user.confirmPassword} onChange={handleChange} required className="w-full h-11 sm:h-12 border border-gray-300 rounded-lg px-4 pr-12 text-sm sm:text-base bg-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-blue-600 transition" aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}>
                {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">Phone</label>
            <input id="phone" type="tel" placeholder="Enter 10 digit phone number" name="phone" value={user.phone} maxLength={10} onChange={handleChange} required className="w-full h-11 sm:h-12 border border-gray-300 rounded-lg px-4 text-sm sm:text-base bg-white outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100" />
          </div>

          <button type="submit" className="w-full h-11 sm:h-12 mt-2 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 active:scale-[0.98] text-white font-semibold rounded-lg transition duration-200 shadow-md hover:shadow-lg">
            Create Account
          </button>

          <div className="text-center text-sm sm:text-base text-gray-600 mt-1">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 font-semibold hover:text-blue-700 hover:underline">
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;