/**
 * Product Set Detail 초기화 함수
 * Swiper 캐러셀, 다이얼로그 연동, 장바구니 담기 기능을 관리합니다.
 *
 * @param {string|HTMLElement} containerId - 컨테이너 선택자 또는 요소
 * @param {Object} options - 설정 옵션
 * @param {string} options.swiperId - Swiper ID (기본값: 자동 생성)
 * @param {string} options.dialogId - Dialog ID (기본값: 자동 생성)
 */
const initProductSetDetail = (containerId, options = {}) => {
  const container =
    typeof containerId === 'string' ? document.querySelector(containerId) : containerId

  if (!container) return null

  const swiperId =
    options.swiperId ||
    container.querySelector('.product-set-detail__swiper')?.id ||
    'product-set-detail-swiper-demo'
  const dialogId = options.dialogId || 'add-to-cart-dialog-demo'

  // Swiper 초기화
  const initProductSetDetailSwiper = () => {
    const swiperElement = document.getElementById(swiperId)
    const paginationElement = swiperElement
      ?.closest('.product-set-detail__carousel')
      ?.querySelector('.product-set-detail__pagination')

    if (!swiperElement || !paginationElement) return null

    if (typeof Swiper === 'undefined') {
      console.warn('Swiper library is not loaded')
      return null
    }

    const swiper = new Swiper('#' + swiperId, {
      slidesPerView: 1,
      spaceBetween: 0,
      loop: false,
      pagination: {
        el: paginationElement,
        clickable: true,
        renderBullet: (index, className) => {
          return `<span class="${className}" style="width: 6px !important; height: 6px !important; opacity: 1 !important; border-radius: 50% !important; background-color: #EBEBEB !important;"></span>`
        },
      },
    })

    // 활성화된 인디케이터 스타일 적용
    swiper.on('slideChange', () => {
      const bullets = paginationElement.querySelectorAll('.swiper-pagination-bullet')
      bullets.forEach((bullet, index) => {
        if (index === swiper.activeIndex) {
          bullet.style.backgroundColor = '#1B1E23'
        } else {
          bullet.style.backgroundColor = '#EBEBEB'
        }
      })
    })

    // 초기 인디케이터 스타일 설정
    const initialBullets = paginationElement.querySelectorAll('.swiper-pagination-bullet')
    if (initialBullets.length > 0) {
      initialBullets[0].style.backgroundColor = '#1B1E23'
    }

    return swiper
  }

  // ProductSetThumbnailBar 클릭 핸들러 (다이얼로그 열기)
  const initProductSetClick = () => {
    const productSetDetail =
      typeof containerId === 'string' ? document.querySelector(containerId) : containerId

    if (!productSetDetail) return

    const thumbnailBar = productSetDetail.querySelector(
      '.product-set-thumbnail-bar[data-onclick="onProductSetClick"]'
    )
    if (!thumbnailBar) return

    thumbnailBar.addEventListener('click', () => {
      // 다이얼로그 찾기 (컨테이너 내부 또는 전역)
      let dialog = productSetDetail.querySelector('.add-to-cart-dialog')
      if (!dialog) {
        dialog = document.getElementById(dialogId)
      }
      if (!dialog) {
        // data-include로 로드된 경우를 대비해 다시 찾기
        dialog = document.querySelector('.add-to-cart-dialog')
      }

      if (dialog && dialog.showModal) {
        dialog.showModal()
        // 다이얼로그 초기화 (아직 초기화되지 않은 경우)
        if (window.initAddToCartDialog && !dialog.hasAttribute('data-initialized')) {
          window.initAddToCartDialog(dialog)
        }
      } else {
        console.warn('AddToCartDialog not found or showModal not supported')
      }
    })
  }

  // ProductPriceCartBar 장바구니 담기 핸들러
  const initAddToCart = () => {
    const productSetDetail =
      typeof containerId === 'string' ? document.querySelector(containerId) : containerId

    if (!productSetDetail) return

    const addToCartButton = productSetDetail.querySelector(
      '.product-price-cart-bar__button[data-onclick="onAddToCart"]'
    )
    if (!addToCartButton) return

    addToCartButton.addEventListener('click', () => {
      // Toast 알림 표시
      if (window.showToast) {
        window.showToast('장바구니에 담겼습니다.', 3000)
      }
    })
  }

  // 초기화 실행
  const swiper = initProductSetDetailSwiper()
  initProductSetClick()
  initAddToCart()

  return {
    swiper,
    container,
  }
}

// 자동 초기화 함수
const autoInitProductSetDetail = () => {
  document.querySelectorAll('.product-set-detail:not([data-initialized])').forEach(el => {
    // Swiper가 로드되었는지 확인
    if (typeof Swiper === 'undefined') {
      console.warn('Swiper library is not loaded, retrying...')
      // Swiper가 로드될 때까지 대기
      const checkSwiper = setInterval(() => {
        if (typeof Swiper !== 'undefined') {
          clearInterval(checkSwiper)
          initProductSetDetail(el)
          el.setAttribute('data-initialized', 'true')
        }
      }, 100)
      // 최대 5초 대기
      setTimeout(() => {
        clearInterval(checkSwiper)
      }, 5000)
      return
    }
    initProductSetDetail(el)
    el.setAttribute('data-initialized', 'true')
  })
}

// 초기 실행
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoInitProductSetDetail)
} else {
  autoInitProductSetDetail()
}

// 전역으로 노출
window.initProductSetDetail = initProductSetDetail
window.autoInitProductSetDetail = autoInitProductSetDetail
