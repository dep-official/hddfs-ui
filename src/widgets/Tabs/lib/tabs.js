/**
 * 탭 스크롤 핸들러
 * 탭 클릭 시 섹션으로 스크롤하고, 스크롤 위치에 따라 탭 활성화 상태를 업데이트합니다.
 */
const TabScrollHandler = options => {
  const tabsContainerId = options.tabsContainerId
  const sections = options.sections || {}
  const tabBarHeight = options.tabBarHeight || 56

  const tabsContainer = document.getElementById(tabsContainerId)
  if (!tabsContainer) return

  // .tabs 요소 찾기 (tabsContainer가 .tabs이거나 그 안에 있을 수 있음)
  const tabsElement = tabsContainer.classList.contains('tabs')
    ? tabsContainer
    : tabsContainer.querySelector('.tabs')

  if (!tabsElement) return

  const tabs = tabsElement.querySelectorAll('.tabs__item')
  const sectionElements = {}

  // 섹션 ID를 실제 DOM 요소로 변환
  Object.keys(sections).forEach(key => {
    const sectionId = sections[key]
    sectionElements[key] = document.getElementById(sectionId)
  })

  let isScrolling = false
  let clickedTabIndex = null
  let scrollDebounceTimer = null
  let lastScrollTop = 0
  let activeBar = null

  // 활성화 바 초기화
  const initActiveBar = () => {
    if (!tabsElement) return

    if (!tabsElement.querySelector('.tabs__active-bar')) {
      activeBar = document.createElement('div')
      activeBar.className = 'tabs__active-bar'
      tabsElement.style.position = 'relative'
      tabsElement.appendChild(activeBar)
    } else {
      activeBar = tabsElement.querySelector('.tabs__active-bar')
    }

    // 초기 위치를 "행사" 탭(인덱스 0)에 즉시 설정 (애니메이션 없이)
    if (activeBar && tabs.length > 0) {
      // transition을 일시적으로 비활성화하여 초기 위치 설정
      const originalTransition = activeBar.style.transition
      activeBar.style.transition = 'none'

      const firstTab = tabs[0]
      if (firstTab) {
        const tabRect = firstTab.getBoundingClientRect()
        const containerRect = tabsElement.getBoundingClientRect()
        const left = tabRect.left - containerRect.left
        const width = tabRect.width

        activeBar.style.left = `${left}px`
        activeBar.style.width = `${width}px`
        activeBar.style.opacity = '1'
      }

      // 다음 프레임에서 transition 다시 활성화
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          activeBar.style.transition = originalTransition || ''
        })
      })
    }
  }

  // 활성화 바 위치 업데이트
  const updateActiveBarPosition = activeIndex => {
    if (!activeBar || !tabs[activeIndex] || !tabsElement) return

    const activeTab = tabs[activeIndex]
    const tabRect = activeTab.getBoundingClientRect()
    const containerRect = tabsElement.getBoundingClientRect()

    const left = tabRect.left - containerRect.left
    const width = tabRect.width

    activeBar.style.left = `${left}px`
    activeBar.style.width = `${width}px`
    activeBar.style.bottom = '0px'
    activeBar.style.opacity = '1'
  }

  // 활성 탭 업데이트
  const updateActiveTab = () => {
    // 프로그래밍 방식 스크롤 중에는 업데이트하지 않음
    if (isScrolling && clickedTabIndex !== null) {
      return
    }

    // sections가 없으면 스크롤 기반 업데이트 건너뛰기
    if (Object.keys(sectionElements).length === 0) {
      return
    }

    const viewportHeight = window.innerHeight
    let bestMatch = 0
    let bestScore = -1

    Object.keys(sectionElements).forEach(key => {
      const section = sectionElements[key]
      if (section) {
        const rect = section.getBoundingClientRect()
        const sectionTop = rect.top
        const sectionBottom = rect.bottom

        if (sectionTop <= tabBarHeight + 100 && sectionBottom > tabBarHeight) {
          const visibleTop = Math.max(tabBarHeight, sectionTop)
          const visibleBottom = Math.min(viewportHeight, sectionBottom)
          const visibleArea = Math.max(0, visibleBottom - visibleTop)

          if (visibleArea > bestScore) {
            bestScore = visibleArea
            bestMatch = parseInt(key)
          }
        }
      }
    })

    if (bestScore > 0) {
      const activeIndex = bestMatch

      // 탭 활성화 상태 업데이트
      tabs.forEach((tab, index) => {
        const button = tab.querySelector('.tabs__button')
        const isActive = index === activeIndex

        tab.setAttribute('data-active', isActive)
        tab.classList.toggle('tabs__item--active', isActive)
        if (button) {
          button.classList.toggle('tabs__button--active', isActive)
        }
      })

      // 활성화 바 위치 업데이트
      if (!isScrolling || clickedTabIndex === null) {
        updateActiveBarPosition(activeIndex)
      }
    }
  }

  // 탭 클릭 핸들러
  const handleTabClick = (tab, index) => {
    clickedTabIndex = index

    // 활성화 바 위치 즉시 업데이트
    updateActiveBarPosition(index)

    // 탭 활성화 상태 즉시 업데이트
    tabs.forEach((t, i) => {
      const isActive = i === index
      t.setAttribute('data-active', isActive)
      t.classList.toggle('tabs__item--active', isActive)
      const btn = t.querySelector('.tabs__button')
      if (btn) {
        btn.classList.toggle('tabs__button--active', isActive)
      }
    })

    // sections가 있으면 스크롤 기능 사용
    const section = sectionElements[index]
    if (section) {
      isScrolling = true
      const sectionTop = section.offsetTop - tabBarHeight

      // 기존 디바운스 타이머 취소
      if (scrollDebounceTimer) {
        clearTimeout(scrollDebounceTimer)
      }

      window.scrollTo({
        top: sectionTop,
        behavior: 'smooth',
      })

      // 스크롤 완료 감지
      const checkScrollComplete = () => {
        const currentScrollTop = window.scrollY || window.pageYOffset

        if (Math.abs(currentScrollTop - lastScrollTop) < 1) {
          isScrolling = false
          clickedTabIndex = null
          lastScrollTop = currentScrollTop
          updateActiveTab()
        } else {
          lastScrollTop = currentScrollTop
          scrollDebounceTimer = setTimeout(checkScrollComplete, 100)
        }
      }

      setTimeout(() => {
        lastScrollTop = window.scrollY || window.pageYOffset
        scrollDebounceTimer = setTimeout(checkScrollComplete, 150)
      }, 500)
    } else {
      // sections가 없으면 스크롤 없이 탭 활성화만 처리
      clickedTabIndex = null
    }
  }

  // 이벤트 리스너 초기화
  const initEventListeners = () => {
    // 탭 클릭 이벤트
    tabs.forEach((tab, index) => {
      const button = tab.querySelector('.tabs__button')
      if (button) {
        button.addEventListener('click', e => {
          e.preventDefault()
          e.stopPropagation()
          handleTabClick(tab, index)
        })
      } else {
        tab.addEventListener('click', e => {
          e.preventDefault()
          handleTabClick(tab, index)
        })
      }
    })

    // 스크롤 이벤트 (sections가 있을 때만)
    if (Object.keys(sectionElements).length > 0) {
      let ticking = false
      window.addEventListener('scroll', () => {
        if (isScrolling && clickedTabIndex !== null) {
          return
        }

        if (!ticking) {
          window.requestAnimationFrame(() => {
            updateActiveTab()
            ticking = false
          })
          ticking = true
        }
      })
    }

    // 리사이즈 이벤트
    let resizeTicking = false
    window.addEventListener('resize', () => {
      if (!resizeTicking) {
        window.requestAnimationFrame(() => {
          const currentActiveIndex = Array.from(tabs).findIndex(
            tab => tab.getAttribute('data-active') === 'true'
          )
          if (currentActiveIndex !== -1) {
            updateActiveBarPosition(currentActiveIndex)
          }
          resizeTicking = false
        })
        resizeTicking = true
      }
    })
  }

  // 초기화
  initActiveBar()
  initEventListeners()

  // 초기 활성화 바 위치를 "행사" 탭(인덱스 0)에 즉시 설정 (애니메이션 없이)
  const setInitialActiveBarPosition = () => {
    if (activeBar && tabs.length > 0) {
      // transition을 일시적으로 비활성화하여 초기 위치 설정
      const originalTransition = activeBar.style.transition
      activeBar.style.transition = 'none'

      const firstTab = tabs[0]
      if (firstTab) {
        const tabRect = firstTab.getBoundingClientRect()
        const containerRect = tabsElement.getBoundingClientRect()
        const left = tabRect.left - containerRect.left
        const width = tabRect.width

        activeBar.style.left = `${left}px`
        activeBar.style.width = `${width}px`
        activeBar.style.opacity = '1'
      }

      // 다음 프레임에서 transition 다시 활성화
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          activeBar.style.transition = originalTransition || ''
        })
      })
    }
  }

  // 초기 위치 즉시 설정
  setInitialActiveBarPosition()

  // 초기 탭 활성화 상태 설정
  if (Object.keys(sectionElements).length > 0) {
    // 약간의 지연을 두어 DOM이 완전히 렌더링된 후 업데이트
    setTimeout(() => {
      updateActiveTab()
    }, 50)
  } else {
    // sections가 없으면 첫 번째 활성 탭 찾아서 활성화 바 위치 설정
    setTimeout(() => {
      const initialActiveIndex = Array.from(tabs).findIndex(
        tab => tab.getAttribute('data-active') === 'true'
      )
      if (initialActiveIndex !== -1) {
        updateActiveBarPosition(initialActiveIndex)
      } else {
        // 활성 탭이 없으면 첫 번째 탭(인덱스 0, "행사")에 위치
        updateActiveBarPosition(0)
      }
    }, 50)
  }
}

// 전역으로 노출
window.TabScrollHandler = TabScrollHandler

// 자동 초기화 함수
const autoInitTabs = () => {
  const tabsContainer = document.getElementById('tabs-example')
  if (!tabsContainer) {
    console.warn('Tabs: tabs-example element not found')
    return
  }

  // 이미 초기화되었는지 확인
  if (tabsContainer.hasAttribute('data-tabs-initialized')) {
    return
  }

  TabScrollHandler({
    tabsContainerId: 'tabs-example',
    sections: {
      0: 'section-event',
      1: 'section-recommended',
      2: 'section-all',
    },
    tabBarHeight: 56,
  })

  // 초기화 완료 표시
  tabsContainer.setAttribute('data-tabs-initialized', 'true')
}

// 전역으로 노출 (include.js에서 사용)
window.autoInitTabs = autoInitTabs

// 자동 초기화 (기존 방식 유지)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    // 약간의 지연을 두어 include가 완료될 시간을 줌
    setTimeout(() => {
      autoInitTabs()
    }, 100)
  })
} else {
  setTimeout(() => {
    autoInitTabs()
  }, 100)
}
