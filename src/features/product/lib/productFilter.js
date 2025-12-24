/**
 * 상품 필터링 로직
 * @param {string} filterId - 필터 컴포넌트의 고유 ID
 * @param {string} containerId - 상품 리스트 컨테이너 ID
 * @param {string} countElementId - 건수 표시 요소 ID
 */
const createProductFilter = (filterId, containerId, countElementId) => {
  return (showSoldOut) => {
    const countElement = document.getElementById(countElementId)
    const allProductsContainer = document.getElementById(containerId)

    if (!allProductsContainer) return

    const productCards = allProductsContainer.querySelectorAll('.product-card-item')
    let visibleCount = 0

    productCards.forEach((card) => {
      const isSoldOut = card.getAttribute('data-sold-out') === 'true'

      // "품절 상품 보기"가 꺼져있고(false), 상품이 품절(true)이면 숨김
      if (!showSoldOut && isSoldOut) {
        card.style.display = 'none'
      } else {
        card.style.display = 'flex' // flex flex-col 이므로
        visibleCount++
      }
    })

    // 건수 업데이트
    if (countElement) {
      countElement.textContent = new Intl.NumberFormat().format(visibleCount) + '건'
    }
  }
}

// 전역 함수로 노출
window.createProductFilter = createProductFilter

