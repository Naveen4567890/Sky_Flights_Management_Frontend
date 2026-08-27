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

  const getPassengerTypeLabel = (type) => {
    switch (type) {
      case "ADULT":
        return "Adult";
      case "CHILD":
        return "Child";
      case "INFANT":
        return "Infant";
      default:
        return "Passenger";
    }
  };

  const getPassengerAgeRule = (type) => {
    switch (type) {
      case "ADULT":
        return "12 years or older";
      case "CHILD":
        return "2–11 years";
      case "INFANT":
        return "Under 2 years";
      default:
        return "";
    }
  };

  const getPassengerTypeStyle = (type) => {
    switch (type) {
      case "ADULT":
        return "bg-blue-100 text-blue-700";
      case "CHILD":
        return "bg-green-100 text-green-700";
      case "INFANT":
        return "bg-orange-100 text-orange-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const handleChange = (e) => {
    const updatedPassenger = {
      ...passenger,
      [e.target.name]: e.target.value,
    };

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

  const passengerType = passenger.type || "ADULT";
  const passengerTypeLabel = getPassengerTypeLabel(passengerType);
  const passengerAgeRule = getPassengerAgeRule(passengerType);

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6 lg:p-7 transition-all duration-200 hover:shadow-md">

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 pb-5 border-b border-gray-100">

        <div className="flex items-center gap-3">

          <div className="w-10 h-10 shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
            <span className="text-blue-600 font-bold">
              {index + 1}
            </span>
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-2">

              <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                Passenger {index + 1}
              </h2>

              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getPassengerTypeStyle(passengerType)}`}>
                {passengerTypeLabel}
              </span>

            </div>

            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              Date of birth must be{" "}
              <span className="font-semibold text-blue-600">
                {passengerAgeRule}
              </span>
            </p>
          </div>

        </div>

        <div className="text-xs sm:text-sm text-gray-500 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2">
          Enter passenger information
        </div>

      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        {/* First Name */}

        <div>
          <label htmlFor={`firstName-${index}`} className="block text-sm font-semibold text-gray-700 mb-2">
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
            className="w-full h-11 px-4 rounded-xl border border-gray-300 bg-white text-sm sm:text-base text-gray-800 placeholder-gray-400 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-gray-400"
          />
        </div>

        {/* Last Name */}

        <div>
          <label htmlFor={`lastName-${index}`} className="block text-sm font-semibold text-gray-700 mb-2">
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
            className="w-full h-11 px-4 rounded-xl border border-gray-300 bg-white text-sm sm:text-base text-gray-800 placeholder-gray-400 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-gray-400"
          />
        </div>

        {/* Email */}

        <div className="md:col-span-2">

          <label htmlFor={`email-${index}`} className="block text-sm font-semibold text-gray-700 mb-2">
            Email Address
            <span className="text-red-500 ml-1">*</span>
          </label>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">

            <div className="relative flex-1">

              <input
                id={`email-${index}`}
                type="email"
                name="email"
                placeholder="Enter email address"
                value={passenger.email || ""}
                onChange={handleChange}
                required
                className={`w-full h-11 px-4 pr-11 rounded-xl border bg-white text-sm sm:text-base text-gray-800 placeholder-gray-400 outline-none transition-all duration-200 focus:ring-4 hover:border-gray-400 ${emailVerified ? "border-green-400 bg-green-50 focus:border-green-500 focus:ring-green-100" : "border-gray-300 focus:border-blue-500 focus:ring-blue-100"}`}
              />

            </div>

            {!emailVerified && (
              <div className="w-full sm:w-auto">
                <EmailVerification
                  email={passenger.email}
                  onVerified={handleEmailVerified}
                />
              </div>
            )}

            {emailVerified && (
              <button
                type="button"
                disabled
                className="w-full sm:w-auto min-w-35 h-11 px-5 rounded-xl bg-green-100 border border-green-200 text-green-700 font-semibold text-sm cursor-not-allowed flex items-center justify-center gap-2"
              >
                <span>✓</span>
                Verified
              </button>
            )}

          </div>

          {emailVerified ? (
            <div className="mt-2.5 flex items-center gap-2 text-sm text-green-600 font-medium">

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

        {/* Phone */}

        <div>

          <label htmlFor={`phone-${index}`} className="block text-sm font-semibold text-gray-700 mb-2">
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
            className="w-full h-11 px-4 rounded-xl border border-gray-300 bg-white text-sm sm:text-base text-gray-800 placeholder-gray-400 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-gray-400"
          />

        </div>

        {/* Date of Birth */}

        <div>

          <label htmlFor={`dateOfBirth-${index}`} className="block text-sm font-semibold text-gray-700 mb-2">
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
            className="w-full h-11 px-4 rounded-xl border border-gray-300 bg-white text-sm sm:text-base text-gray-800 outline-none transition-all duration-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 hover:border-gray-400"
          />

        </div>

      </div>
    </div>
  );
};

export default PassengerForm;