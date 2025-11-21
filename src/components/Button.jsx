import React, { forwardRef } from "react";

function Button({ children, className = "", ...props }, ref) {
  return (
    <button
      ref={ref}
      {...props}
      className={`px-4 py-2 rounded-lg bg-white/20 text-white border border-white/30 hover:bg-white/30 backdrop-blur-sm duration-200 disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}

export default forwardRef(Button);
