import React, { forwardRef, useId } from "react";

function Input({ label, type = "text", className = "", ...props }, ref) {
  const id = useId();

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block mb-1 text-sm font-medium text-white">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        type={type}
        {...props}
        className={`px-3 py-2 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 outline-none focus:bg-gray-700/50 duration-200 border border-gray-600/50 w-full backdrop-blur-sm ${className}`}
      />
    </div>
  );
}

export default forwardRef(Input);
