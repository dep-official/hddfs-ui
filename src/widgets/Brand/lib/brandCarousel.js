/**
 * Brand Carousel 초기화 함수
 * Swiper를 사용한 브랜드 캐러셀 컴포넌트
 */
const initBrandCarousel = (containerId, options = {}) => {
  const container = document.querySelector(containerId)
  if (!container) return

  const swiperElement = container.querySelector('.brand-carousel__swiper')
  const prevButton = container.querySelector('.brand-carousel__button--prev')
  const nextButton = container.querySelector('.brand-carousel__button--next')

  if (!swiperElement) return

  let swiperInstance = null

  // Swiper 초기화
  const initSwiper = () => {
    // 이미 초기화된 Swiper가 있으면 제거
    if (swiperElement.swiper) {
      swiperElement.swiper.destroy(true, true)
    }

    swiperInstance = new Swiper(swiperElement, {
      slidesPerView: 'auto',
      spaceBetween: 0,
      navigation: {
        nextEl: nextButton,
        prevEl: prevButton
      },
      breakpoints: {
        1024: {
          slidesPerView: 'auto',
          spaceBetween: 0
        }
      },
      on: {
        init: (swiper) => {
          updateButtonStates(swiper)
        },
        slideChange: (swiper) => {
          updateButtonStates(swiper)
        }
      }
    })

    return swiperInstance
  }

  // 버튼 상태 업데이트
  const updateButtonStates = (swiper) => {
    if (!swiper) return

    if (prevButton) {
      prevButton.disabled = swiper.isBeginning
    }
    if (nextButton) {
      nextButton.disabled = swiper.isEnd
    }
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
    swiper: swiperInstance
  }
}

// 자동 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initBrandCarousel('.brand-carousel')
  })
} else {
  initBrandCarousel('.brand-carousel')
}

// 전역으로 노출
window.initBrandCarousel = initBrandCarousel

