export default function generateTimeline(article = {}) {
  if (Array.isArray(article.timeline) && article.timeline.length > 0) {
    return article.timeline.map((item, index) => ({
      id: item.id || index + 1,
      year: item.year || `Stage ${index + 1}`,
      title: item.title || "Timeline Event",
      description:
        item.description || "Detailed context for this timeline event.",
    }));
  }

  return [
    {
      id: 1,
      year: "Background",
      title: "Earlier Developments",
      description:
        "Important historical background and earlier developments connected to this story.",
    },
    {
      id: 2,
      year: "Current",
      title: article.title || "Current Situation",
      description:
        article.summary ||
        "The current situation and latest major development related to this topic.",
    },
    {
      id: 3,
      year: "Next",
      title: "Possible Future Outcome",
      description:
        "Potential next steps, likely outcomes, and future developments can be added here.",
    },
  ];
}