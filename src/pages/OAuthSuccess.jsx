import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";

import { setToken } from "../slice/AuthSlice";
import { flightSearch } from "../slice/FlightSlice";

const OAuthSuccess = () => {

    const navigate = useNavigate();
    const dispatch = useDispatch();

    useEffect(() => {

        const handleOAuthSuccess = async () => {

            const params = new URLSearchParams(window.location.search);
            const token = params.get("token");

            if (!token) {
                navigate("/login", { replace: true });
                return;
            }

            // Save token in Redux + localStorage
            dispatch(setToken(token));

            toast.success("Login successfully!");

            const pendingSearch = localStorage.getItem("pendingFlightSearch");

            if (pendingSearch) {

                const searchPayload = JSON.parse(pendingSearch);
                localStorage.removeItem("pendingFlightSearch");

                try {
                    await dispatch(flightSearch(searchPayload)).unwrap();
                    navigate("/flights", { replace: true });
                } catch (error) {
                    toast.error("Flight search failed");
                    navigate("/", { replace: true });
                }

                return;
            }

            // Normal Google login
            navigate("/", { replace: true });
        };

        handleOAuthSuccess();

    }, [dispatch, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <p>Signing you in...</p>
        </div>
    );
};

export default OAuthSuccess;