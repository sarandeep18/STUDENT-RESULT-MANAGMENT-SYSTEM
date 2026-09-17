// calculateResult.js
// This is the direct web equivalent of the "Calculate Result" module in
// your C++ menu (total, average, percentage, grade). Keeping it in its own
// function means every route that needs it (add, update) calls the same
// logic instead of repeating it — good practice to mention in your review.

function calculateResult(subject1, subject2, subject3) {
  const total = subject1 + subject2 + subject3;
  const average = total / 3;
  const percentage = (total / 300) * 100; // assuming 100 marks per subject

  let grade;
  if (percentage >= 90) grade = 'A+';
  else if (percentage >= 80) grade = 'A';
  else if (percentage >= 70) grade = 'B';
  else if (percentage >= 60) grade = 'C';
  else if (percentage >= 40) grade = 'D';
  else grade = 'F';

  return { total, average, percentage, grade };
}

module.exports = calculateResult;
