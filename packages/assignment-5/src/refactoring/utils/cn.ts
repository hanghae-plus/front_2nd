/**
 * 주어진 클래스 이름들을 공백으로 구분하여 하나의 문자열로 결합합니다.
 *
 * @param {...string} classes - 결합할 클래스 이름들
 * @returns {string} 결합된 클래스 이름 문자열
 */
export function cn(...classes: (string | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}
