import React, { forwardRef } from "react";

function Button({ children, className = "", ...props }, ref) {
  return (
    <button
      ref={ref}
      {...props}
      className={`px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 duration-200 ${className}`}
    >
      {children}
    </button>
  );
}

export default forwardRef(Button);
