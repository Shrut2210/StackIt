import React, { useState } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";

const VotingButtons = ({
  initialVotes,
  initialUserVote = null,
  onVote,
  className = "",
}) => {
  const [votes, setVotes] = useState(initialVotes);
  const [userVote, setUserVote] = useState(initialUserVote);

  const handleVote = (voteType) => {
    let newVotes = votes;
    let newUserVote = voteType;

    // Remove previous vote if exists
    if (userVote === "up") newVotes--;
    if (userVote === "down") newVotes++;

    // Apply new vote or remove if same
    if (voteType === userVote) {
      newUserVote = null;
    } else {
      if (voteType === "up") newVotes++;
      if (voteType === "down") newVotes--;
    }

    setVotes(newVotes);
    setUserVote(newUserVote);
    onVote?.(newUserVote);
  };

  return (
    <div className={`flex flex-col items-center space-y-1 ${className}`}>
      <button
        onClick={() => handleVote("up")}
        className={`p-1 rounded-md transition-colors ${
          userVote === "up"
            ? "text-orange-600 bg-orange-50"
            : "text-gray-400 hover:text-orange-600 hover:bg-orange-50"
        }`}
      >
        <ChevronUp className="w-6 h-6" strokeWidth={2} />
      </button>

      <span
        className={`text-lg font-medium ${
          userVote === "up"
            ? "text-orange-600"
            : userVote === "down"
            ? "text-blue-600"
            : "text-gray-900"
        }`}
      >
        {votes}
      </span>

      <button
        onClick={() => handleVote("down")}
        className={`p-1 rounded-md transition-colors ${
          userVote === "down"
            ? "text-blue-600 bg-blue-50"
            : "text-gray-400 hover:text-blue-600 hover:bg-blue-50"
        }`}
      >
        <ChevronDown className="w-6 h-6" strokeWidth={2} />
      </button>
    </div>
  );
};

export default VotingButtons;
