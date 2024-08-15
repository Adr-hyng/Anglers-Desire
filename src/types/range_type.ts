/**
 * Generates a tuple of numbers from 0 up to N (inclusive).
 * 
 * @template N - The upper limit (inclusive) for the range of numbers.
 * @template Result - Accumulated result array, used internally for recursion.
 */
type RangeUpTo<N extends number, Result extends number[] = []> =
  Result['length'] extends N ? Result[number] : RangeUpTo<N, [...Result, Result['length']]>;

/**
 * Constructs a type representing a range of numbers starting from Start to End (inclusive).
 * 
 * @template Start - The start of the range (inclusive).
 * @template End - The end of the range (inclusive).
 * @example const c: RangeInternal<1, 31> = 1; // Valid
 */
export type RangeInternal<Start extends number, End extends number> =
  Exclude<RangeUpTo<End>, RangeUpTo<Start>>;

/**
 * Interface defining a bounded range with minimum and maximum values,
 * enforcing numeric literal types for min and max.
 */
export interface IBoundedRange<T extends number, U extends number> {
  min: T;
  max: U;
}

export type UniformRange = {
  min: number,
  max: number,
}

/**
 * Type utility to handle different forms of range specifications,
 * supporting both tuple-based ranges, object-based bounded ranges, and direct ranges.
 * 
 * @example demonstrating tuple-based range specification:
 * 
 * const a: Ranges<[1, 31]> = 1; // Valid
 * const t: IBoundedRange<1, 25> = null;
 * const b: Ranges<typeof t> = 1; // Valid, as 31 is part of the inclusive range
 */
export type GenericRange<T> =
  T extends [infer Start extends number, infer End extends number] ? RangeInternal<Start, End> :
  T extends IBoundedRange<infer Start extends number, infer End extends number> ? RangeInternal<Start, End> :
  never;