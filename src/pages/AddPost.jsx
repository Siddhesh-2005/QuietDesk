import React, { useState } from "react";
import { useForm } from "react-hook-form";
import Input from "../components/Input";
import Button from "../components/Button";
import AddFileButton from "../components/AddFileButton";
import postsService from "../appwriteservices/posts";
import { useSelector } from "react-redux";

function AddPost() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  // assuming user is in redux store
  const user = useSelector((state) => state.auth.userData);

  const onSubmit = async (data) => {
    console.log("=== FORM SUBMISSION STARTED ===");
    console.log("Form data received:", data);
    console.log("User from Redux:", user);
    
    if (!user?.$id) {
      console.log("❌ No user ID found");
      alert("You must be logged in to create a post.");
      return;
    }

    console.log("✅ User ID found:", user.$id);
    setLoading(true);

    try {
      console.log("📤 Calling postsService.createPost with:");
      const postData = {
        userId: user.$id,
        title: data.title,
        textContent: data.content,
        imageFile: data.image?.[0] || null,
      };
      console.log("Post data:", postData);
      
      // Add a check to see if postsService exists
      console.log("postsService:", postsService);
      console.log("postsService.createPost:", postsService.createPost);

      const result = await postsService.createPost(postData);
      
      console.log("✅ Post created successfully:", result);
      alert("✅ Post created successfully!");
      reset();
      setPreview(null);
    } catch (error) {
      console.log("=== ERROR CAUGHT ===");
      console.error("Full error object:", error);
      console.error("Error name:", error.name);
      console.error("Error message:", error.message);
      console.error("Error stack:", error.stack);
      
      if (error.response) {
        console.error("Error response:", error.response);
        console.error("Response status:", error.response.status);
        console.error("Response data:", error.response.data);
      }
      
      if (error.code) {
        console.error("Error code:", error.code);
      }
      
      alert(`❌ Failed to create post: ${error.message}`);
    } finally {
      console.log("=== FORM SUBMISSION ENDED ===");
      setLoading(false);
    }
  };

  // handle preview update
  const handleFileChange = (e) => {
    console.log("File change event:", e.target.files);
    const file = e.target.files?.[0];
    // && file.type.startsWith("image/")
    if (file ) {
      console.log("Setting preview for file:", file.name);
      setPreview(URL.createObjectURL(file));
    } else {
      console.log("No valid image file selected");
      setPreview(null);
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-10 p-6 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Create New Post</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Title */}
        <Input
          label="Post Title"
          placeholder="Enter a title"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && (
          <p className="text-red-500 text-sm">{errors.title.message}</p>
        )}

        {/* Content */}
        <div className="w-full">
          <label className="block mb-1 text-sm font-medium">Content</label>
          <textarea
            placeholder="Write your content here..."
            rows={5}
            className="px-3 py-2 rounded-lg bg-white text-black outline-none focus:bg-gray-50 duration-200 border border-gray-200 w-full"
            {...register("content", { required: "Content is required" })}
          />
        </div>
        {errors.content && (
          <p className="text-red-500 text-sm">{errors.content.message}</p>
        )}

        {/* Image (optional) */}
        <AddFileButton
          label="Upload Image"
          {...register("image")}
          onChange={(e) => {
            handleFileChange(e);
          }}
        />

        {preview && (
          <div className="mt-3 w-32 h-32">
            <img
              src={preview}
              alt="preview"
              className="w-full h-full object-cover rounded-lg border"
            />
          </div>
        )}

        {/* Submit */}
        <Button type="submit" disabled={loading} className="w-full">
          {loading ? "Posting..." : "Add Post"}
        </Button>
      </form>
      
      {/* Debug info */}
      <div className="mt-4 p-2 bg-gray-100 text-xs rounded">
        <strong>Debug Info:</strong>
        <div>User ID: {user?.$id || "Not found"}</div>
        <div>Posts Service: {postsService ? "Loaded" : "Not loaded"}</div>
      </div>
    </div>
  );
}

export default AddPost;