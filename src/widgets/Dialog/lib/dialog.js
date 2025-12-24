/**
 * Dialog 초기화 함수
 * 다이얼로그 열기/닫기 기능을 관리합니다.
 *
 * @param {string|HTMLElement} dialogId - 다이얼로그 선택자 또는 요소
 * @param {Object} options - 설정 옵션
 * @param {Function} options.onClose - 다이얼로그 닫기 핸들러
 */
const initDialog = (dialogId, options = {}) => {
  const dialog = typeof dialogId === 'string'
    ? document.querySelector(dialogId)
    : dialogId

  if (!dialog || dialog.tagName !== 'DIALOG') {
    console.warn('Dialog: dialog element not found')
    return null
  }

  const { onClose = null } = options

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
  const closeButton = dialog.querySelector('.dialog__close[data-onclose="onClose"]')
  const cancelButton = dialog.querySelector('.dialog__action-button--cancel[data-onclick="onCancel"]')
  const confirmButton = dialog.querySelector('.dialog__action-button--confirm[data-onclick="onConfirm"]')

  if (closeButton) {
    closeButton.addEventListener('click', closeDialog)
  }

  if (cancelButton) {
    cancelButton.addEventListener('click', closeDialog)
  }

  if (confirmButton) {
    confirmButton.addEventListener('click', () => {
      closeDialog()
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
const autoInitDialog = () => {
  document.querySelectorAll('.dialog:not([data-initialized])').forEach((el) => {
    initDialog(el)
    el.setAttribute('data-initialized', 'true')
  })
}

// 초기 실행
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoInitDialog)
} else {
  autoInitDialog()
}

// 전역으로 노출
window.initDialog = initDialog
window.autoInitDialog = autoInitDialog

