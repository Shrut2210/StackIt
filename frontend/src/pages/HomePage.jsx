import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Plus, Filter, TrendingUp, Clock, Users } from "lucide-react";
import QuestionCard from "../components/Questions/QuestionCard";
// import { useAuth } from "../contexts/AuthContext";

const HomePage = () => {
  const [questions, setQuestions] = useState([]);
  const [sortBy, setSortBy] = useState("newest");
  const [loading, setLoading] = useState(true);

  const stats = [
    { label: "Questions", value: "2.3k", icon: Users },
    { label: "Answers", value: "8.1k", icon: TrendingUp },
    { label: "Active Users", value: "456", icon: Clock },
  ];

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/questions");
        const result = await response.json();
        if (result.status === 200) {
          setQuestions(result.data);
        } else {
          console.error("Failed to fetch questions");
        }
      } catch (err) {
        console.error("Error:", err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchQuestions();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to StackIt
          </h1>
          <p className="text-gray-600">
            A place to ask questions, share knowledge, and learn together
          </p>
        </div>
      </div>

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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              Latest Questions
            </h2>
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                {["newest", "trending", "unanswered"].map((label) => (
                  <button
                    key={label}
                    onClick={() => setSortBy(label)}
                    className={`px-3 py-1 text-sm rounded-md transition-colors ${
                      sortBy === label
                        ? "bg-white text-gray-900 shadow-sm"
                        : "text-gray-600 hover:text-gray-900"
                    }`}
                  >
                    {label.charAt(0).toUpperCase() + label.slice(1)}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {loading ? (
            <p>Loading questions...</p>
          ) : (
            <div className="space-y-4">
              {questions.map((question) => (
                <Link
                  href={`'question/' +  ${question.id}+'/answers'`}
                  key={question.id}
                >
                  <QuestionCard
                    key={question.id}
                    question={{
                      id: question.id,
                      title: question.title,
                      description: `<p>${question.description}</p>`,
                      author: {
                        username: `user-${question.author_id}`,
                        avatar:
                          question.image_url ||
                          "https://via.placeholder.com/100",
                        reputation: Math.floor(Math.random() * 1000),
                      },
                      tags: ["javascript"],
                      createdAt: new Date(question.created_at),
                      views: Math.floor(Math.random() * 1000),
                      answers: Math.floor(Math.random() * 5),
                      votes: Math.floor(Math.random() * 30),
                      hasAcceptedAnswer: false,
                    }}
                  />
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
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
