/**
 * HashTag Tabs 초기화 함수
 * 탭 클릭 시 활성 상태를 업데이트합니다.
 */
const initHashTagTabs = (containerId) => {
  const tabsContainer = document.getElementById(containerId)
  if (!tabsContainer) return

  const tabItems = tabsContainer.querySelectorAll('.hash-tag-tabs__item')

  // 활성 탭 업데이트 함수
  const updateActiveTab = (activeItem) => {
    tabItems.forEach((item) => {
      const button = item.querySelector('.hash-tag-btn')
      if (!button) return

      const isActive = item === activeItem

      item.setAttribute('data-active', isActive)

      if (isActive) {
        button.classList.remove('hash-tag-btn--inactive')
        button.classList.add('hash-tag-btn--active')
      } else {
        button.classList.remove('hash-tag-btn--active')
        button.classList.add('hash-tag-btn--inactive')
      }
    })
  }

  // 탭 클릭 이벤트
  tabItems.forEach((tabItem) => {
    tabItem.addEventListener('click', () => {
      updateActiveTab(tabItem)
    })
  })
}

// 자동 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    initHashTagTabs('hash-tag-tabs-example')
  })
} else {
  initHashTagTabs('hash-tag-tabs-example')
}

// 전역으로 노출
window.initHashTagTabs = initHashTagTabs

