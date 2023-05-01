/**
 * @brief 최소/최대 숫자 범위에 포함되는 랜덤 숫자를 반환하는 함수
 * @param min 원하는 랜덤 숫자의 최솟값
 * @param max 원하는 랜덤 숫자의 최댓값
 * @returns min, max 사이의 랜덤 숫자
 */
export const randomIntFromInterval = (min: number, max: number): number => {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
};
