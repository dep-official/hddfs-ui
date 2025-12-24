// 순수 함수: 드롭다운 열기
const openDropdown = (menu, button) => {
  menu.classList.add('dropdown__menu--open')
  button.setAttribute('aria-expanded', 'true')
}

// 순수 함수: 드롭다운 닫기
const closeDropdown = (menu, button) => {
  menu.classList.remove('dropdown__menu--open')
  button.setAttribute('aria-expanded', 'false')
}

// 순수 함수: 옵션 선택 처리
const selectOption = (opt, options, valueEl, handlerName) => {
  const val = opt.getAttribute('data-option-value') || opt.textContent.trim()
  
  if (valueEl) valueEl.textContent = val
  
  options.forEach((o) => {
    o.classList.toggle('dropdown__option--selected', o === opt)
  })
  
  if (handlerName && typeof window[handlerName] === 'function') {
    window[handlerName](val)
  }
}

// 드롭다운 초기화 함수
const initDropdown = (root) => {
  const button = root.querySelector('[data-dropdown-id]')
  const menu = root.querySelector('[data-dropdown-menu]')
  const valueEl = root.querySelector('[data-dropdown-value]')
  const options = root.querySelectorAll('.dropdown__option')

  if (!button || !menu || !options.length) return

  let isOpen = false

  const toggle = () => {
    isOpen = !isOpen
    isOpen ? openDropdown(menu, button) : closeDropdown(menu, button)
  }

  const handleOptionClick = (opt) => {
    selectOption(opt, options, valueEl, root.getAttribute('data-onchange'))
    isOpen = false
    closeDropdown(menu, button)
  }

  const handleOutsideClick = (e) => {
    if (!root.contains(e.target) && isOpen) {
      isOpen = false
      closeDropdown(menu, button)
    }
  }

  button.addEventListener('click', (e) => {
    e.stopPropagation()
    toggle()
  })

  options.forEach((opt) => {
    opt.addEventListener('click', (e) => {
      e.stopPropagation()
      handleOptionClick(opt)
    })
  })

  document.addEventListener('click', handleOutsideClick)
}

// 자동 초기화 함수
const autoInitDropdown = () => {
  document.querySelectorAll('.dropdown').forEach(initDropdown)
}

// 자동 초기화 (DOMContentLoaded)
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', autoInitDropdown)
} else {
  autoInitDropdown()
}

// 전역으로 노출 (include.js에서 사용)
window.autoInitDropdown = autoInitDropdown


