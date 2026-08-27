import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setPassengers } from "../slice/BookingSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import PassengerForm from "../components/PassengerForm";

const PassengerDetails = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [emailVerified, setEmailVerified] = useState({});

  const { searchParams, selectedOnwardFlight, selectedReturnFlight, confirmSeat, traveller } = useSelector((state) => state.flight);
  const { passengers: storedPassengers = [] } = useSelector((state) => state.booking);

  const passengerCount = Number(searchParams?.passengers || searchParams?.totalTravelers || 1);

  const createInitialPassenger = (type) => ({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    onwardSeatNumber: "",
    returnSeatNumber: "",
    cabin: selectedOnwardFlight?.cabin || "ECONOMY",
    type,
  });

  const createPassengersFromTraveller = () => {
    const adults = Number(traveller?.adult || traveller?.ADULT || 0);
    const children = Number(traveller?.child || traveller?.CHILD || 0);
    const infants = Number(traveller?.infant || traveller?.INFANT || 0);

    return [
      ...Array.from({ length: adults }, () => createInitialPassenger("ADULT")),
      ...Array.from({ length: children }, () => createInitialPassenger("CHILD")),
      ...Array.from({ length: infants }, () => createInitialPassenger("INFANT")),
    ];
  };

  const [passengers, setPassengersState] = useState(
    storedPassengers.length ? storedPassengers : createPassengersFromTraveller()
  );

  const calculateAge = (dateOfBirth) => {
    const today = new Date();
    const dob = new Date(dateOfBirth);
    let age = today.getFullYear() - dob.getFullYear();
    const monthDifference = today.getMonth() - dob.getMonth();

    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    return age;
  };

  const validatePassengerAge = (passenger, index) => {
    const age = calculateAge(passenger.dateOfBirth);

    if (age < 0) {
      toast.error(`Passenger ${index + 1}: Date of birth cannot be in the future`);
      return false;
    }

    if (passenger.type === "ADULT" && age < 12) {
      toast.error(`Passenger ${index + 1} is an Adult. Adult must be 12 years or older.`);
      return false;
    }

    if (passenger.type === "CHILD" && (age < 2 || age >= 12)) {
      toast.error(`Passenger ${index + 1} is a Child. Child age must be between 2 and 11 years.`);
      return false;
    }

    if (passenger.type === "INFANT" && age >= 2) {
      toast.error(`Passenger ${index + 1} is an Infant. Infant must be under 2 years old.`);
      return false;
    }

    return true;
  };

  const handleChange = (index, passenger) => {
    const updated = [...passengers];
    updated[index] = passenger;
    setPassengersState(updated);
  };

  const handleEmailVerified = (index, verified) => {
    setEmailVerified((previous) => ({
      ...previous,
      [index]: verified,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    for (let i = 0; i < passengers.length; i++) {
      const passenger = passengers[i];

      if (!passenger.firstName || !passenger.lastName || !passenger.email || !passenger.phone || !passenger.dateOfBirth) {
        toast.error(`Please complete Passenger ${i + 1} details`);
        return;
      }

      if (!validatePassengerAge(passenger, i)) {
        return;
      }
    }

    const unverifiedPassengerIndex = passengers.findIndex((_, index) => !emailVerified[index]);

    if (unverifiedPassengerIndex !== -1) {
      toast.error(`Please verify email for Passenger ${unverifiedPassengerIndex + 1}`);
      return;
    }

    const onwardSeat = confirmSeat?.[selectedOnwardFlight?.id];

    if (!onwardSeat) {
      toast.error("Please select a seat for the departure flight");
      navigate("/flights");
      return;
    }

    let returnSeat = "";

    if (selectedReturnFlight) {
      returnSeat = confirmSeat?.[selectedReturnFlight.id];

      if (!returnSeat) {
        toast.error("Please select a seat for the return flight");
        navigate("/flights");
        return;
      }
    }

    const updatedPassengers = passengers.map((passenger) => ({
      ...passenger,
      cabin: passenger.cabin || selectedOnwardFlight?.cabin || "ECONOMY",
    }));

    dispatch(setPassengers(updatedPassengers));

    toast.success("All passenger details verified!");
    navigate("/booking-review");
  };

  if (!selectedOnwardFlight) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="w-full max-w-md bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 text-center">
          <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-red-100 flex items-center justify-center">
            <span className="text-3xl">✈️</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">No Flight Selected</h2>

          <p className="text-sm sm:text-base text-gray-500 mt-2">
            Please select a flight before entering passenger details.
          </p>

          <button
            type="button"
            onClick={() => navigate("/flights")}
            className="mt-6 w-full h-11 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
          >
            Go Back to Flights
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Passenger Details
              </h1>

              <p className="text-sm sm:text-base text-gray-500 mt-1">
                Enter the details of all passengers travelling
              </p>
            </div>

            <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-lg">
              <span className="text-lg">👤</span>

              <span className="text-sm font-semibold text-blue-600">
                {passengers.length} Passenger{passengers.length !== 1 ? "s" : ""}
              </span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5 mb-6">
          <h2 className="text-lg font-bold text-gray-800 mb-4">
            Selected Flight
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-blue-50 border border-blue-100 rounded-xl p-4">
              <p className="text-xs uppercase tracking-wide text-blue-500 font-medium">
                Departure
              </p>

              <p className="text-base sm:text-lg font-bold text-gray-800 mt-1">
                {selectedOnwardFlight.source} → {selectedOnwardFlight.destination}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {selectedOnwardFlight.airline} • {selectedOnwardFlight.flightNumber}
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {selectedOnwardFlight.departureTime} - {selectedOnwardFlight.arrivalTime}
              </p>
            </div>

            {selectedReturnFlight && (
              <div className="bg-green-50 border border-green-100 rounded-xl p-4">
                <p className="text-xs uppercase tracking-wide text-green-500 font-medium">
                  Return
                </p>

                <p className="text-base sm:text-lg font-bold text-gray-800 mt-1">
                  {selectedReturnFlight.source} → {selectedReturnFlight.destination}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {selectedReturnFlight.airline} • {selectedReturnFlight.flightNumber}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {selectedReturnFlight.departureTime} - {selectedReturnFlight.arrivalTime}
                </p>
              </div>
            )}
          </div>
        </section>

        <form onSubmit={handleSubmit}>
          <div className="space-y-5">
            {passengers.map((passenger, index) => (
              <PassengerForm
                key={index}
                passenger={passenger}
                index={index}
                onChange={handleChange}
                onEmailVerified={handleEmailVerified}
              />
            ))}
          </div>

          <div className="mt-6 bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-5">
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-between gap-3">
              <button
                type="button"
                onClick={() => navigate("/flights")}
                className="w-full sm:w-auto px-6 h-11 rounded-lg border border-gray-300 text-gray-700 font-medium hover:bg-gray-50 transition"
              >
                ← Back to Flights
              </button>

              <button
                type="submit"
                className="w-full sm:w-auto px-8 h-11 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold shadow-md transition"
              >
                Continue to Review →
              </button>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
};

export default PassengerDetails;