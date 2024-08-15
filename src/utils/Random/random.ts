import { WeightedRandom } from "./weighted_randomizer";

/**
 * Random class
 * Encapsulates random number generation utilities.
 */
export class Random {
  // Private linear congruential generator (LCG) implementation
  private static readonly m = Math.pow(2, 32); // Modulus
  private static readonly a = 1664525; // Multiplier
  private static readonly c = 1013904223; // Increment
  private static seed = 0; // Seed value

  /**
   * Set the seed value for the random number generator.
   * @param value The seed value to set.
   */
  public static setSeed(value: number): void {
      this.seed = value;
  }

  /**
   * Generate a random integer between min (inclusive) and max (exclusive).
   * @param min The minimum value (inclusive).
   * @param max The maximum value (exclusive).
   * @returns A random integer within the specified range.
   */
  public static randomInt(min: number, max: number): number {
      this.seed = (this.a * this.seed + this.c) % this.m;
      return min + Math.floor((max - min) * (this.seed / this.m));
  }

  /**
   * Generate a random floating-point number between min (inclusive) and max (exclusive).
   * @param min The minimum value (inclusive).
   * @param max The maximum value (exclusive).
   * @returns A random floating-point number within the specified range.
   */
  public static randomFloat(min: number, max: number): number {
      this.seed = (this.a * this.seed + this.c) % this.m;
      return min + (max - min) * (this.seed / this.m);
  }

  /**
   * Generate a random boolean value with the specified probability of being true.
   * @param probability The probability of getting true (between 0 and 1).
   * @returns A random boolean value.
   */
  public static randomBool(probability: number): boolean {
      return this.randomFloat(0, 1) < probability;
  }

  /**
   * Shuffle an array in-place using the Fisher-Yates shuffle algorithm.
   * @param array The array to shuffle.
   */
  public static shuffle<T>(array: T[]): void {
      for (let i = array.length - 1; i > 0; i--) {
          const j = this.randomInt(0, i + 1);
          [array[i], array[j]] = [array[j], array[i]];
      }
  }

  /**
   * Select a random element from an array.
   * @param array The array to select from.
   * @returns A randomly selected element from the array.
   */
  public static sample<T>(array: T[]): T {
      return array[this.randomInt(0, array.length)];
  }

  /**
   * Generate a random permutation of an array.
   * @param array The array to generate a permutation for.
   * @returns A new array representing a random permutation of the input array.
   */
  public static permutation<T>(array: T[]): T[] {
      const result = [...array];
      this.shuffle(result);
      return result;
  }

  /**
   * Generate a random subset of an array with the specified size.
   * @param array The array to generate the subset from.
   * @param size The desired size of the subset.
   * @returns A new array representing a random subset of the input array.
   */
  public static subset<T>(array: T[], size: number): T[] {
      const result: T[] = [];
      const indices: number[] = [];
      for (let i = 0; i < array.length; i++) {
          indices.push(i);
      }
      this.shuffle(indices);
      for (let i = 0; i < size; i++) {
          result.push(array[indices[i]]);
      }
      return result;
  }

  /**
   * Create a WeightedRandom instance.
   * @returns A new instance of WeightedRandom.
   */
  public static weighted<T>(): WeightedRandom<T> {
      return new WeightedRandom<T>();
  }
}