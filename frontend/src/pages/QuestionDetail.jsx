import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { formatDistanceToNow } from "date-fns";
import { Eye, Clock, CheckCircle, Plus } from "lucide-react";
import VotingButtons from "../components/Votings/VotingButtons";
import RichTextEditor from "../components/Editor/RichTextEditor";
import { useAuth } from "../contexts/AuthContext";

const QuestionDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [newAnswer, setNewAnswer] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Mock data - in a real app, this would be fetched based on the ID
  const question = {
    id: "1",
    title: "How to center a div in CSS?",
    description: `<p>I have been trying to center a div element both horizontally and vertically, but I can't seem to get it right. I've tried using flexbox and grid but nothing works as expected.</p>

<p>Here's my current CSS:</p>

<pre><code>.container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.centered-div {
  width: 200px;
  height: 100px;
  background-color: blue;
}</code></pre>

<p>The div appears centered horizontally but not vertically. What am I missing?</p>`,
    author: {
      username: "webdev_starter",
      avatar:
        "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2",
      reputation: 234,
    },
    tags: ["css", "flexbox", "layout"],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    views: 1205,
    votes: 15,
    isBookmarked: false,
  };

  const answers = [
    {
      id: "1",
      content: `<p>The issue is that your container probably doesn't have a defined height. For flexbox centering to work vertically, the container needs to have a height.</p>

<p>Try adding:</p>

<pre><code>.container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh; /* This is what you're missing */
}</code></pre>

<p>The <code>min-height: 100vh</code> ensures your container takes up at least the full viewport height, giving flexbox something to center against.</p>`,
      author: {
        username: "css_expert",
        avatar:
          "https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2",
        reputation: 1520,
      },
      createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
      votes: 23,
      isAccepted: true,
    },
    {
      id: "2",
      content: `<p>Another approach is to use CSS Grid, which can be even simpler:</p>

<pre><code>.container {
  display: grid;
  place-items: center;
  min-height: 100vh;
}</code></pre>

<p>The <code>place-items: center</code> is shorthand for both <code>align-items: center</code> and <code>justify-items: center</code>.</p>`,
      author: {
        username: "grid_master",
        avatar:
          "https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&dpr=2",
        reputation: 890,
      },
      createdAt: new Date(Date.now() - 30 * 60 * 1000),
      votes: 12,
      isAccepted: false,
    },
  ];

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
                <span>
                  asked{" "}
                  {formatDistanceToNow(question.createdAt, { addSuffix: true })}
                </span>
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
