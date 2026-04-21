// Temporary local poll service for initial setup.
// Later you can move this to Firestore with a "polls" collection.

const pollStore = {};

/*
====================================
Create / Initialize Poll
====================================
*/
export const createPoll = async (articleId, options = []) => {
  if (!articleId) throw new Error("articleId is required");

  if (!pollStore[articleId]) {
    pollStore[articleId] = {
      articleId,
      options: options.map((option) => ({
        label: option,
        votes: 0,
      })),
      totalVotes: 0,
    };
  }

  return pollStore[articleId];
};

/*
====================================
Get Poll By Article
====================================
*/
export const fetchPollByArticle = async (articleId) => {
  return pollStore[articleId] || null;
};

/*
====================================
Vote On Poll
====================================
*/
export const voteOnPoll = async (articleId, selectedOption) => {
  const poll = pollStore[articleId];

  if (!poll) {
    throw new Error("Poll not found");
  }

  const option = poll.options.find(
    (item) => item.label === selectedOption
  );

  if (!option) {
    throw new Error("Invalid poll option");
  }

  option.votes += 1;
  poll.totalVotes += 1;

  return poll;
};

/*
====================================
Get Poll Results
====================================
*/
export const fetchPollResults = async (articleId) => {
  const poll = pollStore[articleId];

  if (!poll) return null;

  return {
    ...poll,
    options: poll.options.map((option) => ({
      ...option,
      percentage:
        poll.totalVotes > 0
          ? Math.round((option.votes / poll.totalVotes) * 100)
          : 0,
    })),
  };
};