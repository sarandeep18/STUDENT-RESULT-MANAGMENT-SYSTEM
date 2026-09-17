// calculateResult.js
// Direct web equivalent of the "Calculate Result" module in your C++ menu,
// now handling 5 subjects instead of 3.

function calculateResult(subject1, subject2, subject3, subject4, subject5) {
  const total = subject1 + subject2 + subject3 + subject4 + subject5;
  const average = total / 5;
  const percentage = (total / 500) * 100; // assuming 100 marks per subject

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
