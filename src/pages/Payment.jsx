import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPaymentOrder, verifyPayment } from "../slice/PaymentSlice";
import { createBooking } from "../slice/BookingSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

const Payment = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { selectedOnwardFlight, selectedReturnFlight } = useSelector((state) => state.flight);
    const { passengers = [] } = useSelector((state) => state.booking);
    const { loading } = useSelector((state) => state.payment);

    const [paymentMethod, setPaymentMethod] = useState("CARD");

    const onwardPrice = Number(selectedOnwardFlight?.price || 0);
    const returnPrice = Number(selectedReturnFlight?.price || 0);
    const passengerCount = Math.max(passengers.length, 1);
    const total = (onwardPrice + returnPrice) * passengerCount;

    const handlePayment = async () => {
        try {
            if (!selectedOnwardFlight) {
                toast.error("Please select a flight");
                navigate("/flights");
                return;
            }

            if (!passengers || passengers.length === 0) {
                toast.error("Please enter passenger details");
                navigate("/passengers");
                return;
            }

            if (!paymentMethod) {
                toast.error("Please select a payment method");
                return;
            }

            const order = await dispatch(createPaymentOrder({ amount: total, paymentMethod })).unwrap();

            if (!order?.orderId) {
                throw new Error("Payment order ID was not returned");
            }

            const options = {
                key: order.keyId,
                amount: Number(order.amount) * 100,
                currency: order.currency || "INR",
                name: "Flight Booking",
                description: "Flight ticket booking",
                order_id: order.orderId,
                prefill: {
                    name: `${passengers[0]?.firstName || ""} ${passengers[0]?.lastName || ""}`.trim(),
                    email: passengers[0]?.email || "",
                    contact: passengers[0]?.phone || "",
                },
                theme: { color: "#2563eb" },
                handler: async function (response) {
                    try {
                        const verificationData = {
                            orderId: response.razorpay_order_id,
                            paymentId: response.razorpay_payment_id,
                            signature: response.razorpay_signature,
                        };

                        await dispatch(verifyPayment(verificationData)).unwrap();

                        const bookingPassengers = passengers.map((passenger) => ({ ...passenger }));

                        const bookingData = {
                            onwardFlightId: selectedOnwardFlight.id,
                            returnFlightId: selectedReturnFlight?.id || null,
                            passengers: bookingPassengers,
                            paymentMethod,
                            paymentId: response.razorpay_payment_id,
                            totalAmount: total,
                        };

                        const bookingResult = await dispatch(createBooking(bookingData)).unwrap();

                        console.log("BOOKING SUCCESS:", bookingResult);

                        toast.success("Booking confirmed successfully!");
                        navigate("/booking-confirmation");
                    } catch (error) {
                        toast.error(typeof error === "string" ? error : error?.message || "Payment verification failed");
                    }
                },
            };

            if (!window.Razorpay) {
                toast.error("Payment gateway failed to load");
                return;
            }

            const razorpay = new window.Razorpay(options);

            razorpay.on("payment.failed", function (response) {
                toast.error(response?.error?.description || "Payment failed. Please try again.");
            });

            razorpay.open();
        } catch (error) {
            toast.error(typeof error === "string" ? error : error?.message || "Unable to start payment");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <header className="bg-white border-b border-gray-200 shadow-sm">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Payment</h1>
                    <p className="text-sm text-gray-500 mt-1">Complete your booking securely</p>
                </div>
            </header>

            <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <section className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
                        <h2 className="text-xl font-bold text-gray-800 mb-5">Select Payment Method</h2>

                        <div className="space-y-3">
                            <button type="button" onClick={() => setPaymentMethod("CARD")} className={`w-full p-4 rounded-xl border text-left transition ${paymentMethod === "CARD" ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100" : "border-gray-200 hover:border-blue-300"}`}>
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl">💳</span>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800">Credit / Debit Card</p>
                                        <p className="text-sm text-gray-500">Visa, Mastercard, RuPay</p>
                                    </div>
                                    <span>{paymentMethod === "CARD" ? "●" : "○"}</span>
                                </div>
                            </button>

                            <button type="button" onClick={() => setPaymentMethod("UPI")} className={`w-full p-4 rounded-xl border text-left transition ${paymentMethod === "UPI" ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100" : "border-gray-200 hover:border-blue-300"}`}>
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl">📱</span>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800">UPI</p>
                                        <p className="text-sm text-gray-500">Google Pay, PhonePe, Paytm</p>
                                    </div>
                                    <span>{paymentMethod === "UPI" ? "●" : "○"}</span>
                                </div>
                            </button>

                            <button type="button" onClick={() => setPaymentMethod("NET_BANKING")} className={`w-full p-4 rounded-xl border text-left transition ${paymentMethod === "NET_BANKING" ? "border-blue-500 bg-blue-50 ring-2 ring-blue-100" : "border-gray-200 hover:border-blue-300"}`}>
                                <div className="flex items-center gap-4">
                                    <span className="text-2xl">🏦</span>
                                    <div className="flex-1">
                                        <p className="font-semibold text-gray-800">Net Banking</p>
                                        <p className="text-sm text-gray-500">All major banks</p>
                                    </div>
                                    <span>{paymentMethod === "NET_BANKING" ? "●" : "○"}</span>
                                </div>
                            </button>
                        </div>
                    </section>

                    <aside>
                        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 lg:sticky lg:top-6">
                            <h2 className="text-lg font-bold text-gray-800 mb-5">Fare Summary</h2>

                            <div className="space-y-4">
                                <div className="flex justify-between gap-3">
                                    <div>
                                        <p className="text-xs text-gray-400">Departure</p>
                                        <p className="text-sm font-semibold">{selectedOnwardFlight?.source} → {selectedOnwardFlight?.destination}</p>
                                    </div>
                                    <span>₹{onwardPrice}</span>
                                </div>

                                {selectedReturnFlight && (
                                    <div className="flex justify-between gap-3">
                                        <div>
                                            <p className="text-xs text-gray-400">Return</p>
                                            <p className="text-sm font-semibold">{selectedReturnFlight?.source} → {selectedReturnFlight?.destination}</p>
                                        </div>
                                        <span>₹{returnPrice}</span>
                                    </div>
                                )}

                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex justify-between">
                                        <span className="text-gray-500">Passengers</span>
                                        <span className="font-semibold">{passengerCount}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Payment Method</span>
                                    <span className="font-semibold text-gray-700">{paymentMethod}</span>
                                </div>

                                <div className="border-t border-gray-200 pt-4">
                                    <div className="flex justify-between items-center">
                                        <span className="font-semibold">Total</span>
                                        <span className="text-2xl font-bold text-blue-600">₹{total}</span>
                                    </div>
                                </div>

                                <button type="button" onClick={handlePayment} disabled={loading} className="w-full h-12 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition">
                                    {loading ? "Processing..." : `Pay ₹${total} & Book`}
                                </button>

                                <button type="button" onClick={() => navigate("/booking-review")} className="w-full h-11 border border-gray-300 hover:bg-gray-50 text-gray-700 font-medium rounded-xl transition">
                                    ← Back to Review
                                </button>

                                <p className="text-xs text-gray-400 text-center">🔒 Secure payment powered by Razorpay</p>
                            </div>
                        </div>
                    </aside>
                </div>
            </main>
        </div>
    );
};

export default Payment;