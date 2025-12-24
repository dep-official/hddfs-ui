/**
 * Add To Cart Dialog 초기화 함수
 * 다이얼로그 열기/닫기, 수량 조절, 장바구니 담기 기능을 관리합니다.
 *
 * @param {string|HTMLElement} dialogId - 다이얼로그 선택자 또는 요소
 * @param {Object} options - 설정 옵션
 * @param {Function} options.onAddToCart - 장바구니 담기 핸들러
 * @param {Function} options.onClose - 다이얼로그 닫기 핸들러
 * @param {number} options.min - 최소 수량 (기본값: 1)
 * @param {number} options.max - 최대 수량 (기본값: 10)
 * @param {number} options.quantity - 초기 수량 (기본값: 1)
 * @param {boolean} options.disabled - 비활성화 여부 (기본값: false)
 */
const initAddToCartDialog = (dialogId, options = {}) => {
  const dialog = typeof dialogId === 'string' ? document.querySelector(dialogId) : dialogId

  if (!dialog || dialog.tagName !== 'DIALOG') {
    console.warn('AddToCartDialog: dialog element not found')
    return null
  }

  const {
    onAddToCart = null,
    onClose = null,
    min = 1,
    max = 10,
    quantity: initialQuantity = 1,
    disabled = false,
  } = options

  // 수량 상태 관리
  let currentQuantity = Math.max(min, Math.min(max, initialQuantity))

  // 수량 표시 업데이트
  const updateQuantityDisplay = () => {
    const quantityValue = dialog.querySelector('.quantity-button__value')
    const decreaseButton = dialog.querySelector('.quantity-button__control--decrease')
    const increaseButton = dialog.querySelector('.quantity-button__control--increase')

    if (quantityValue) {
      quantityValue.textContent = currentQuantity
    }

    if (decreaseButton) {
      decreaseButton.disabled = currentQuantity <= min || disabled
    }

    if (increaseButton) {
      increaseButton.disabled = currentQuantity >= max || disabled
    }
  }

  // 수량 감소
  const decreaseQuantity = () => {
    if (currentQuantity > min && !disabled) {
      currentQuantity--
      updateQuantityDisplay()
    }
  }

  // 수량 증가
  const increaseQuantity = () => {
    if (currentQuantity < max && !disabled) {
      currentQuantity++
      updateQuantityDisplay()
    }
  }

  // 다이얼로그 열기
  const openDialog = () => {
    if (dialog && dialog.showModal) {
      dialog.showModal()
      updateQuantityDisplay()
      // 다이얼로그가 열릴 때마다 닫기 버튼 이벤트 리스너 재설정 (data-include로 동적 로드되는 경우 대비)
      setTimeout(() => {
        const closeButton = dialog.querySelector('.dialog__close[data-onclose="onClose"]')
        if (closeButton) {
          closeButton.removeEventListener('click', closeDialog)
          closeButton.addEventListener('click', closeDialog)
        }
      }, 50)
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

  // 장바구니 담기 핸들러
  const handleAddToCart = () => {
    if (disabled) return

    if (onAddToCart && typeof onAddToCart === 'function') {
      onAddToCart(currentQuantity)
    }

    // Toast 알림 표시
    if (window.showToast) {
      window.showToast('장바구니에 담겼습니다.', 3000)
      // Toast 표시 후 다이얼로그 닫기
      setTimeout(() => {
        closeDialog()
      }, 100)
    } else {
      // Toast가 없으면 바로 닫기
      closeDialog()
    }
  }

  // 이벤트 리스너 설정
  const setupEventListeners = () => {
    const decreaseButton = dialog.querySelector('.quantity-button__control--decrease')
    const increaseButton = dialog.querySelector('.quantity-button__control--increase')
    const addToCartButton = dialog.querySelector('[data-onclick="onAddToCart"]')
    const closeButton = dialog.querySelector('.dialog__close[data-onclose="onClose"]')

    if (decreaseButton) {
      decreaseButton.removeEventListener('click', decreaseQuantity)
      decreaseButton.addEventListener('click', decreaseQuantity)
    }

    if (increaseButton) {
      increaseButton.removeEventListener('click', increaseQuantity)
      increaseButton.addEventListener('click', increaseQuantity)
    }

    if (addToCartButton) {
      addToCartButton.removeEventListener('click', handleAddToCart)
      addToCartButton.addEventListener('click', handleAddToCart)
    }

    if (closeButton) {
      closeButton.removeEventListener('click', closeDialog)
      closeButton.addEventListener('click', closeDialog)
    }
  }

  // 초기 이벤트 리스너 설정
  setupEventListeners()

  // data-include 완료 후 다시 설정 (DialogHeader가 동적으로 로드되는 경우)
  setTimeout(() => {
    setupEventListeners()
  }, 100)

  // 배경 클릭 시 닫기 (선택적)
  dialog.addEventListener('click', e => {
    if (e.target === dialog) {
      closeDialog()
    }
  })

  // ESC 키로 닫기
  dialog.addEventListener('cancel', closeDialog)

  // 초기 수량 표시
  updateQuantityDisplay()

  return {
    dialog,
    open: openDialog,
    close: closeDialog,
    getQuantity: () => currentQuantity,
    setQuantity: qty => {
      currentQuantity = Math.max(min, Math.min(max, qty))
      updateQuantityDisplay()
    },
  }
}

// 자동 초기화 함수
const autoInitAddToCartDialog = () => {
  document.querySelectorAll('.add-to-cart-dialog:not([data-initialized])').forEach(el => {
    initAddToCartDialog(el)
    el.setAttribute('data-initialized', 'true')
  })
}

// 초기 실행
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoInitAddToCartDialog)
} else {
  autoInitAddToCartDialog()
}

// 전역으로 노출
window.initAddToCartDialog = initAddToCartDialog
window.autoInitAddToCartDialog = autoInitAddToCartDialog
