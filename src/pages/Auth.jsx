import { useState } from "react";
import Login from "../components/auth/Login";
import Register from "../components/auth/Register";

const Auth = () => {
    const [isRegister, setIsRegister] = useState(true);

    const toggleForm = () => {
        setIsRegister((prev) => !prev);
    };

    return (
        <div className="max-w-xl mx-auto mt-16 p-6 bg-white shadow-md rounded-xl">
            <div className="mb-6 text-center">
                <h2 className="text-2xl font-semibold">
                    {isRegister ? "Create an Account" : "Log In to Holidaze"}
                </h2>
                <p className="text-gray-600 mt-1">
                    {isRegister ? "Already have an account?" : "Need an account?"}{" "}
                    <button
                        onClick={toggleForm}
                        className="text-blue-600 hover:underline font-medium"
                    >
                        {isRegister ? "Log In" : "Register"}
                    </button>
                </p>
            </div>

            {isRegister ? <Register /> : <Login />}
        </div>
    );
};

export default Auth;
