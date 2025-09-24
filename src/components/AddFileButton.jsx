import React, { forwardRef, useId, useState } from "react";

function AddFileButton({ label = "Add Image", className = "", ...props }, ref) {
  const id = useId();
  const [preview, setPreview] = useState(null);

  const handleChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }

    if (props.onChange) {
      props.onChange(e); // allow parent to handle
    }
  };

  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className={`flex items-center gap-2 cursor-pointer text-blue-600 hover:underline ${className}`}
      >
        📎 {label}
      </label>
      <input
        id={id}
        ref={ref}
        type="file"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
        {...props}
      />

      {/* Preview Thumbnail */}
      {preview && (
        <div className="mt-3 w-32 h-32">
          <img
            src={preview}
            alt="preview"
            className="w-full h-full object-cover rounded-lg border"
          />
        </div>
      )}
    </div>
  );
}

export default forwardRef(AddFileButton);
