export function calculatePrimes(limit: number): number[] {
  const primes: number[] = [];
  for (let i = 2; i <= limit; i++) {
    let isPrime = true;
    for (let j = 2; j * j <= i; j++) {
      if (i % j === 0) {
        isPrime = false;
        break;
      }
    }
    if (isPrime) primes.push(i);
  }
  return primes;
}

export function generateAndSortArray(size: number): number[] {
  const arr = Array.from({ length: size }, () =>
    Math.floor(Math.random() * size * 10)
  );
  return arr.sort((a, b) => a - b);
}
