export function validateUserName(name) {
  if (!name) return false;
  const lengthOk = name.length <= 16 && name.length >= 5; 
  const noSpecialChars = /^[a-zA-Z0-9 ]+$/.test(name);
  return lengthOk && noSpecialChars;
}

export function validateEmail(mail) {
  if (!mail) return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(mail);
}

export function validatePhone(phone) {
  if (!phone) return false;
  const phoneRegex = /^[+\d][\d\s-]{6,15}$/;
  return phoneRegex.test(phone);
}

export function validatePassword(pass) {
  if (!pass) return false;
  const passwordRegex = /^(?=.*\d).{8,}$/;
  return passwordRegex.test(pass);
}

export function validateTerms() {
  const termsEl = document.getElementById('terminos') || document.querySelector('input[name="terminos"]');
  return !!(termsEl && termsEl.checked);
}