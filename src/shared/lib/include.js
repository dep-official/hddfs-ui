;(function () {
  async function loadIncludes(root) {
    const scope = root || document
    const containers = scope.querySelectorAll('[data-include]')

    await Promise.all(
      Array.from(containers).map(async el => {
        const path = el.getAttribute('data-include')
        if (!path) return
        try {
          const res = await fetch(path)
          if (!res.ok) return
          const html = await res.text()
          el.innerHTML = html

          // include된 HTML 안의 <script> 태그 실행
          const scripts = el.querySelectorAll('script')
          scripts.forEach(oldScript => {
            const newScript = document.createElement('script')
            if (oldScript.src) {
              newScript.src = oldScript.src
            } else {
              newScript.textContent = oldScript.textContent
            }
            document.body.appendChild(newScript)
            oldScript.remove()
          })

          // 재귀적으로 중첩된 includes 로드
          await loadIncludes(el)

          // data-include 속성 제거 (무한 루프 방지)
          el.removeAttribute('data-include')
        } catch (e) {
          console.error('Include failed:', path, e)
        }
      })
    )

    // 모든 includes 로드 완료 후 자동 초기화 함수들 호출
    if (window.autoInitSwitch) {
      window.autoInitSwitch()
    }
    if (window.autoInitDropdown) {
      window.autoInitDropdown()
    }
    if (window.autoInitTabs) {
      // 탭 초기화는 약간의 지연을 두어 DOM이 완전히 렌더링된 후 실행
      setTimeout(() => {
        window.autoInitTabs()
      }, 100)
    }
    if (window.autoInitProductSetDetail) {
      window.autoInitProductSetDetail()
    }
    if (window.autoInitDialog) {
      window.autoInitDialog()
    }
    if (window.autoInitAddToCartDialog) {
      // data-include 완료 후 약간의 지연을 두어 DOM이 완전히 렌더링된 후 실행
      setTimeout(() => {
        window.autoInitAddToCartDialog()
      }, 50)
    }
    if (window.autoInitImageBannerDialog) {
      window.autoInitImageBannerDialog()
    }
  }

  window.UIInclude = {
    load: loadIncludes,
  }

  document.addEventListener('DOMContentLoaded', function () {
    loadIncludes(document)
  })
})()
