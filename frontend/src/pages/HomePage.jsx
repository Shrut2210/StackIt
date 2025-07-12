import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Plus, Filter, TrendingUp, Clock, Users } from "lucide-react";
import QuestionCard from "../components/Questions/QuestionCard";
// import { useAuth } from "../contexts/AuthContext";

const HomePage = () => {
  //   const { user } = useAuth();
  const [sortBy, setSortBy] = useState("newest");

  // Mock data - in a real app, this would come from an API
  const questions = [
    {
      id: "1",
      title: "How to center a div in CSS?",
      description:
        "<p>I have been trying to center a div element both horizontally and vertically, but I can't seem to get it right. I've tried using flexbox and grid but nothing works as expected.</p>",
      author: {
        username: "webdev_starter",
        avatar:
          "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2",
        reputation: 234,
      },
      tags: ["css", "flexbox", "layout"],
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
      views: 1205,
      answers: 3,
      votes: 15,
      hasAcceptedAnswer: true,
    },
    {
      id: "2",
      title: "React useState hook not updating state immediately",
      description:
        "<p>I'm having an issue where my state is not updating immediately after calling setState. I understand this is asynchronous, but how can I access the updated value right after setting it?</p>",
      author: {
        username: "react_learner",
        avatar:
          "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2",
        reputation: 156,
      },
      tags: ["react", "hooks", "javascript"],
      createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
      views: 892,
      answers: 2,
      votes: 8,
      hasAcceptedAnswer: false,
    },
    {
      id: "3",
      title: "Best practices for API error handling in Node.js",
      description:
        "<p>What are the recommended patterns for handling errors in Node.js APIs? Should I use try-catch blocks everywhere or is there a more elegant solution?</p>",
      author: {
        username: "backend_dev",
        avatar:
          "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2",
        reputation: 567,
      },
      tags: ["nodejs", "express", "error-handling"],
      createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
      views: 445,
      answers: 1,
      votes: 12,
      hasAcceptedAnswer: false,
    },
  ];

  const stats = [
    { label: "Questions", value: "2.3k", icon: Users },
    { label: "Answers", value: "8.1k", icon: TrendingUp },
    { label: "Active Users", value: "456", icon: Clock },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to StackIt
          </h1>
          <p className="text-gray-600">
            A place to ask questions, share knowledge, and learn together
          </p>
        </div>
        {/* {user && (
          <Link
            to="/ask"
            className="mt-4 md:mt-0 inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5 mr-2" />
            Ask Question
          </Link>
        )} */}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-lg border border-gray-200"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="w-8 h-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-gray-600">{stat.label}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-3">
          {/* Sort Options */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Latest Questions
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setSortBy("newest")}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    sortBy === "newest"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Newest
                </button>
                <button
                  onClick={() => setSortBy("trending")}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    sortBy === "trending"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Trending
                </button>
                <button
                  onClick={() => setSortBy("unanswered")}
                  className={`px-3 py-1 text-sm rounded-md transition-colors ${
                    sortBy === "unanswered"
                      ? "bg-white text-gray-900 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  Unanswered
                </button>
              </div>
            </div>
          </div>

          {/* Questions List */}
          <div className="space-y-4">
            {questions.map((question) => (
              <QuestionCard key={question.id} question={question} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Popular Tags */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Popular Tags
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                "React",
                "JavaScript",
                "CSS",
                "Node.js",
                "Python",
                "TypeScript",
              ].map((tag) => (
                <span
                  key={tag}
                  className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-md cursor-pointer hover:bg-blue-200 transition-colors"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Hot Questions */}
          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Hot Questions
            </h3>
            <div className="space-y-3">
              {[
                "How to optimize React performance?",
                "Best practices for TypeScript?",
                "CSS Grid vs Flexbox?",
              ].map((title, index) => (
                <Link
                  key={index}
                  to="#"
                  className="block text-sm text-blue-600 hover:text-blue-800 border-b border-gray-100 pb-2 last:border-b-0"
                >
                  {title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
