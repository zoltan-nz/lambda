export const stdDev = values => Math.sqrt(avg(sqrDiffs(values)));
export const standardDeviation = stdDev;

export const sqrDiffs = values => values.map(val => Math.pow(val - avg(values), 2));

export const avg = values => sum(values) / values.length;
export const average = avg;
export const mean = avg;

export const sum = values => values.reduce((sum, value) => sum + value, 0);

export const median = values => {
  if (!values.length) return 0;
  const numbers = values.slice(0).sort((a, b) => a - b);
  const middle = Math.floor(numbers.length / 2);
  const isEven = numbers.length % 2 === 0;
  return isEven ? (numbers[middle] + numbers[middle - 1]) / 2 : numbers[middle];
};