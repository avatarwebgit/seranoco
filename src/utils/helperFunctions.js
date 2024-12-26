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
