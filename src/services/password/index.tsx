export const validatePassword = (password: string): boolean => {
  if (!password || password.trim() === '') {
    return false;
  }

  const characters = 'abcdefghijklmnopqrstuvwxyz';
  const lowercaseCharacters = characters.split('');
  const uppercaseCharacters = characters.toUpperCase().split('');
  const numbers = '1234567890'.split('');
  const special = '!@#$%^&*()_+`~[]{};:\\|\'",<.>/?'.split('');

  const passwordCharacters = password.split('');

  return (
    password.length >= 8 &&
    lowercaseCharacters.some(c => passwordCharacters.includes(c)) &&
    uppercaseCharacters.some(c => passwordCharacters.includes(c)) &&
    numbers.some(c => passwordCharacters.includes(c)) &&
    special.some(c => passwordCharacters.includes(c))
  );
};
