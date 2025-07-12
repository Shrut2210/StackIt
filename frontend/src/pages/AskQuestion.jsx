import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Save, Eye } from "lucide-react";
import RichTextEditor from "../components/Editor/RichTextEditor";
import TagInput from "../components/Questions/TagInputs";
import { useAuth } from "../contexts/AuthContext";

const AskQuestion = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   if (!user) {
  //     navigate("/login");
  //     return;
  //   }
  //   console.log("user :", user);

  //   if (!title.trim() || !description.trim() || tags.length === 0) {
  //     alert("Please fill in all fields");
  //     return;
  //   }

  //   setIsSubmitting(true);

  //   const response = await fetch("http://localhost:5000/api/questions", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${localStorage.getItem("stackit_token")}`,
  //     },
  //     body: JSON.stringify({
  //       author_id: user.id,
  //       title: title,
  //       description: description,
  //       tags: tags.map((tag) => tag.value),
  //       image_url: image,
  //     }),
  //   });
  //   const data = await response.json();
  //   setIsSubmitting(false);
  //   if (response.ok) {
  //     alert("Question posted successfully!");
  //     navigate(`/questions/${data.id}`);
  //   } else {
  //     alert(data.message || "Failed to post question");
  //   }
  //   setTitle("");
  //   setDescription("");
  //   setTags([]);
  //   setIsPreview(false);
  // };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) return navigate("/login");

    if (!title.trim() || !description.trim() || tags.length === 0) {
      alert("Please fill in all required fields.");
      return;
    }

    // setIsSubmitting(true);

    let uploadedImageUrl = image;

    // If image is a File (not already a URL), upload it
    if (image && typeof image !== "string") {
      const formData = new FormData();
      formData.append("image", image);

      try {
        const uploadRes = await fetch("/api/questions/upload", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("stackit_token")}`,
          },
          body: formData,
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok || !uploadData.url) {
          throw new Error(uploadData.message || "Image upload failed");
        }

        uploadedImageUrl = uploadData.url;
      } catch (err) {
        alert(err.message);
        // setIsSubmitting(false);
        return;
      }
    }

    try {
      const response = await fetch("http://localhost:5000/api/questions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("stackit_token")}`,
        },
        body: JSON.stringify({
          author_id: user.id,
          title,
          description,
          tags: tags.map((tag) => tag.value),
          image_url: uploadedImageUrl,
        }),
      });

      const data = await response.json();
      setIsSubmitting(false);

      if (response.ok) {
        alert("Question posted successfully!");
        navigate(`/questions/${data.id}`);
        setTitle("");
        setDescription("");
        setTags([]);
        setImage(null);
        setImagePreview(null);
      } else {
        alert(data.message || "Failed to post question.");
      }
    } catch (error) {
      setIsSubmitting(false);
      alert("An unexpected error occurred.");
      console.error("Submit Error:", error);
    }
  };

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            You need to be logged in to ask a question
          </h1>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Log in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Ask a Question
        </h1>
        <p className="text-gray-600">
          Share your question with the community and get expert answers
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title */}
        <div>
          <label
            htmlFor="title"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Question Title *
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. How to center a div in CSS?"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            maxLength={200}
          />
          <p className="text-sm text-gray-500 mt-1">
            Be specific and clear about what you're asking
          </p>
        </div>

        {/* Description */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Question Description *
            </label>
            <button
              type="button"
              onClick={() => {
                setIsPreview(!isPreview);
                setImagePreview(!imagePreview);
              }}
              className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>{isPreview ? "Edit" : "Preview"}</span>
            </button>
          </div>

          {imagePreview && (
            <div className="mb-4">
              <img
                src={image}
                alt="Preview"
                className="max-w-full h-auto rounded-lg mb-2"
              />
            </div>
          )}
          {isPreview ? (
            <div className="border border-gray-300 rounded-lg p-4 bg-gray-50 min-h-32">
              <div
                className="prose max-w-none"
                dangerouslySetInnerHTML={{
                  __html:
                    description ||
                    '<p class="text-gray-500">Nothing to preview</p>',
                }}
              />
            </div>
          ) : (
            <RichTextEditor
              value={description}
              onChange={setDescription}
              setImage={setImage}
            />
          )}
          <p className="text-sm text-gray-500 mt-1">
            Include code snippets, error messages, and what you've already tried
          </p>
        </div>

        {/* Tags */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tags *
          </label>
          <TagInput
            tags={tags}
            onChange={setTags}
            placeholder="Add up to 5 tags (e.g. react, javascript, css)"
            maxTags={5}
          />
          <p className="text-sm text-gray-500 mt-1">
            Add relevant tags to help others find your question
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex items-center space-x-4 pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={
              isSubmitting ||
              !title.trim() ||
              !description.trim() ||
              tags.length === 0
            }
            className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                Publishing...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Post Question
              </>
            )}
          </button>

          <button
            type="button"
            onClick={() => navigate("/")}
            className="px-6 py-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>

      {/* Tips */}
      <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
        <h3 className="text-lg font-semibold text-blue-900 mb-3">
          Tips for asking a great question:
        </h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Make your title specific and descriptive</li>
          <li>• Include relevant code snippets and error messages</li>
          <li>• Explain what you've already tried</li>
          <li>• Use proper tags to categorize your question</li>
          <li>• Be respectful and clear in your communication</li>
        </ul>
      </div>
    </div>
  );
};

export default AskQuestion;
