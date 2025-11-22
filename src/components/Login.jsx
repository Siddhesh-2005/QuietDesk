import React, { useState, useEffect } from "react";
import authService from "../appwriteservices/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cooldownTime, setCooldownTime] = useState(0);
  const [message, setMessage] = useState("");

  // Timer effect for cooldown
  useEffect(() => {
    let interval;
    if (cooldownTime > 0) {
      interval = setInterval(() => {
        setCooldownTime((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [cooldownTime]);

  // Format time as MM:SS
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (cooldownTime > 0 || isLoading) return;
    
    try {
      setIsLoading(true);
      setMessage("");
      
      await authService.sendEmail({ email });
      console.log("Email submitted:", email);
      
      // Set success message and start cooldown
      setMessage("Sign-in link sent to your email!");
      setCooldownTime(120); // 2 minutes = 120 seconds
      
    } catch (error) {
      console.error("Sign in error:", error);
      setMessage("Failed to send email. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = isLoading || cooldownTime > 0;

  return (
    <div className="min-h-screen flex items-center justify-center py-6 px-4" style={{backgroundColor: '#1f1f1f'}}>
      {/* Background gradient overlay to match home page */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/10 via-purple-900/5 to-gray-900/10"></div>
      
      <div className="relative w-full max-w-md space-y-8">
        {/* Logo/Title section matching header style */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Quiet Desk</h1>
          <p className="text-gray-400">Welcome back</p>
        </div>

        {/* Main form card with glass morphism like PostCard */}
        <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-lg shadow-lg p-8">
          <h2 className="text-center text-2xl font-bold text-gray-100 mb-6">
            Sign in to your account
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-300 mb-2"
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
                className="w-full rounded-lg border border-white/20 bg-white/10 text-gray-200 px-4 py-3 shadow-sm focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/20 backdrop-blur-sm transition-all duration-200 placeholder-gray-400"
                placeholder="Enter your email"
              />
            </div>

            <button
              type="submit"
              disabled={isDisabled}
              className={`w-full rounded-full font-medium py-3 px-4 transition-all duration-200 backdrop-blur-sm border shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-400/20 ${
                isDisabled
                  ? 'bg-gray-600/50 border-gray-500/30 text-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 border-blue-500/30 text-white hover:border-blue-400/50 active:scale-95'
              }`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending...
                </div>
              ) : cooldownTime > 0 ? (
                `Wait ${formatTime(cooldownTime)} before retrying`
              ) : (
                'Sign in'
              )}
            </button>

            {/* Success/Error message */}
            {message && (
              <div className={`mt-4 p-3 rounded-lg text-sm ${
                message.includes('sent') 
                  ? 'bg-green-500/20 border border-green-500/30 text-green-300' 
                  : 'bg-red-500/20 border border-red-500/30 text-red-300'
              }`}>
                {message}
              </div>
            )}
          </form>

          {/* Additional styling elements */}
          <div className="mt-6 pt-6 border-t border-white/10">
            <p className="text-center text-sm text-gray-400">
              Enter your email to receive a sign-in link
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
