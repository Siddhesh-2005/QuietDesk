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
    setValue,
    formState: { errors },
    reset,
  } = useForm();

  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(null);

  // assuming user is in redux store
  const user = useSelector((state) => state.auth.userData);

  const onSubmit = async (data) => {
   console.log(data);
   
    
    if (!user?.$id) {
      alert("You must be logged in to create a post.");
      return;
    }

    setLoading(true);

    try {
      await postsService.createPost({
        userId: user.$id,
        title: data.title,
        textContent: data.content,
        imageFile: data.image?.[0] || null,
      });

      alert("✅ Post created successfully!");
      reset();
      setPreview(null);
    } catch (error) {
      console.error("Error creating post:", error);
      alert("❌ Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  // handle preview update
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith("image/")) {
      setPreview(URL.createObjectURL(file));
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="min-h-screen pt-24 py-6 px-4 sm:px-8 lg:px-16" style={{backgroundColor: '#1f1f1f'}}>
      <div className="w-1/2 mx-auto bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 border border-gray-700/50 rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6 text-white">Create New Post</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Title */}
        <Input
          label="Post Title"
          placeholder="Enter a title"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && (
          <p className="text-red-300 text-sm">{errors.title.message}</p>
        )}

        {/* Content */}
        <div className="w-full">
          <label className="block mb-1 text-sm font-medium text-white">Content</label>
          <textarea
            placeholder="Write your content here..."
            rows={5}
            className="px-3 py-2 rounded-lg bg-gray-800/50 text-white placeholder-gray-400 outline-none focus:bg-gray-700/50 duration-200 border border-gray-600/50 w-full backdrop-blur-sm"
            {...register("content", { required: "Content is required" })}
          />
        </div>
        {errors.content && (
          <p className="text-red-300 text-sm">{errors.content.message}</p>
        )}

        {/* Image (optional) */}
        <AddFileButton
          label="Upload Image"
          onChange={(e) => {
            // update preview locally
            handleFileChange(e);

            // ensure react-hook-form receives the file list
            // setValue expects the same shape as register would provide
            setValue("image", e.target.files, { shouldValidate: true });
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
    </div>
    </div>
  );
}

export default AddPost;
