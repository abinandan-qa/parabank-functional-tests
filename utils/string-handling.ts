export function getValueWithoutSpecialCharacters(value) {
  const match = value.match(/\d+/);
  if (match) {
    return match[0];
  } else {
    return;
  }
}
