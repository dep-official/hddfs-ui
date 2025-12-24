;(function () {
  // 전역 z-index 카운터
  let toastZIndexCounter = 999999

  // Toast 생성 함수
  const createToast = (message, duration = 3000) => {
    const toastId = `toast_${Date.now()}_${Math.floor(Math.random() * 1000)}`
    const toast = document.createElement('div')
    toast.id = toastId
    toast.className = 'toast'
    toast.setAttribute('role', 'alert')
    toast.setAttribute('aria-live', 'polite')
    toast.style.display = 'none'
    toast.style.zIndex = ++toastZIndexCounter

    const messageEl = document.createElement('p')
    messageEl.className = 'toast__message'
    messageEl.textContent = message
    toast.appendChild(messageEl)

    document.body.appendChild(toast)

    return { toast, toastId }
  }

  // Toast 표시 함수
  const showToastElement = (toast) => {
    toast.style.display = 'flex'
    toast.classList.add('toast--show')
    toast.classList.remove('toast--hide')
  }

  // Toast 숨김 함수
  const hideToastElement = (toast) => {
    toast.classList.remove('toast--show')
    toast.classList.add('toast--hide')

    setTimeout(() => {
      toast.style.display = 'none'
      toast.remove()
    }, 300)
  }

  // Toast 표시 (간편 함수)
  const showToast = (message, duration = 3000) => {
    const { toast } = createToast(message, duration)
    showToastElement(toast)

    if (duration > 0) {
      setTimeout(() => {
        hideToastElement(toast)
      }, duration)
    }

    return toast
  }

  // 전역 함수로 노출
  window.showToast = showToast
})()
