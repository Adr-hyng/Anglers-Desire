export class RomanNumericConverter {
  static toRoman(num: number): string {
    if (num < 1 || num > 10) throw new Error('Input must be between 1 and 10');
    const romanNumerals: { [key: number]: string } = {
      1: 'I',
      2: 'II',
      3: 'III',
      4: 'IV',
      5: 'V',
    };
    return romanNumerals[num];
  }
  
  static toNumeric(roman: string): number {
    const romanNumerals: { [key: string]: number } = {
      'I': 1,
      'II': 2,
      'III': 3,
      'IV': 4,
      'V': 5,
    };
  
    const numericValue = romanNumerals[roman.toUpperCase()];
    if (numericValue === undefined) {
      throw new Error('Input must be a valid Roman numeral between I and X');
    }
  
    return numericValue;
  }
}