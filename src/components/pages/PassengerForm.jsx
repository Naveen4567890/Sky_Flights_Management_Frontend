import React, { useState } from "react";
import EmailVerification from "./EmailVerification";

const PassengerForm = ({
  passenger,
  index,
  onChange,
  onEmailVerified,
}) => {
  const today = new Date().toISOString().split("T")[0];

  const [emailVerified, setEmailVerified] = useState(false);



  const handleChange = (e) => {
    const updatedPassenger = {
      ...passenger,
      [e.target.name]: e.target.value,
    };

    // Email changed → previous verification becomes invalid
    if (e.target.name === "email") {
      setEmailVerified(false);

      if (onEmailVerified) {
        onEmailVerified(index, false);
      }
    }

    onChange(index, updatedPassenger);
  };

  const handleEmailVerified = () => {
    setEmailVerified(true);

    if (onEmailVerified) {
      onEmailVerified(index, true);
    }
  };

  return (
    <div
      className="
        bg-white
        rounded-2xl
        border border-gray-200
        shadow-sm
        p-5 sm:p-6 lg:p-7
        transition-all
        duration-200
        hover:shadow-md
      "
    >
      {/* ==========================================
          PASSENGER HEADER
      ========================================== */}

      <div className="flex items-center gap-3 mb-6 pb-5 border-b border-gray-100">
        <div
          className="
            w-10 h-10
            shrink-0
            rounded-full
            bg-blue-100
            flex items-center justify-center
          "
        >
          <span className="text-blue-600 font-bold">
            {index + 1}
          </span>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            Passenger {index + 1}
          </h2>

          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Enter passenger information
          </p>
        </div>
      </div>

      {/* ==========================================
          FORM FIELDS
      ========================================== */}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* ==========================================
            FIRST NAME
        ========================================== */}

        <div>
          <label
            htmlFor={`firstName-${index}`}
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            First Name
            <span className="text-red-500 ml-1">*</span>
          </label>

          <input
            id={`firstName-${index}`}
            type="text"
            name="firstName"
            placeholder="Enter first name"
            value={passenger.firstName || ""}
            onChange={handleChange}
            required
            className="
              w-full
              h-11
              px-4
              rounded-xl
              border border-gray-300
              bg-white
              text-sm sm:text-base
              text-gray-800
              placeholder-gray-400
              outline-none
              transition-all
              duration-200
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-100
              hover:border-gray-400
            "
          />
        </div>

        {/* ==========================================
            LAST NAME
        ========================================== */}

        <div>
          <label
            htmlFor={`lastName-${index}`}
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Last Name
            <span className="text-red-500 ml-1">*</span>
          </label>

          <input
            id={`lastName-${index}`}
            type="text"
            name="lastName"
            placeholder="Enter last name"
            value={passenger.lastName || ""}
            onChange={handleChange}
            required
            className="
              w-full
              h-11
              px-4
              rounded-xl
              border border-gray-300
              bg-white
              text-sm sm:text-base
              text-gray-800
              placeholder-gray-400
              outline-none
              transition-all
              duration-200
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-100
              hover:border-gray-400
            "
          />
        </div>

        {/* ==========================================
            EMAIL
        ========================================== */}

        <div className="md:col-span-2">
          <label
            htmlFor={`email-${index}`}
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Email Address
            <span className="text-red-500 ml-1">*</span>
          </label>

          {/* Email + Verify Button */}

          <div
            className="
              flex
              flex-col
              sm:flex-row
              gap-2 sm:gap-3
            "
          >
            {/* Email Input */}

            <div className="relative flex-1">
              <input
                id={`email-${index}`}
                type="email"
                name="email"
                placeholder="Enter email address"
                value={passenger.email || ""}
                onChange={handleChange}
                required
                className={`
                  w-full
                  h-11
                  px-4
                  pr-11
                  rounded-xl
                  border
                  bg-white
                  text-sm sm:text-base
                  text-gray-800
                  placeholder-gray-400
                  outline-none
                  transition-all
                  duration-200

                  ${
                    emailVerified
                      ? "border-green-400 bg-green-50 focus:border-green-500 focus:ring-green-100"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"
                  }

                  focus:ring-4
                  hover:border-gray-400
                `}
              />

              {/* Verified Icon */}

              {emailVerified && (
                <div
                  className="
                    absolute
                    right-3
                    top-1/2
                    -translate-y-1/2
                    w-6 h-6
                    rounded-full
                    bg-green-100
                    flex
                    items-center
                    justify-center
                  "
                >
                  <span className="text-green-600 text-sm font-bold">
                    ✓
                  </span>
                </div>
              )}
            </div>

            {/* ==========================================
                VERIFY EMAIL BUTTON
            ========================================== */}

            {!emailVerified && (
              <div className="w-full sm:w-auto">
                <EmailVerification
                  email={passenger.email}
                  onVerified={handleEmailVerified}
                />
              </div>
            )}

            {/* Verified Button */}

            {emailVerified && (
              <button
                type="button"
                disabled
                className="
                  w-full
                  sm:w-auto
                  min-w-35
                  h-11
                  px-5
                  rounded-xl
                  bg-green-100
                  border border-green-200
                  text-green-700
                  font-semibold
                  text-sm
                  cursor-not-allowed
                  flex
                  items-center
                  justify-center
                  gap-2
                "
              >
                <span>✓</span>
                Verified
              </button>
            )}
          </div>

          {/* Verification Status */}

          {emailVerified ? (
            <div
              className="
                mt-2.5
                flex
                items-center
                gap-2
                text-sm
                text-green-600
                font-medium
              "
            >
              <span className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center text-xs">
                ✓
              </span>

              Email address verified successfully
            </div>
          ) : (
            <p className="mt-2 text-xs sm:text-sm text-gray-500">
              Verify your email before continuing to booking.
            </p>
          )}
        </div>

        {/* ==========================================
            PHONE
        ========================================== */}

        <div>
          <label
            htmlFor={`phone-${index}`}
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Phone Number
            <span className="text-red-500 ml-1">*</span>
          </label>

          <input
            id={`phone-${index}`}
            type="tel"
            name="phone"
            placeholder="Enter phone number"
            value={passenger.phone || ""}
            onChange={handleChange}
            required
            className="
              w-full
              h-11
              px-4
              rounded-xl
              border border-gray-300
              bg-white
              text-sm sm:text-base
              text-gray-800
              placeholder-gray-400
              outline-none
              transition-all
              duration-200
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-100
              hover:border-gray-400
            "
          />
        </div>

        {/* ==========================================
            DATE OF BIRTH
        ========================================== */}

        <div>
          <label
            htmlFor={`dateOfBirth-${index}`}
            className="block text-sm font-semibold text-gray-700 mb-2"
          >
            Date of Birth
            <span className="text-red-500 ml-1">*</span>
          </label>

          <input
            id={`dateOfBirth-${index}`}
            type="date"
            name="dateOfBirth"
            value={passenger.dateOfBirth || ""}
            max={today}
            onChange={handleChange}
            required
            className="
              w-full
              h-11
              px-4
              rounded-xl
              border border-gray-300
              bg-white
              text-sm sm:text-base
              text-gray-800
              outline-none
              transition-all
              duration-200
              focus:border-blue-500
              focus:ring-4
              focus:ring-blue-100
              hover:border-gray-400
            "
          />
        </div>

      </div>
    </div>
  );
};

export default PassengerForm;