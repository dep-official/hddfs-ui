/**
 * Product Grid Carousel 초기화 함수
 * Swiper를 사용한 상품 그리드 캐러셀 컴포넌트
 *
 * @param {string|HTMLElement} containerId - 컨테이너 선택자 또는 요소
 * @param {Object} options - 설정 옵션
 * @param {Array} options.products - 상품 배열 (선택사항)
 * @param {number} options.chunkSize - 각 슬라이드에 표시할 상품 수 (기본값: 6)
 */
const initProductGridCarousel = (containerId, options = {}) => {
  const container =
    typeof containerId === 'string' ? document.querySelector(containerId) : containerId

  if (!container) return

  const swiperElement = container.querySelector('.product-grid-carousel__swiper')
  const paginationElement = container.querySelector('.product-grid-carousel__pagination')
  const wrapperElement = container.querySelector('.product-grid-carousel__wrapper')

  if (!swiperElement) return

  const { products = null, chunkSize = 6 } = options
  let swiperInstance = null

  // products가 제공된 경우 동적으로 슬라이드 생성
  if (products && Array.isArray(products) && products.length > 0 && wrapperElement) {
    if (typeof window.chunkList === 'function') {
      const chunkedProducts = window.chunkList(products, chunkSize)

      // 기존 슬라이드 제거
      wrapperElement.innerHTML = ''

      // 청크별로 슬라이드 생성
      chunkedProducts.forEach(chunk => {
        const slide = document.createElement('li')
        slide.className = 'swiper-slide product-grid-carousel__slide'

        const grid = document.createElement('ul')
        grid.className = 'product-grid-carousel__grid'

        chunk.forEach(product => {
          const item = document.createElement('li')
          item.className = 'product-grid-carousel__item'

          // 가격 정리 (숫자만 추출)
          const cleanPrice = (product.price || product.discountPrice || '0')
            .toString()
            .replace(/^\$+/, '')
          const cleanOriginalPrice = (product.originalPrice || '').toString().replace(/^\$+/, '')

          // 할인율 계산 또는 사용
          let discountRate = product.discountRate
          if (!discountRate && cleanOriginalPrice && cleanPrice) {
            const original = parseFloat(cleanOriginalPrice)
            const discounted = parseFloat(cleanPrice)
            if (original > 0 && original > discounted) {
              discountRate = Math.round(((original - discounted) / original) * 100)
            }
          }

          // 할인율과 원가 표시
          const discountHtml =
            discountRate && cleanOriginalPrice
              ? `<div class="product-card__discount">
                  <span class="product-card__discount-rate">${discountRate}%</span>
                  <span class="product-card__original-price">$${cleanOriginalPrice}</span>
                </div>`
              : discountRate
              ? `<div class="product-card__discount">
                  <span class="product-card__discount-rate">${discountRate}%</span>
                </div>`
              : ''

          // 품절 상태에 따른 버튼
          const imageButtonHtml = product.soldOut
            ? `<button
                type="button"
                class="product-card__restock-button"
                aria-label="재입고 알림"
              >
                <span class="badge badge--restock">재입고 알림</span>
              </button>`
            : `<button
                type="button"
                class="product-card__cart-button"
                aria-label="장바구니 담기"
              >
                <img
                  src="/images/icons/ic-m-shoppinbag.svg"
                  alt=""
                  class="product-card__cart-icon"
                />
              </button>`

          item.innerHTML = `
            <div class="product-card product-card--compact" data-sold-out="${
              product.soldOut || false
            }">
              <figure class="product-card__image">
                <img
                  src="${product.image || product.imageUrl || '/images/products/product-1.png'}"
                  alt="${product.name || '상품명'}"
                  class="product-card__img"
                  loading="lazy"
                />
                ${imageButtonHtml}
              </figure>
              <div class="product-card__content">
                <dl class="product-card__info">
                  <dt class="product-card__brand">${product.brand || '브랜드명'}</dt>
                  <dd class="product-card__name">${product.name || '상품명입니다'}</dd>
                </dl>
                <div class="product-card__price">
                  ${discountHtml}
                  <div class="product-card__price-row">
                    <span class="product-card__discount-price">$${cleanPrice}</span>
                  </div>
                </div>
              </div>
            </div>
          `

          grid.appendChild(item)
        })

        slide.appendChild(grid)
        wrapperElement.appendChild(slide)
      })
    } else {
      console.warn('chunkList 함수를 사용할 수 없습니다. listChunker.js를 로드해주세요.')
    }
  }

  // Swiper 초기화
  const initSwiper = () => {
    // 이미 초기화된 Swiper가 있으면 제거
    if (swiperElement.swiper) {
      swiperElement.swiper.destroy(true, true)
    }

    swiperInstance = new Swiper(swiperElement, {
      slidesPerView: 1,
      spaceBetween: 0,
      pagination: {
        el: paginationElement,
        clickable: true,
        bulletClass: 'product-grid-carousel__bullet',
        bulletActiveClass: 'product-grid-carousel__bullet--active',
      },
    })

    return swiperInstance
  }

  // Swiper 초기화
  if (typeof Swiper !== 'undefined') {
    initSwiper()

    // 다이얼로그가 열릴 때도 초기화
    const dialog = container.closest('dialog')
    if (dialog) {
      const observer = new MutationObserver(() => {
        if (dialog.hasAttribute('open')) {
          setTimeout(() => {
            initSwiper()
          }, 100)
        }
      })
      observer.observe(dialog, { attributes: true, attributeFilter: ['open'] })
    }
  } else {
    console.warn('Swiper library is not loaded')
  }

  return {
    swiper: swiperInstance,
  }
}
// 자동 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initProductGridCarousel('.product-grid-carousel')
  })
} else {
  initProductGridCarousel('.product-grid-carousel')
}
// 전역으로 노출
window.initProductGridCarousel = initProductGridCarousel
