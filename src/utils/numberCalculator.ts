// src/utils/numberCalculator.ts
const MASTER_NUMBERS = new Set([11, 22, 28, 33]);

export function computeLifePathNumber(birthDate: string): number {
  const date = new Date(birthDate);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear().toString();

  const digits = month.split("").concat(day.split("")).concat(year.split(""));

  const initialSum = digits.reduce((sum, digit) => sum + parseInt(digit), 0);

  if (MASTER_NUMBERS.has(initialSum)) {
    return initialSum;
  }

  let finalSum = initialSum;
  if (finalSum > 9) {
    finalSum = sumDigits(finalSum);
    if (MASTER_NUMBERS.has(finalSum)) {
      return finalSum;
    }
    while (finalSum > 9 && !MASTER_NUMBERS.has(finalSum)) {
      finalSum = sumDigits(finalSum);
    }
  }

  return finalSum;
}

function sumDigits(number: number): number {
  return number
    .toString()
    .split("")
    .reduce((sum, digit) => sum + parseInt(digit), 0);
}
