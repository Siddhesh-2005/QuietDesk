import React from "react";
import { Outlet } from "react-router-dom";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header (if needed) */}
      {/* <Navbar /> */}

      {/* Render child route */}
      <Outlet />

      {/* Footer (if needed) */}
    </div>
  );
}

export default App;
