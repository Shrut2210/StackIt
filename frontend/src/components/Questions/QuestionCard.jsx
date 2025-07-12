import React from "react";
import { Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { MessageCircle, ThumbsUp, Eye, CheckCircle } from "lucide-react";

const QuestionCard = ({ question }) => {
  const stripHtml = (html) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    return div.textContent || div.innerText || "";
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        {/* Stats */}
        <div className="flex flex-col items-center space-y-2 text-sm text-gray-500 min-w-16">
          <div className="flex flex-col items-center">
            <span className="font-medium text-gray-900">{question.votes}</span>
            <span>votes</span>
          </div>
          <div
            className={`flex flex-col items-center ${
              question.hasAcceptedAnswer ? "text-green-600" : ""
            }`}
          >
            <span
              className={`font-medium ${
                question.hasAcceptedAnswer ? "text-green-600" : "text-gray-900"
              }`}
            >
              {question.answers}
            </span>
            <span>answers</span>
            {question.hasAcceptedAnswer && (
              <CheckCircle className="w-4 h-4 mt-1" />
            )}
          </div>
          <div className="flex flex-col items-center">
            <span className="font-medium text-gray-900">{question.views}</span>
            <span>views</span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          <Link
            to={`/question/${question.id}`}
            className="text-blue-600 hover:text-blue-800 text-lg font-medium mb-2 block"
          >
            {question.title}
          </Link>

          <p className="text-gray-600 text-sm mb-3 line-clamp-2">
            {stripHtml(question.description).substring(0, 200)}...
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-3">
            {question.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-md"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Author and timestamp */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <img
                src={question.author.avatar}
                alt={question.author.username}
                className="w-6 h-6 rounded-full"
              />
              <span className="text-sm text-gray-600">
                {question.author.username}
              </span>
              <span className="text-sm text-gray-400">
                {question.author.reputation} rep
              </span>
            </div>
            <span className="text-sm text-gray-500">
              asked{" "}
              {formatDistanceToNow(question.createdAt, { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuestionCard;
