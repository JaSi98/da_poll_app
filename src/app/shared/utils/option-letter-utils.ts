const FIRST_LETTER_CHAR_CODE = 'A'.charCodeAt(0);
const ALPHABET_LENGTH = 26;

/** Returns the option letter for a zero-based position: 0 → "A", 25 → "Z", 26 → "AA". */
export function getOptionLetter(index: number): string {
  let remainingPosition = index + 1;
  let letters = '';
  while (remainingPosition > 0) {
    const letterOffset = (remainingPosition - 1) % ALPHABET_LENGTH;
    letters = String.fromCharCode(FIRST_LETTER_CHAR_CODE + letterOffset) + letters;
    remainingPosition = Math.floor((remainingPosition - 1) / ALPHABET_LENGTH);
  }
  return letters;
}
