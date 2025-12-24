/**
 * Carousel Tabs 초기화 함수
 * Swiper를 사용한 가로 스크롤 가능한 탭 컴포넌트
 */
const initCarouselTabs = (containerId, options = {}) => {
  const tabsContainer = document.getElementById(containerId)
  if (!tabsContainer) return

  const swiperElement = tabsContainer.querySelector('.tabs-carousel__swiper')
  if (!swiperElement) return

  const tabSize = options.size || 'P2'
  const tabItems = tabsContainer.querySelectorAll('.tabs-carousel__item')
  let swiperInstance = null

  // Swiper 초기화
  const initSwiper = () => {
    // 이미 초기화된 Swiper가 있으면 제거
    if (swiperElement.swiper) {
      swiperElement.swiper.destroy(true, true)
    }

    swiperInstance = new Swiper(swiperElement, {
      slidesPerView: 'auto',
      freeMode: true,
      resistance: true,
      resistanceRatio: 0,
      touchRatio: 1,
      touchAngle: 45,
      threshold: 5
    })

    return swiperInstance
  }

  // 활성 탭 업데이트 함수
  const updateActiveTab = (activeItem) => {
    tabItems.forEach((item) => {
      const button = item.querySelector('.tabs-carousel__button')
      const activeBar = item.querySelector('.tabs-carousel__active-bar')
      const isActive = item === activeItem

      item.setAttribute('data-active', isActive)

      if (isActive) {
        button.classList.add('tabs-carousel__button--active')
        if (tabSize === 'H4') {
          button.classList.remove('tabs-carousel__button--p2')
          button.classList.add('tabs-carousel__button--h4')
        } else {
          button.classList.remove('tabs-carousel__button--h4')
          button.classList.add('tabs-carousel__button--p2')
        }

        if (!activeBar) {
          const bar = document.createElement('div')
          bar.className = 'tabs-carousel__active-bar'
          item.appendChild(bar)
        }
      } else {
        button.classList.remove('tabs-carousel__button--active')
        if (tabSize === 'H4') {
          button.classList.remove('tabs-carousel__button--p2')
          button.classList.add('tabs-carousel__button--h4')
        } else {
          button.classList.remove('tabs-carousel__button--h4')
          button.classList.add('tabs-carousel__button--p2')
        }

        if (activeBar) {
          activeBar.remove()
        }
      }
    })
  }

  // 드래그 감지 변수
  let isDragging = false
  let startX = 0
  let startY = 0

  // 탭 클릭 이벤트
  tabItems.forEach((tabItem) => {
    // 마우스 이벤트
    tabItem.addEventListener('mousedown', (e) => {
      startX = e.clientX
      startY = e.clientY
      isDragging = false
    })

    tabItem.addEventListener('mousemove', (e) => {
      if (startX !== 0 || startY !== 0) {
        const deltaX = Math.abs(e.clientX - startX)
        const deltaY = Math.abs(e.clientY - startY)
        if (deltaX > 5 || deltaY > 5) {
          isDragging = true
        }
      }
    })

    tabItem.addEventListener('mouseup', () => {
      if (!isDragging) {
        updateActiveTab(tabItem)
      }
      startX = 0
      startY = 0
      isDragging = false
    })

    // 터치 이벤트
    tabItem.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
      isDragging = false
    })

    tabItem.addEventListener('touchmove', (e) => {
      if (startX !== 0 || startY !== 0) {
        const deltaX = Math.abs(e.touches[0].clientX - startX)
        const deltaY = Math.abs(e.touches[0].clientY - startY)
        if (deltaX > 5 || deltaY > 5) {
          isDragging = true
        }
      }
    })

    tabItem.addEventListener('touchend', () => {
      if (!isDragging) {
        updateActiveTab(tabItem)
      }
      startX = 0
      startY = 0
      isDragging = false
    })
  })

  // Swiper 초기화
  if (typeof Swiper !== 'undefined') {
    initSwiper()

    // 다이얼로그가 열릴 때도 초기화
    const dialog = tabsContainer.closest('dialog')
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
    updateActiveTab
  }
}

// 자동 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initCarouselTabs('tabs-carousel-example')
  })
} else {
  initCarouselTabs('tabs-carousel-example')
}

// 전역으로 노출
window.initCarouselTabs = initCarouselTabs

