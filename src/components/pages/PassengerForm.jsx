import React from "react";

const PassengerForm = ({
  passenger,
  index,
  onChange,
}) => {

  // Today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split("T")[0];

  const handleChange = (e) => {
    onChange(index, {
      ...passenger,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">

      {/* Passenger Header */}
      <div className="flex items-center gap-3 mb-6">

        <div className="w-10 h-10 shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
          <span className="text-blue-600 font-bold">
            {index + 1}
          </span>
        </div>

        <div>
          <h2 className="text-lg sm:text-xl font-bold text-gray-800">
            Passenger {index + 1}
          </h2>

          <p className="text-xs sm:text-sm text-gray-500">
            Enter passenger information
          </p>
        </div>

      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">

        {/* First Name */}
        <div>
          <label
            htmlFor={`firstName-${index}`}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            First Name
          </label>

          <input
            id={`firstName-${index}`}
            type="text"
            name="firstName"
            placeholder="Enter first name"
            value={passenger.firstName || ""}
            onChange={handleChange}
            required
            className="w-full h-11 px-4 rounded-lg border border-gray-300
              text-sm sm:text-base outline-none transition
              focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Last Name */}
        <div>
          <label
            htmlFor={`lastName-${index}`}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Last Name
          </label>

          <input
            id={`lastName-${index}`}
            type="text"
            name="lastName"
            placeholder="Enter last name"
            value={passenger.lastName || ""}
            onChange={handleChange}
            required
            className="w-full h-11 px-4 rounded-lg border border-gray-300
              text-sm sm:text-base outline-none transition
              focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Email */}
        <div>
          <label
            htmlFor={`email-${index}`}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Email
          </label>

          <input
            id={`email-${index}`}
            type="email"
            name="email"
            placeholder="Enter email address"
            value={passenger.email || ""}
            onChange={handleChange}
            required
            className="w-full h-11 px-4 rounded-lg border border-gray-300
              text-sm sm:text-base outline-none transition
              focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Phone */}
        <div>
          <label
            htmlFor={`phone-${index}`}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Phone Number
          </label>

          <input
            id={`phone-${index}`}
            type="tel"
            name="phone"
            placeholder="Enter phone number"
            value={passenger.phone || ""}
            onChange={handleChange}
            required
            className="w-full h-11 px-4 rounded-lg border border-gray-300
              text-sm sm:text-base outline-none transition
              focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />
        </div>

        {/* Date of Birth */}
        <div className="sm:col-span-2">

          <label
            htmlFor={`dateOfBirth-${index}`}
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Date of Birth
          </label>

          <input
            id={`dateOfBirth-${index}`}
            type="date"
            name="dateOfBirth"
            value={passenger.dateOfBirth || ""}
            max={today}
            onChange={handleChange}
            required
            className="w-full sm:max-w-md h-11 px-4 rounded-lg
              border border-gray-300 text-sm sm:text-base
              outline-none transition
              focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
          />

        </div>

      </div>
    </div>
  );
};

export default PassengerForm;