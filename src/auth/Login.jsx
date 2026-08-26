import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { loginUser } from "../slice/AuthSlice";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { flightSearch } from "../slice/FlightSlice";

const Login = () => {
  const [user, setUser] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });
  };

const handleSubmit = async (e) => {

    e.preventDefault();

    const { email, password } = user;

    if (!email || !password) {
        toast.error("Please fill all the fields");
        return;
    }

    const payload = new FormData();

    payload.append("email", email);
    payload.append("password", password);

    try {

        const response =
            await dispatch(
                loginUser(payload)
            ).unwrap();

        toast.success("Login Successfully");

        // Check pending flight search
        const pendingSearch =
            localStorage.getItem(
                "pendingFlightSearch"
            );

        if (pendingSearch) {

            const searchPayload =
                JSON.parse(pendingSearch);

            localStorage.removeItem(
                "pendingFlightSearch"
            );

            await dispatch(
                flightSearch(searchPayload)
            ).unwrap();

            navigate("/flights");

            return;
        }

        navigate("/");

    } catch (err) {

        console.error(
            "Login Error:",
            err
        );

        toast.error(
            typeof err === "string"
                ? err
                : err?.message ||
                  "Login failed"
        );
    }
};

  return (
    <div
      className="
        min-h-screen
        w-full
        flex
        items-center
        justify-center
        px-4
        py-8
        bg-cover
        bg-center
        bg-no-repeat
        relative
      "
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2000&q=85')",
      }}
    >

      {/* Background Overlay */}
      <div className="absolute inset-0 bg-blue-950/55" />

      {/* Login Card */}
      <div
        className="
          relative
          z-10
          w-full
          max-w-md
          bg-white/95
          backdrop-blur-md
          rounded-2xl
          shadow-2xl
          p-6
          sm:p-8
        "
      >

        {/* Logo / Icon */}
        <div className="text-center mb-7">

          <div
            className="
              mx-auto
              mb-4
              flex
              h-16
              w-16
              items-center
              justify-center
              rounded-2xl
              bg-linear-to-br
              from-blue-500
              to-purple-600
              shadow-lg
            "
          >
            <span className="text-3xl">
              ✈️
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
            Welcome Back
          </h1>

          <p className="mt-2 text-sm sm:text-base text-gray-500">
            Login to Sky Flights
          </p>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-5"
        >

          {/* Email */}
          <div className="w-full">

            <label
              htmlFor="email"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Email
            </label>

            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              name="email"
              value={user.email}
              onChange={handleChange}
              required
              className="
                w-full
                h-12
                rounded-lg
                border
                border-gray-300
                bg-white
                px-4
                text-sm
                sm:text-base
                outline-none
                transition
                focus:border-blue-500
                focus:ring-2
                focus:ring-blue-100
              "
            />

          </div>

         
          {/* Password */}
          <div className="w-full">
            <label
              htmlFor="password"
              className="block mb-2 text-sm font-medium text-gray-700"
            >
              Password
            </label>

            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                name="password"
                value={user.password}
                onChange={handleChange}
                required
                className="
                  w-full
                  h-12
                  rounded-lg
                  border
                  border-gray-300
                  bg-white
                  px-4
                  pr-12
                  text-sm
                  sm:text-base
                  outline-none
                  transition
                  focus:border-blue-500
                  focus:ring-2
                  focus:ring-blue-100
                "
              />

              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                  text-gray-500
                  hover:text-blue-600
                  transition
                "
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <FiEyeOff size={20} />
                ) : (
                  <FiEye size={20} />
                )}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            className="
              w-full
              h-12
              bg-linear-to-r
              from-blue-600
              to-purple-600
              hover:from-blue-700
              hover:to-purple-700
              active:scale-[0.98]
              text-white
              font-semibold
              rounded-lg
              transition
              duration-200
              shadow-md
              hover:shadow-lg
            "
          >
            Login
          </button>

          {/* Register */}
          <div className="text-center text-sm sm:text-base text-gray-600">

            Don't have an account?{" "}

            <Link
              to="/register"
              className="
                font-semibold
                text-blue-600
                hover:text-blue-700
                hover:underline
              "
            >
              Register here
            </Link>

          </div>

        </form>

      </div>
    </div>
  );
};

export default Login;