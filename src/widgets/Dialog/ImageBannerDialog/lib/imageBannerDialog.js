/**
 * Image Banner Dialog 초기화 함수
 * 다이얼로그 열기/닫기, 검색, 탭 기능을 관리합니다.
 *
 * @param {string|HTMLElement} dialogId - 다이얼로그 선택자 또는 요소
 * @param {Object} options - 설정 옵션
 * @param {Function} options.onClose - 다이얼로그 닫기 핸들러
 * @param {Function} options.onBack - 검색 뒤로가기 핸들러
 * @param {Function} options.onSearch - 검색 핸들러
 * @param {Function} options.onChange - 검색 입력 변경 핸들러
 */
const initImageBannerDialog = (dialogId, options = {}) => {
  const dialog = typeof dialogId === 'string'
    ? document.querySelector(dialogId)
    : dialogId

  if (!dialog || dialog.tagName !== 'DIALOG') {
    console.warn('ImageBannerDialog: dialog element not found')
    return null
  }

  const {
    onClose = null,
    onBack = null,
    onSearch = null,
    onChange = null,
  } = options

  // 다이얼로그 열기
  const openDialog = () => {
    if (dialog && dialog.showModal) {
      dialog.showModal()
    }
  }

  // 다이얼로그 닫기
  const closeDialog = () => {
    if (dialog && dialog.close) {
      dialog.close()
      if (onClose && typeof onClose === 'function') {
        onClose()
      }
    }
  }

  // 이벤트 리스너 설정
  const backButton = dialog.querySelector('[data-onback="onSearchBack"]')
  const searchButton = dialog.querySelector('[data-onsearch="onSearchClick"]')
  const searchInput = dialog.querySelector('[data-onchange="onSearchChange"]')

  if (backButton && onBack) {
    backButton.addEventListener('click', () => {
      if (typeof onBack === 'function') {
        onBack()
      }
    })
  }

  if (searchButton && onSearch) {
    searchButton.addEventListener('click', () => {
      if (typeof onSearch === 'function') {
        const input = dialog.querySelector('[data-onchange="onSearchChange"]')
        onSearch(input?.value || '')
      }
    })
  }

  if (searchInput && onChange) {
    searchInput.addEventListener('input', (e) => {
      if (typeof onChange === 'function') {
        onChange(e.target.value)
      }
    })
  }

  // 배경 클릭 시 닫기
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) {
      closeDialog()
    }
  })

  // ESC 키로 닫기
  dialog.addEventListener('cancel', closeDialog)

  return {
    dialog,
    open: openDialog,
    close: closeDialog,
  }
}

// 자동 초기화 함수
const autoInitImageBannerDialog = () => {
  document.querySelectorAll('.image-banner-dialog:not([data-initialized])').forEach((el) => {
    initImageBannerDialog(el)
    el.setAttribute('data-initialized', 'true')
  })
}

// 초기 실행
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoInitImageBannerDialog)
} else {
  autoInitImageBannerDialog()
}

// 전역으로 노출
window.initImageBannerDialog = initImageBannerDialog
window.autoInitImageBannerDialog = autoInitImageBannerDialog

