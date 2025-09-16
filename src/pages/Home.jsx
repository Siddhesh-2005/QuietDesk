import React from "react";
// No more hooks for auth logic needed here!

function Home() {
  // All auth logic is now handled by the ProtectedRoute and AuthCallback
  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Welcome to QuietDesk
          </h1>
          <p className="mt-3 max-w-md mx-auto text-base text-gray-500 sm:text-lg md:mt-5 md:text-xl md:max-w-3xl">
            You are successfully logged in. This is a protected page.
          </p>
        </div>

        <div className="mt-10">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature cards can be added here later */}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;