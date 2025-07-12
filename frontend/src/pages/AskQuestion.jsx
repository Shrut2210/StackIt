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
  const [isPreview, setIsPreview] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      navigate("/login");
      return;
    }

    if (!title.trim() || !description.trim() || tags.length === 0) {
      alert("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // In a real app, this would make an API call to create the question
    console.log("Creating question:", { title, description, tags });

    setIsSubmitting(false);
    navigate("/");
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
              onClick={() => setIsPreview(!isPreview)}
              className="flex items-center space-x-2 px-3 py-1 text-sm text-gray-600 hover:text-gray-900 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              <Eye className="w-4 h-4" />
              <span>{isPreview ? "Edit" : "Preview"}</span>
            </button>
          </div>

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
              placeholder="Provide more details about your question. Include what you've tried and what specific help you need."
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
