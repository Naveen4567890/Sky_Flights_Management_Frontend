import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import {
  selectOnwardFlight,
  selectReturnFlight,
  clearSelectedFlights,
} from "../slice/FlightSlice";

import FlightCard from "../components/FlightCard";

const FlightResults = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const {
    onwardFlights = [],
    returnFlights = [],
    selectedOnwardFlight,
    selectedReturnFlight,
    confirmSeat = {},
    searchParams,
  } = useSelector((state) => state.flight);

  const [sortBy, setSortBy] = useState("default");

  const onwardConfirmedSeat = selectedOnwardFlight
    ? confirmSeat?.[selectedOnwardFlight.id] || []
    : [];

  const returnConfirmedSeat = selectedReturnFlight
    ? confirmSeat?.[selectedReturnFlight.id] || []
    : [];

  const travelers = searchParams?.travelers || {};

  const requiredSeats =
    Number(travelers.ADULT || 0) +
    Number(travelers.CHILD || 0) +
    Number(travelers.INFANT || 0);

  const getDurationInMinutes = (duration) => {
    if (!duration) return 0;

    const hoursMatch = String(duration).match(/(\d+)\s*h/i);
    const minutesMatch = String(duration).match(/(\d+)\s*m/i);

    if (hoursMatch || minutesMatch) {
      const hours = hoursMatch ? parseInt(hoursMatch[1], 10) : 0;
      const minutes = minutesMatch
        ? parseInt(minutesMatch[1], 10)
        : 0;

      return hours * 60 + minutes;
    }

    if (String(duration).includes(":")) {
      const [hours, minutes] = String(duration)
        .split(":")
        .map(Number);

      return hours * 60 + minutes;
    }

    const numericDuration = Number(duration);

    return Number.isNaN(numericDuration) ? 0 : numericDuration;
  };

  const getTimeInMinutes = (time) => {
    if (!time) return 0;

    const timePart = String(time).includes("T")
      ? String(time).split("T")[1]
      : String(time);

    const [hours, minutes] = timePart.split(":").map(Number);

    return (hours || 0) * 60 + (minutes || 0);
  };

  const sortFlights = (flights) => {
    const sorted = [...flights];

    switch (sortBy) {
      case "priceLow":
        return sorted.sort(
          (a, b) => Number(a.price || 0) - Number(b.price || 0)
        );

      case "priceHigh":
        return sorted.sort(
          (a, b) => Number(b.price || 0) - Number(a.price || 0)
        );

      case "durationShort":
        return sorted.sort(
          (a, b) =>
            getDurationInMinutes(a.duration) -
            getDurationInMinutes(b.duration)
        );

      case "durationLong":
        return sorted.sort(
          (a, b) =>
            getDurationInMinutes(b.duration) -
            getDurationInMinutes(a.duration)
        );

      case "departureEarly":
        return sorted.sort(
          (a, b) =>
            getTimeInMinutes(a.departureTime) -
            getTimeInMinutes(b.departureTime)
        );

      case "departureLate":
        return sorted.sort(
          (a, b) =>
            getTimeInMinutes(b.departureTime) -
            getTimeInMinutes(a.departureTime)
        );

      case "airlineAZ":
        return sorted.sort((a, b) =>
          String(a.airline || "").localeCompare(
            String(b.airline || "")
          )
        );

      case "airlineZA":
        return sorted.sort((a, b) =>
          String(b.airline || "").localeCompare(
            String(a.airline || "")
          )
        );

      default:
        return sorted;
    }
  };

  const sortedOnwardFlights = useMemo(
    () => sortFlights(onwardFlights),
    [onwardFlights, sortBy]
  );

  const sortedReturnFlights = useMemo(
    () => sortFlights(returnFlights),
    [returnFlights, sortBy]
  );

  const handleOnwardSelect = (flight) => {
    dispatch(selectOnwardFlight(flight));
  };

  const handleReturnSelect = (flight) => {
    dispatch(selectReturnFlight(flight));
  };

  const handleSearchFlights = () => {
    dispatch(clearSelectedFlights());
    navigate("/");
  };

  const handleContinue = () => {
    if (!selectedOnwardFlight) {
      toast.error("Please select a departure flight");
      return;
    }

    if (onwardConfirmedSeat.length < requiredSeats) {
      toast.error(
        `Please select ${requiredSeats} seats for ${requiredSeats} travellers on the departure flight`
      );
      return;
    }

    if (returnFlights.length > 0 && !selectedReturnFlight) {
      toast.error("Please select a return flight");
      return;
    }

    if (
      returnFlights.length > 0 &&
      selectedReturnFlight &&
      returnConfirmedSeat.length < requiredSeats
    ) {
      toast.error(
        `Please select ${requiredSeats} seats for ${requiredSeats} travellers on the return flight`
      );
      return;
    }

    toast.success("Flights and seats confirmed");
    navigate("/passengers");
  };

  const noFlightsAvailable =
    onwardFlights.length === 0 && returnFlights.length === 0;

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-blue-200/30 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute top-[40%] -left-40 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl pointer-events-none" />

      <div className="absolute bottom-0 right-[20%] w-72 h-72 bg-sky-200/20 rounded-full blur-3xl pointer-events-none" />

      <header className="relative z-10 bg-white/90 backdrop-blur-xl border-b border-white/60 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">
                Available Flights
              </h1>

              <p className="text-sm text-gray-500 mt-1">
                Choose your flights and seats
              </p>
            </div>

            <div className="flex flex-wrap gap-2">

              <span className="px-3 py-2 rounded-lg bg-blue-50 text-blue-600 text-sm font-medium">
                {onwardFlights.length} Departure
              </span>

              {returnFlights.length > 0 && (
                <span className="px-3 py-2 rounded-lg bg-green-50 text-green-600 text-sm font-medium">
                  {returnFlights.length} Return
                </span>
              )}

            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">

        {noFlightsAvailable ? (
          <section className="min-h-125 flex items-center justify-center">

            <div className="w-full max-w-lg bg-white rounded-2xl border border-gray-200 shadow-sm p-8 sm:p-12 text-center">

              <div className="w-20 h-20 mx-auto rounded-full bg-blue-50 flex items-center justify-center mb-6">
                <span className="text-4xl">✈️</span>
              </div>

              <h2 className="text-2xl font-bold text-gray-800">
                No Flights Available
              </h2>

              <p className="text-gray-500 mt-3 leading-relaxed">
                We couldn't find any flights for your selected route and
                date. Try changing your search criteria.
              </p>

              <button
                type="button"
                onClick={handleSearchFlights}
                className="mt-7 w-full h-12 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
              >
                🔍 Search Flights
              </button>

            </div>
          </section>
        ) : (
          <>
            {/* SORT */}
            <section className="bg-white/90 backdrop-blur-xl rounded-2xl border border-white shadow-sm p-4 sm:p-5 mb-8">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>
                  <h3 className="text-base sm:text-lg font-bold text-gray-800">
                    Sort Flights
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-500 mt-1">
                    Find the flight that suits you best
                  </p>
                </div>

                <div className="w-full sm:w-auto sm:min-w-65">

                  <label
                    htmlFor="sortFlights"
                    className="block text-xs font-medium text-gray-500 mb-1.5"
                  >
                    Sort by
                  </label>

                  <select
                    id="sortFlights"
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full h-11 px-3 sm:px-4 rounded-xl border border-gray-300 bg-white text-sm font-medium text-gray-700 outline-none cursor-pointer transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                  >
                    <option value="default">Recommended</option>

                    <optgroup label="Price">
                      <option value="priceLow">
                        Price: Low → High
                      </option>

                      <option value="priceHigh">
                        Price: High → Low
                      </option>
                    </optgroup>

                    <optgroup label="Duration">
                      <option value="durationShort">
                        Duration: Shortest → Longest
                      </option>

                      <option value="durationLong">
                        Duration: Longest → Shortest
                      </option>
                    </optgroup>

                    <optgroup label="Departure">
                      <option value="departureEarly">
                        Departure: Earliest → Latest
                      </option>

                      <option value="departureLate">
                        Departure: Latest → Earliest
                      </option>
                    </optgroup>

                    <optgroup label="Airline">
                      <option value="airlineAZ">
                        Airline: A → Z
                      </option>

                      <option value="airlineZA">
                        Airline: Z → A
                      </option>
                    </optgroup>
                  </select>

                </div>
              </div>
            </section>

            {/* DEPARTURE FLIGHTS */}
            {sortedOnwardFlights.length > 0 && (
              <section className="mb-10">

                <div className="flex items-center gap-3 mb-5">

                  <div className="w-10 h-10 shrink-0 rounded-full bg-blue-100 flex items-center justify-center">
                    ✈️
                  </div>

                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                      Departure Flights
                    </h2>

                    <p className="text-sm text-gray-500">
                      Select your departure flight and seat
                    </p>
                  </div>

                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                  {sortedOnwardFlights.map((flight, index) => (
                    <FlightCard
                      key={flight.id || index}
                      flight={flight}
                      selected={
                        selectedOnwardFlight?.id === flight.id
                      }
                      onSelect={handleOnwardSelect}
                    />
                  ))}

                </div>
              </section>
            )}

            {/* RETURN FLIGHTS */}
            {sortedReturnFlights.length > 0 && (
              <section className="mb-10">

                <div className="flex items-center gap-3 mb-5">

                  <div className="w-10 h-10 shrink-0 rounded-full bg-green-100 flex items-center justify-center">
                    ↩️
                  </div>

                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                      Return Flights
                    </h2>

                    <p className="text-sm text-gray-500">
                      Select your return flight and seat
                    </p>
                  </div>

                </div>

                <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                  {sortedReturnFlights.map((flight, index) => (
                    <FlightCard
                      key={flight.id || index}
                      flight={flight}
                      selected={
                        selectedReturnFlight?.id === flight.id
                      }
                      onSelect={handleReturnSelect}
                    />
                  ))}

                </div>
              </section>
            )}

            {/* YOUR SELECTION */}
            {(selectedOnwardFlight || selectedReturnFlight) && (
              <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 mb-6">

                <h3 className="text-lg font-bold text-gray-800 mb-4">
                  Your Selection
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                  {/* DEPARTURE */}
                  <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">

                    <p className="text-xs font-medium uppercase tracking-wide text-blue-500">
                      Departure Flight
                    </p>

                    {selectedOnwardFlight ? (
                      <>
                        <p className="font-semibold text-gray-800 mt-1">
                          {selectedOnwardFlight.source} →{" "}
                          {selectedOnwardFlight.destination}
                        </p>

                        <p className="text-sm text-gray-500 mt-1">
                          {selectedOnwardFlight.airline} •{" "}
                          {selectedOnwardFlight.flightNumber}
                        </p>

                        <div className="mt-3">

                          {onwardConfirmedSeat.length > 0 ? (
                            <span className="inline-flex px-3 py-1.5 rounded-lg bg-green-100 text-green-700 text-sm font-semibold">
                              💺 Seat confirmed:{" "}
                              {onwardConfirmedSeat.join(", ")}
                            </span>
                          ) : (
                            <span className="inline-flex px-3 py-1.5 rounded-lg bg-yellow-100 text-yellow-700 text-sm font-semibold">
                              ⚠️ Seat not confirmed
                            </span>
                          )}

                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-gray-500 mt-1">
                        Not selected
                      </p>
                    )}

                  </div>

                  {/* RETURN */}
                  {returnFlights.length > 0 && (
                    <div className="rounded-xl bg-green-50 border border-green-100 p-4">

                      <p className="text-xs font-medium uppercase tracking-wide text-green-500">
                        Return Flight
                      </p>

                      {selectedReturnFlight ? (
                        <>
                          <p className="font-semibold text-gray-800 mt-1">
                            {selectedReturnFlight.source} →{" "}
                            {selectedReturnFlight.destination}
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            {selectedReturnFlight.airline} •{" "}
                            {selectedReturnFlight.flightNumber}
                          </p>

                          <div className="mt-3">

                            {returnConfirmedSeat.length > 0 ? (
                              <span className="inline-flex px-3 py-1.5 rounded-lg bg-green-100 text-green-700 text-sm font-semibold">
                                💺 Seat confirmed:{" "}
                                {returnConfirmedSeat.join(", ")}
                              </span>
                            ) : (
                              <span className="inline-flex px-3 py-1.5 rounded-lg bg-yellow-100 text-yellow-700 text-sm font-semibold">
                                ⚠️ Seat not confirmed
                              </span>
                            )}

                          </div>
                        </>
                      ) : (
                        <p className="text-sm text-gray-500 mt-1">
                          Not selected
                        </p>
                      )}

                    </div>
                  )}

                </div>
              </section>
            )}

            {/* CONTINUE */}
            <section className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5">

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                <div>
                  <h3 className="font-semibold text-gray-800">
                    Ready to continue?
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Confirm your flight seats before continuing to passenger
                    details.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleContinue}
                  className="w-full sm:w-auto min-w-45 h-11 sm:h-12 px-6 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold rounded-xl transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  Continue to Passengers →
                </button>

              </div>
            </section>
          </>
        )}
      </main>
    </div>
  );
};

export default FlightResults;