import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../slice/AuthSlice";
import { flightSearch } from "../slice/FlightSlice";

import { FiEye, FiEyeOff } from "react-icons/fi";

const Login = () => {

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();


  // ==========================================
  // HANDLE INPUT
  // ==========================================

  const handleChange = (e) => {

    setUser({
      ...user,
      [e.target.name]: e.target.value,
    });

  };


  // ==========================================
  // GOOGLE LOGIN
  // ==========================================

  const handleGoogleLogin = () => {

    window.location.href =
      "http://localhost:8080/oauth2/authorization/google";

  };


  // ==========================================
  // NORMAL LOGIN
  // ==========================================

  const handleSubmit = async (e) => {

    e.preventDefault();

    const {
      email,
      password,
    } = user;

    if (!email || !password) {

      toast.error(
        "Please fill all the fields"
      );

      return;
    }


    const payload = new FormData();

    payload.append(
      "email",
      email
    );

    payload.append(
      "password",
      password
    );


    try {

      await dispatch(
        loginUser(payload)
      ).unwrap();


      toast.success(
        "Login Successfully"
      );


      const pendingSearch =
        localStorage.getItem(
          "pendingFlightSearch"
        );


      if (pendingSearch) {

        const searchPayload =
          JSON.parse(
            pendingSearch
          );

        localStorage.removeItem(
          "pendingFlightSearch"
        );


        await dispatch(
          flightSearch(
            searchPayload
          )
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

        sm:px-6
        md:px-8

        bg-cover
        bg-center
        bg-no-repeat

        relative

        overflow-y-auto
      "

      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=2000&q=85')",
      }}
    >

      {/* ==========================================
          BACKGROUND OVERLAY
      ========================================== */}

      <div
        className="
          absolute
          inset-0
          bg-blue-950/60
        "
      />


      {/* ==========================================
          LOGIN CARD
      ========================================== */}

      <div
        className="
          relative
          z-10

          w-full
          max-w-md

          my-4

          bg-white/95
          backdrop-blur-md

          rounded-2xl

          shadow-2xl

          p-5
          sm:p-7
          md:p-8

          border
          border-white/30
        "
      >

        {/* ==========================================
            HEADER
        ========================================== */}

        <div
          className="
            text-center
            mb-6
            sm:mb-7
          "
        >

          {/* LOGO */}

          <div
            className="
              mx-auto
              mb-4

              flex
              items-center
              justify-center

              h-14
              w-14

              sm:h-16
              sm:w-16

              rounded-2xl

              bg-linear-to-br
              from-blue-500
              to-purple-600

              shadow-lg
            "
          >

            <span
              className="
                text-2xl
                sm:text-3xl
              "
            >
              ✈️
            </span>

          </div>


          {/* TITLE */}

          <h1
            className="
              text-2xl
              sm:text-3xl

              font-bold
              text-gray-800

              leading-tight
            "
          >
            Welcome Back
          </h1>


          {/* SUBTITLE */}

          <p
            className="
              mt-2

              text-sm
              sm:text-base

              text-gray-500
            "
          >
            Login to Sky Flights
          </p>

        </div>


        {/* ==========================================
            LOGIN FORM
        ========================================== */}

        <form
          onSubmit={handleSubmit}

          className="
            w-full
            flex
            flex-col

            gap-4
            sm:gap-5
          "
        >

          {/* EMAIL */}

          <div className="w-full">

            <label
              htmlFor="email"

              className="
                block
                mb-2

                text-sm
                font-medium
                text-gray-700
              "
            >
              Email
            </label>


            <input
              id="email"

              type="email"

              name="email"

              placeholder="Enter your email"

              value={user.email}

              onChange={handleChange}

              required

              autoComplete="email"

              className="
                w-full

                h-11
                sm:h-12

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

                placeholder:text-gray-400
              "
            />

          </div>


          {/* PASSWORD */}

          <div className="w-full">

            <label
              htmlFor="password"

              className="
                block
                mb-2

                text-sm
                font-medium
                text-gray-700
              "
            >
              Password
            </label>


            <div className="relative">

              <input
                id="password"

                type={
                  showPassword
                    ? "text"
                    : "password"
                }

                name="password"

                placeholder="Enter your password"

                value={user.password}

                onChange={handleChange}

                required

                autoComplete="current-password"

                className="
                  w-full

                  h-11
                  sm:h-12

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

                  placeholder:text-gray-400
                "
              />


              {/* SHOW/HIDE PASSWORD */}

              <button
                type="button"

                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }

                className="
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2

                  flex
                  items-center
                  justify-center

                  h-8
                  w-8

                  rounded-md

                  text-gray-500

                  hover:text-blue-600

                  hover:bg-blue-50

                  transition
                "

                aria-label={
                  showPassword
                    ? "Hide password"
                    : "Show password"
                }
              >

                {showPassword ? (
                  <FiEyeOff
                    size={19}
                  />
                ) : (
                  <FiEye
                    size={19}
                  />
                )}

              </button>

            </div>

          </div>


          {/* LOGIN BUTTON */}

          <button
            type="submit"

            className="
              w-full

              h-11
              sm:h-12

              bg-linear-to-r
              from-blue-600
              to-purple-600

              hover:from-blue-700
              hover:to-purple-700

              active:scale-[0.98]

              text-white

              font-semibold

              text-sm
              sm:text-base

              rounded-lg

              transition
              duration-200

              shadow-md

              hover:shadow-lg

              mt-1
            "
          >
            Login
          </button>


          {/* ==========================================
              REGISTER
          ========================================== */}

          <div
            className="
              text-center

              text-sm
              sm:text-base

              text-gray-600

              leading-relaxed
            "
          >

            Don't have an account?{" "}

            <Link
              to="/register"

              className="
                font-semibold
                text-blue-600

                hover:text-blue-700
                hover:underline

                whitespace-nowrap
              "
            >
              Register here
            </Link>

          </div>

        </form>


        {/* ==========================================
            OR SEPARATOR
        ========================================== */}

        <div
          className="
            flex
            items-center
            gap-3

            my-5
            sm:my-6
          "
        >

          <div
            className="
              flex-1
              h-px
              bg-gray-300
            "
          />

          <span
            className="
              text-xs
              sm:text-sm

              text-gray-500

              font-medium
            "
          >
            OR
          </span>

          <div
            className="
              flex-1
              h-px
              bg-gray-300
            "
          />

        </div>


        {/* ==========================================
            GOOGLE LOGIN
        ========================================== */}

        <button
          type="button"

          onClick={handleGoogleLogin}

          className="
            w-full

            h-11
            sm:h-12

            flex
            items-center
            justify-center
            gap-3

            border
            border-gray-300

            rounded-lg

            bg-white

            text-gray-700

            text-sm
            sm:text-base

            font-medium

            hover:bg-gray-50
            hover:border-gray-400

            active:scale-[0.98]

            transition
            duration-200

            shadow-sm
          "
        >

          {/* Google Icon */}

          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >

            <path
              fill="#4285F4"
              d="M21.35 12.23c0-.79-.07-1.55-.23-2.23H12v4.22h5.22a4.46 4.46 0 0 1-1.94 2.93v2.43h3.14c1.84-1.69 2.93-4.18 2.93-7.35z"
            />

            <path
              fill="#34A853"
              d="M12 21.67c2.63 0 4.84-.87 6.45-2.36l-3.14-2.43c-.87.58-1.98.92-3.31.92-2.54 0-4.69-1.72-5.46-4.03H3.3v2.51A9.75 9.75 0 0 0 12 21.67z"
            />

            <path
              fill="#FBBC05"
              d="M6.54 13.77A5.86 5.86 0 0 1 6.23 12c0-.61.11-1.2.31-1.77V7.72H3.3A9.73 9.73 0 0 0 2.25 12c0 1.57.38 3.05 1.05 4.28l3.24-2.51z"
            />

            <path
              fill="#EA4335"
              d="M12 6.2c1.43 0 2.71.49 3.72 1.45l2.79-2.79C16.84 3.29 14.63 2.33 12 2.33a9.75 9.75 0 0 0-8.7 5.39l3.24 2.51C7.31 7.92 9.46 6.2 12 6.2z"
            />

          </svg>

          <span>
            Continue with Google
          </span>

        </button>

      </div>

    </div>
  );
};

export default Login;