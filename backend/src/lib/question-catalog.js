export const INTERVIEW_QUESTIONS = {
    'two-sum': { title: 'Two Sum', difficulty: 'easy' },
    'reverse-string': { title: 'Reverse String', difficulty: 'easy' },
    'valid-palindrome': { title: 'Valid Palindrome', difficulty: 'easy' },
    'maximum-subarray': { title: 'Maximum Subarray', difficulty: 'medium' },
    'container-with-most-water': { title: 'Container With Most Water', difficulty: 'medium' },
};

export function getInterviewQuestion(questionId) {
    return INTERVIEW_QUESTIONS[questionId] || null;
}

export function getInterviewQuestionByTitle(title) {
    const entry = Object.entries(INTERVIEW_QUESTIONS).find(([, question]) => question.title === title);
    return entry ? { id: entry[0], ...entry[1] } : null;
}
