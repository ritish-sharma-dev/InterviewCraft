export const getDifficultyBadgeClass = (difficulty) => {
  switch (difficulty?.toLowerCase()) {
    case "easy":
      return "status-badge--success";
    case "medium":
      return "status-badge--warning";
    case "hard":
      return "status-badge--error";
    default:
      return "status-badge--neutral";
  }
};
