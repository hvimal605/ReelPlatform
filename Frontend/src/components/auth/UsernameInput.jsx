// components/UsernameInput.js
import { useEffect, useState, useCallback } from "react";
import debounce from "lodash/debounce";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function UsernameInput({ value, setValue, fullName, originalUsername }) {
    const [isAvailable, setIsAvailable] = useState(null);
    const [suggestions, setSuggestions] = useState([]);

    const checkAvailability = useCallback(
        debounce(async (username) => {
            if (!username || username.length < 3) {
                setIsAvailable(null);
                setSuggestions([]);
                return;
            }

            if (username === originalUsername) {
                setIsAvailable(true);
                setSuggestions([]);
                return;
            }


            try {
                const res = await fetch(`http://localhost:4000/api/v1/auth/check-username?username=${username}`);
                if (res.status === 200) {
                    setIsAvailable(true);
                    setSuggestions([]);
                } else if (res.status === 409) {
                    setIsAvailable(false);
                } else {
                    setIsAvailable(null);
                }
            } catch {
                setIsAvailable(null);
            }
        }, 500),
        []
    );

    useEffect(() => {
        checkAvailability(value);
    }, [value]);

    useEffect(() => {
        if (isAvailable === false && fullName) {
            const base = fullName.toLowerCase().replace(/\s+/g, "");
            const suggestions = [
                `${base}${Math.floor(Math.random() * 1000)}`,
                `${base}_${Date.now().toString().slice(-4)}`,
                `${base}.${fullName.split(" ")[0].toLowerCase()}`,
                `${base}${Math.floor(Math.random() * 10000)}`,
                `${base}_${Math.floor(Math.random() * 9999)}`,
            ];
            setSuggestions(suggestions);
        } else {
            setSuggestions([]);
        }
    }, [isAvailable, fullName]);

    return (
        <div className="relative">
            <input
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Username"
                className={`w-full pr-10 px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${isAvailable === false ? "focus:ring-red-500" : "focus:ring-purple-500"
                    }`}
            />
            {isAvailable === true && value?.length > 2 && (
                <FaCheckCircle className="absolute right-3 top-3 text-green-500 text-xl pointer-events-none" title="Username available" />
            )}
            {isAvailable === false && (
                <FaTimesCircle className="absolute right-3 top-3 text-red-500 text-xl pointer-events-none" title="Username taken" />
            )}
            {isAvailable === true && value?.length > 2 && (
                <p className="text-sm text-green-400 mt-1 ml-1 inline-block">Username is available</p>
            )}
            {isAvailable === false && <p className="text-sm text-red-400 mt-1">Username not available</p>}

            {suggestions.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-2">
                    {suggestions.map((sug, idx) => (
                        <button
                            type="button"
                            key={idx}
                            className="bg-gray-700 text-white text-sm px-3 py-1 rounded-full hover:bg-gray-600 transition"
                            onClick={() => setValue(sug)}
                        >
                            {sug}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}

