import { toast } from 'react-toastify';

export const toPersianNumber = num => {
  const persianDigits = '۰۱۲۳۴۵۶۷۸۹';
  return num.toString().replace(/\d/g, digit => persianDigits[digit]);
};

export const scrollToTarget = (targetRef, headerHeight = 80) => {
  // Default headerHeight is 5rem (80px)
  if (targetRef.current) {
    const elementPosition =
      targetRef.current.getBoundingClientRect().top + window.scrollY;
    const offsetPosition = elementPosition - headerHeight;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth',
    });
  }
};

export function formatNumber(value) {
  let strValue = value.toString().replace(/,/g, '');

  let [integerPart, decimalPart] = strValue.split(',');

  let reversedInteger = integerPart.split('').reverse().join('');

  let formattedReversed = reversedInteger.replace(/(\d{3})(?=\d)/g, '$1,');

  let formattedInteger = formattedReversed.split('').reverse().join('');

  return decimalPart ? `${formattedInteger}.${decimalPart}` : formattedInteger;
}

export const notify = message =>
  toast(message, {
    style: { fontSize: '12px' },
  });
