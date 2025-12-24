/**
 * List Chunker 유틸리티
 * 배열을 지정된 크기의 청크로 나누는 함수
 * 
 * @param {Array} list - 청크로 나눌 배열
 * @param {number} chunkSize - 각 청크의 크기
 * @returns {Array<Array>} 청크로 나뉜 배열의 배열
 * 
 * @example
 * const list = [1, 2, 3, 4, 5, 6, 7, 8, 9];
 * const chunked = chunkList(list, 3);
 * // 결과: [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
 */
const chunkList = (list, chunkSize) => {
  if (!Array.isArray(list)) {
    console.warn('chunkList: list는 배열이어야 합니다.', list)
    return []
  }

  if (typeof chunkSize !== 'number' || chunkSize <= 0) {
    console.warn('chunkList: chunkSize는 0보다 큰 숫자여야 합니다.', chunkSize)
    return [list]
  }

  const chunks = []
  for (let i = 0; i < list.length; i += chunkSize) {
    chunks.push(list.slice(i, i + chunkSize))
  }

  return chunks
}

// 전역으로 노출
window.chunkList = chunkList

