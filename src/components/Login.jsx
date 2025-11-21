import React, { useState } from "react";
import authService from "../appwriteservices/auth";

function Login() {
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.sendEmail({ email });
      console.log("Email submitted:", email);
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center" style={{backgroundColor: '#1f1f1f'}}>
      
      <div className="w-full max-w-md space-y-8 rounded-lg bg-gray-900/80 backdrop-blur-md border border-gray-700/50 p-8 shadow-xl">
        <h2 className="text-center text-3xl font-bold text-gray-100">
          Sign in to your account
        </h2>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-400"
            >
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border border-gray-600/50 bg-gray-800/50 text-gray-200 px-3 py-2 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-blue-500 backdrop-blur-sm"
              placeholder="Enter your email"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-md bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

export default Login;
