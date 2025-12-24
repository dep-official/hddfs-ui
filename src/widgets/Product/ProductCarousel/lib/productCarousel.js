/**
 * Product Carousel 초기화 함수
 * Swiper를 사용한 상품 카드 캐러셀 컴포넌트
 */

/**
 * 상품 데이터로부터 ProductCard HTML 생성
 */
const createProductCardHTML = (product) => {
  const discountHtml = product.discountRate && product.originalPrice
    ? `<div class="product-card__discount"><span class="product-card__discount-rate">${product.discountRate}</span><span class="product-card__original-price">${product.originalPrice}</span></div>`
    : ''

  return `
    <div class="product-card product-card--compact" data-sold-out="${product.soldOut || false}">
      <figure class="product-card__image">
        <img src="${product.image || '/images/products/product-1.png'}" alt="${product.name || '상품명'}" class="product-card__img" />
        <button type="button" class="product-card__cart-button" aria-label="장바구니 담기">
          <img src="/images/icons/ic-m-shoppinbag.svg" alt="" class="product-card__cart-icon" />
        </button>
      </figure>
      <div class="product-card__content">
        <dl class="product-card__info">
          <dt class="product-card__brand">${product.brand || '브랜드명'}</dt>
          <dd class="product-card__name">${product.name || '상품명입니다'}</dd>
        </dl>
        <div class="product-card__price">
          ${discountHtml}
          <div class="product-card__price-row">
            <span class="product-card__discount-price">${product.price || '$80'}</span>
          </div>
        </div>
      </div>
    </div>
  `
}

/**
 * Product Carousel 초기화
 * 
 * @param {string|HTMLElement} containerId - 컨테이너 선택자 또는 요소
 * @param {Object} options - 설정 옵션
 * @param {Array} options.products - 상품 배열 (선택사항)
 */
const initProductCarousel = (containerId, options = {}) => {
  const container = typeof containerId === 'string'
    ? document.querySelector(containerId)
    : containerId

  if (!container) return null

  const swiperElement = container.querySelector('.product-carousel__swiper')
  const wrapperElement = container.querySelector('.product-carousel__wrapper')
  const prevButton = container.querySelector('.product-carousel__button--prev')
  const nextButton = container.querySelector('.product-carousel__button--next')

  if (!swiperElement || !wrapperElement) return null

  const { products = null } = options

  // 상품 배열이 제공된 경우 동적으로 슬라이드 생성
  if (products && Array.isArray(products) && products.length > 0) {
    wrapperElement.innerHTML = ''

    products.forEach((product) => {
      const slide = document.createElement('li')
      slide.className = 'swiper-slide product-carousel__slide'
      slide.innerHTML = createProductCardHTML(product)
      wrapperElement.appendChild(slide)
    })
  }

  // Swiper 초기화
  if (typeof Swiper === 'undefined') {
    console.warn('Swiper library is not loaded')
    return null
  }

  return new Swiper(swiperElement, {
    slidesPerView: 3,
    spaceBetween: 16,
    freeMode: false,
    grabCursor: true,
    navigation: {
      nextEl: nextButton,
      prevEl: prevButton,
    },
    breakpoints: {
      1200: {
        slidesPerView: 3,
        spaceBetween: 24,
        freeMode: false,
      },
    },
  })
}

// 전역으로 노출
window.initProductCarousel = initProductCarousel

