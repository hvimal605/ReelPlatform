import { useEffect, useState } from "react";
import OtpInput from "react-otp-input";
import { Link } from "react-router-dom";
import { BiArrowBack } from "react-icons/bi";
import { RxCountdownTimer } from "react-icons/rx";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { sendOtp, signUp } from "../services/operations/authApi";


function VerifyEmail() {
    const [otp, setOtp] = useState("");
    const { signupData, loading } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        if (!signupData) {
            navigate("/signup");
        }

    }, []);

    const handleVerifyAndSignup = (e) => {
        e.preventDefault();
        const {

            confirmPassword, email, name, password, username,

        } = signupData;

        dispatch(
            signUp(
                confirmPassword, email, name, password, username,
                otp,
                navigate
            )
        );
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen p-4  "
            style={{
                backgroundImage: "url('https://www.shutterstock.com/shutterstock/videos/1104069995/thumb/1.jpg?ip=x480')",
                backgroundPosition: "center",
                //   backgroundSize: "cover",
            }}
        >
            {/* Overlay */}
            <div className="absolute inset-0 bg-black/50"></div>
            {
                loading ? (
                    <div>
                        <div className="spinner"></div>
                    </div>
                ) : (<motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="relative bg-gray-800 p-8 rounded-xl shadow-2xl w-[105%] max-w-md border-white border-dashed border-2 backdrop-blur-md"
                >
                    <h1 className="text-3xl font-semibold text-center text-white">Verify Email</h1>
                    <p className="text-lg text-gray-300 text-center my-4">
                        A verification code has been sent to you. Enter the code below.
                    </p>

                    <form onSubmit={handleVerifyAndSignup} className="space-y-4">
                        <OtpInput
                            value={otp}
                            onChange={setOtp}
                            numInputs={6}
                            renderInput={(props) => (
                                <input
                                    {...props}
                                    placeholder="-"
                                    style={{
                                        boxShadow: "inset 0px -1px 0px rgba(255, 255, 255, 0.18)",
                                    }}
                                    className="w-[48px] lg:w-[60px] border border-cyan-800 bg-richblack-800 rounded-[0.5rem]  aspect-square text-center focus:border-0 focus:outline-2 focus:outline-purple-600 text-purple-800  text-xl font-bold  placeholder:text-blue-300 placeholder:text-2xl"
                                />
                            )}
                            containerStyle={{
                                justifyContent: "space-between",
                                gap: "0 6px",
                            }}
                        />
                        <motion.button
                            type="submit"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                            className="w-full bg-purple-300 py-3 rounded-lg text-black font-semibold hover:bg-purple-400 transition-all"
                        >
                            Verify Email
                        </motion.button>
                    </form>

                    <div className="mt-6 flex justify-between items-center">
                        <Link to="/signup" className="text-white flex items-center gap-x-2">
                            <BiArrowBack />
                            Back to Signup
                        </Link>
                        <button className="text-purple-300 flex items-center gap-x-2"

                            onClick={() => dispatch(sendOtp(signupData.email))}>
                            <RxCountdownTimer />
                            Resend it
                        </button>
                    </div>
                </motion.div>)
            }

        </div>


    );
}

export default VerifyEmail;