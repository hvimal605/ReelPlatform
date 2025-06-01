import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useEffect, useState, useCallback } from "react";
import debounce from "lodash/debounce";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";  // Added react-icons for check and cross
import axios from "axios";
import { sendOtp, signUp } from "../services/operations/authApi";
import { setSignupData } from "../slices/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
// Yup schema
const schema = yup.object().shape({
    name: yup.string().required("Name is required"),
    username: yup
        .string()
        .min(3, "Username must be at least 3 characters")
        .matches(/^\S+$/, "Username cannot contain spaces")  // No spaces allowed
        .required("Username is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    password: yup.string().required("Password is required"),
    confirmPassword: yup
        .string()
        .oneOf([yup.ref("password"), null], "Passwords must match")
        .required("Please confirm your password"),
});
// .min(6, "Password must be at least 6 characters")
export default function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [isUsernameAvailable, setIsUsernameAvailable] = useState(null);
    const [suggestions, setSuggestions] = useState([]);
   const dispatch = useDispatch();
   const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        watch,
        setValue,
           reset,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(schema),
    });

    const name = watch("name");
    const username = watch("username");

   const checkUsernameAvailability = useCallback(
  debounce(async (username) => {
    if (!username || username.length < 3) {
      setIsUsernameAvailable(null);
      setSuggestions([]);
      return;
    }

    try {
      const res = await axios.get(
        `http://localhost:4000/api/v1/auth/check-username`,
        {
          params: { username },
        }
      );

      if (res.status === 200) {
        setIsUsernameAvailable(true);
        setSuggestions([]);
      }
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setIsUsernameAvailable(false);
      } else {
        setIsUsernameAvailable(null);
        setSuggestions([]);
      }
    }
  }, 500),
  []
);

    useEffect(() => {
        checkUsernameAvailability(username);
    }, [username, checkUsernameAvailability]);

    useEffect(() => {
        if (isUsernameAvailable === false && name) {
            const base = name.toLowerCase().replace(/\s+/g, "");
            const newSuggestions = [
                `${base}${Math.floor(Math.random() * 1000)}`,
                `${base}_${Date.now().toString().slice(-4)}`,
                `${base}.${name.split(" ")[0].toLowerCase()}`,
                `${base}${Math.floor(Math.random() * 10000)}`,
                `${base}_${Math.floor(Math.random() * 9999)}`,
            ];
            setSuggestions(newSuggestions);
        } else {
            setSuggestions([]);
        }
    }, [isUsernameAvailable, name]);

  const onSubmit = async (data) => {

   

    dispatch(setSignupData(data))
    // Send OTP to user for verification
    dispatch(sendOtp(data.email, navigate))

    
   
  
};


    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-gray-800 px-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md bg-gray-950/80 p-8 rounded-2xl shadow-2xl backdrop-blur-sm"
            >
                <h2 className="text-3xl font-extrabold text-white text-center mb-6">
                    <span className="bg-gradient-to-r from-cyan-400 to-fuchsia-500 bg-clip-text text-transparent">
                        Create an Account
                    </span>
                </h2>

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    {/* Name */}
                    <div>
                        <input
                            {...register("name")}
                            placeholder="Full Name"
                            className={`w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${errors.name ? "focus:ring-red-500" : "focus:ring-purple-500"
                                }`}
                        />
                        {errors.name && <p className="text-sm text-red-400 mt-1">{errors.name.message}</p>}
                    </div>

                    {/* Username with tick icon */}
                    <div className="relative">
                        <input
                            {...register("username")}
                            placeholder="Username"
                            className={`w-full pr-10 px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${errors.username || isUsernameAvailable === false
                                ? "focus:ring-red-500"
                                : "focus:ring-purple-500"
                                }`}
                        />
                        {/* Icon on the right */}
                        {isUsernameAvailable === true && username?.length > 2 && (
                            <FaCheckCircle
                                className="absolute right-3 top-3 text-green-500 text-xl pointer-events-none"
                                title="Username available"
                            />
                        )}
                        {isUsernameAvailable === false && (
                            <FaTimesCircle
                                className="absolute right-3 top-3 text-red-500 text-xl pointer-events-none"
                                title="Username taken"
                            />
                        )}
                        {isUsernameAvailable === true && username?.length > 2 && (
                            <>

                                <p className="text-sm text-green-400 mt-1 ml-1 inline-block">Username is available</p>
                            </>
                        )}

                        {isUsernameAvailable === false && (
                            <p className="text-sm text-red-400 mt-1">Username not available</p>
                        )}
                        {errors.username && <p className="text-sm text-red-400 mt-1">{errors.username.message}</p>}

                        {/* Suggestions */}
                        {suggestions.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-2">
                                {suggestions.map((sug, idx) => (
                                    <button
                                        type="button"
                                        key={idx}
                                        className="bg-gray-700 text-white text-sm px-3 py-1 rounded-full hover:bg-gray-600 transition"
                                        onClick={() => setValue("username", sug)}
                                    >
                                        {sug}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Email */}
                    <div>
                        <input
                            {...register("email")}
                            placeholder="Email"
                            className={`w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${errors.email ? "focus:ring-red-500" : "focus:ring-purple-500"
                                }`}
                        />
                        {errors.email && <p className="text-sm text-red-400 mt-1">{errors.email.message}</p>}
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <input
                            {...register("password")}
                            type={showPassword ? "text" : "password"}
                            placeholder="Password"
                            className={`w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${errors.password ? "focus:ring-red-500" : "focus:ring-purple-500"
                                }`}
                        />
                        <span
                            className="absolute right-4 top-3 text-gray-400 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FiEyeOff /> : <FiEye />}
                        </span>
                        {errors.password && <p className="text-sm text-red-400 mt-1">{errors.password.message}</p>}
                    </div>

                    {/* Confirm Password */}
                    <div className="relative">
                        <input
                            {...register("confirmPassword")}
                            type={showConfirm ? "text" : "password"}
                            placeholder="Confirm Password"
                            className={`w-full px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${errors.confirmPassword ? "focus:ring-red-500" : "focus:ring-purple-500"
                                }`}
                        />
                        <span
                            className="absolute right-4 top-3 text-gray-400 cursor-pointer"
                            onClick={() => setShowConfirm(!showConfirm)}
                        >
                            {showConfirm ? <FiEyeOff /> : <FiEye />}
                        </span>
                        {errors.confirmPassword && <p className="text-sm text-red-400 mt-1">{errors.confirmPassword.message}</p>}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 rounded-xl text-white font-semibold transition duration-200"
                    >
                        Sign Up
                    </button>
                </form>

                <div className="flex items-center my-6">
                    <div className="flex-grow h-px bg-gray-600"></div>
                    <span className="mx-4 text-gray-400">OR</span>
                    <div className="flex-grow h-px bg-gray-600"></div>
                </div>

                <p className="mt-6 text-center text-sm text-gray-500">
                    Already have an account?{" "}
                    <a href="/login" className="text-purple-400 hover:text-purple-300">
                        Sign in
                    </a>
                </p>
            </motion.div>
        </div>
    );
}
