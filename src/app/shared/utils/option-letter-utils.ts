const FIRST_LETTER_CHAR_CODE = 'A'.charCodeAt(0);

/** Returns the option letter for a zero-based position, e.g. 0 → "A", 1 → "B". */
export function getOptionLetter(index: number): string {
  return String.fromCharCode(FIRST_LETTER_CHAR_CODE + index);
}
