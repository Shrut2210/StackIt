import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Eye, Clock, CheckCircle, Plus } from "lucide-react";
import VotingButtons from "../components/Votings/VotingButtons";
import RichTextEditor from "../components/Editor/RichTextEditor";
import { useAuth } from "../contexts/AuthContext";

const QuestionDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [question, setQuestion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newAnswer, setNewAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // api call to fetch question details and answers
  const [question, setQuestion] = useState({
    id,
    title: "Sample Question Title",
    description: "<p>This is a sample question description.</p>",
    createdAt: new Date(),
    views: 123,
    votes: 10,
    tags: ["react", "javascript"],
    author: {
      username: "john_doe",
      avatar: "https://via.placeholder.com/40",
      reputation: 150,
    },
  });
  const [answers, setAnswers] = useState([
    {
      id: 1,
      content: "<p>This is a sample answer.</p>",
      createdAt: new Date(),
      votes: 5,
      isAccepted: false,
      author: {
        username: "jane_doe",
        avatar: "https://via.placeholder.com/40",
        reputation: 200,
      },
    },
  ]);
  useEffect(() => {
    // get question details and answers from API
    fetch(`http://localhost:5000/api/questions/${id}/answers`)
      .then((res) => res.json())
      .then((data) => {
        data.question.createdAt = new Date(data.question.createdAt);
        if (data.answers.length > 0) {
          data.answers = data.answers.map((a) => ({
            ...a,
            createdAt: new Date(a.createdAt),
          }));
        }
        setQuestion(data.question);
        setAnswers(data.answers);
      })
      .catch((err) => console.error("Error fetching question details:", err));
  }, [id]);

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (!newAnswer.trim()) return;

    setIsSubmitting(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    console.log("Submitting answer:", newAnswer);
    setNewAnswer("");
    setIsSubmitting(false);
  };

  if (loading)
    return <div className="text-center py-12">Loading question...</div>;
  if (!question)
    return <div className="text-center py-12">Question not found.</div>;

  const answers = question.answers || [];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Question */}
      <div className="bg-white border border-gray-200 rounded-lg p-6 mb-6">
        <div className="flex items-start space-x-6">
          {/* Voting */}
          <VotingButtons initialVotes={question.votes} />

          {/* Content */}
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              {question.title}
            </h1>

            {/* Question Meta */}
            <div className="flex items-center space-x-6 text-sm text-gray-500 mb-6">
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>asked</span>
              </div>
              <div className="flex items-center space-x-1">
                <Eye className="w-4 h-4" />
                <span>{question.views} views</span>
              </div>
            </div>

            {/* Question Content */}
            <div
              className="prose max-w-none mb-6"
              dangerouslySetInnerHTML={{ __html: question.description }}
            />

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {question.tags.map((tag, index) => (
                <Link
                  key={index}
                  to={`/questions/tagged/${tag}`}
                  className="inline-block bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded-md hover:bg-blue-200 transition-colors"
                >
                  {tag}
                </Link>
              ))}
            </div>

            {/* Author Info */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-3">
                <img
                  src={question.author.avatar}
                  alt={question.author.username}
                  className="w-8 h-8 rounded-full"
                />
                <div>
                  <Link
                    to={`/user/${question.author.username}`}
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    {question.author.username}
                  </Link>
                  <p className="text-sm text-gray-500">
                    {question.author.reputation} reputation
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Answers */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          {answers.length} Answer{answers.length !== 1 ? "s" : ""}
        </h2>

        <div className="space-y-6">
          {answers.map((answer) => (
            <div
              key={answer.id}
              className="bg-white border border-gray-200 rounded-lg p-6"
            >
              <div className="flex items-start space-x-6">
                {/* Voting */}
                <div className="flex flex-col items-center space-y-2">
                  <VotingButtons initialVotes={answer.votes} />
                  {answer.isAccepted && (
                    <div className="flex items-center justify-center w-8 h-8 bg-green-100 rounded-full">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1">
                  <div
                    className="prose max-w-none mb-4"
                    dangerouslySetInnerHTML={{ __html: answer.content }}
                  />

                  {/* Answer Meta */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                      answered{" "}
                      {formatDistanceToNow(answer.createdAt, {
                        addSuffix: true,
                      })}
                    </span>
                    <div className="flex items-center space-x-3">
                      <img
                        src={answer.author.avatar}
                        alt={answer.author.username}
                        className="w-6 h-6 rounded-full"
                      />
                      <div className="text-sm">
                        <Link
                          to={`/user/${answer.author.username}`}
                          className="text-blue-600 hover:text-blue-800 font-medium"
                        >
                          {answer.author.username}
                        </Link>
                        <span className="text-gray-500 ml-2">
                          {answer.author.reputation} rep
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Answer */}
      {user ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Your Answer
          </h3>

          <form onSubmit={handleAnswerSubmit}>
            <RichTextEditor
              value={newAnswer}
              onChange={setNewAnswer}
              placeholder="Write your answer here..."
              className="mb-4"
            />

            <button
              type="submit"
              disabled={isSubmitting || !newAnswer.trim()}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Posting...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" />
                  Post Answer
                </>
              )}
            </button>
          </form>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <p className="text-gray-600 mb-4">
            You need to be logged in to post an answer
          </p>
          <Link
            to="/login"
            className="inline-flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Log in to Answer
          </Link>
        </div>
      )}
    </div>
  );
};

export default QuestionDetail;
