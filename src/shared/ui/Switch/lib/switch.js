// 순수 함수: 스위치 켜기
const turnOnSwitch = (switchEl, thumb) => {
  switchEl.classList.remove('switch--off')
  switchEl.classList.add('switch--on')
  switchEl.setAttribute('aria-checked', 'true')
  if (thumb) {
    thumb.style.transform = 'translateX(14px)'
  }
}

// 순수 함수: 스위치 끄기
const turnOffSwitch = (switchEl, thumb) => {
  switchEl.classList.remove('switch--on')
  switchEl.classList.add('switch--off')
  switchEl.setAttribute('aria-checked', 'false')
  if (thumb) {
    thumb.style.transform = 'translateX(0)'
  }
}

// 순수 함수: 스위치 토글
const toggleSwitchState = (switchEl, thumb) => {
  const isChecked = switchEl.getAttribute('aria-checked') === 'true'
  isChecked ? turnOffSwitch(switchEl, thumb) : turnOnSwitch(switchEl, thumb)
  return !isChecked
}

// onChange 핸들러 호출
const callChangeHandler = (switchEl, newValue) => {
  const handlerName = switchEl.getAttribute('data-onchange')
  if (handlerName && typeof window[handlerName] === 'function') {
    window[handlerName](newValue)
  }
}

// 스위치 초기화 함수
const initSwitch = (switchEl) => {
  if (!switchEl || switchEl.getAttribute('role') !== 'switch') return

  const thumb = switchEl.querySelector('.switch__thumb')
  const isDisabled = switchEl.hasAttribute('disabled')

  if (isDisabled) return

  const handleClick = (e) => {
    e.stopPropagation()
    const newValue = toggleSwitchState(switchEl, thumb)
    callChangeHandler(switchEl, newValue)
  }

  switchEl.addEventListener('click', handleClick)
}

// 자동 초기화 함수
const autoInitSwitch = () => {
  document.querySelectorAll('.switch').forEach(initSwitch)
}

// 자동 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoInitSwitch)
} else {
  autoInitSwitch()
}

// 전역으로 노출 (include.js에서 사용)
window.autoInitSwitch = autoInitSwitch

