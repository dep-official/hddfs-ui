// Footer 목업 데이터
const footerData = {
  notice: {
    text: '[공지사항] 로즈몽 外 4개 브랜드 적립금 사용안내',
    onClick: 'onNoticeClick',
  },
  guideLinks: [
    { label: '지점안내', href: '#' },
    { label: '인도장안내', href: '#' },
    { label: '고객센터', href: '#' },
    { label: '입점/제휴', href: '#' },
  ],
  footerLinks: [
    { label: 'H.Point', href: '#' },
    { label: 'Family Site', href: '#' },
    { label: '㈜현대디에프', href: '#' },
  ],
  languageLinks: [
    { label: 'PC버전', href: '#' },
    { label: '中文网', href: '#' },
  ],
  exchangeRate: {
    label: '환율',
    value: '$1 = 1,103.1원',
  },
  policyLinks: [
    { label: '이용약관', href: '#', isHighlighted: false },
    { label: '개인정보처리방침', href: '#', isHighlighted: true },
    { label: '영상정보 처리기기/관리방침', href: '#', isHighlighted: false },
  ],
  copyright: 'COPYRIGHT © HYUNDAI DF Co,. Ltd. ALL RIGHTS RESERVED.',
}

// Footer HTML 생성 함수
const renderFooter = data => {
  const container = document.getElementById('footer-container')
  if (!container) return

  const { notice, guideLinks, footerLinks, languageLinks, exchangeRate, policyLinks, copyright } =
    data

  container.innerHTML = `
    <!-- 공지사항 영역 -->
    <a class="footer__notice" href="#" ${notice.onClick ? `data-onclick="${notice.onClick}"` : ''}>
      <p class="footer__notice-text">${notice.text}</p>
      <img
        src="/images/icons/ic-m-arrow-right-16.svg"
        alt="더보기"
        class="footer__notice-icon"
        aria-hidden="true"
      />
    </a>

    <!-- 안내 영역 -->
    <ul class="footer__guide" aria-label="서비스 안내">
      ${guideLinks
        .map(
          link => `
        <li>
          <a href="${link.href}" class="footer__guide-link">${link.label}</a>
        </li>
      `
        )
        .join('')}
    </ul>

    <div class="footer__info">
      <div class="footer__info-inner">
        <ul class="footer__links">
          ${footerLinks
            .map(
              link => `
            <li>
              <a href="${link.href}" class="footer__link">
                <span class="footer__link-text">${link.label}</span>
                <img
                  src="/images/icons/ic-m-arrow-right-18.svg"
                  alt=""
                  class="footer__link-icon"
                  aria-hidden="true"
                />
              </a>
            </li>
          `
            )
            .join('')}
        </ul>

        <!-- 구분선 -->
        <hr class="footer__divider" aria-hidden="true" />

        <!-- 언어/환율 정보 -->
        <div class="footer__meta">
          <div class="footer__languages">
            ${languageLinks
              .map(
                (link, index) => `
              <a href="${link.href}" class="footer__language-link">${link.label}</a>
              ${
                index < languageLinks.length - 1
                  ? '<span class="footer__language-divider"></span>'
                  : ''
              }
            `
              )
              .join('')}
          </div>
          <div class="footer__exchange">
            <span class="footer__exchange-label">${exchangeRate.label}</span>
            <span class="footer__exchange-value">${exchangeRate.value}</span>
          </div>
        </div>

        <!-- 구분선 -->
        <hr class="footer__divider" aria-hidden="true" />

        <!-- 약관 링크 -->
        <ul class="footer__policies" aria-label="약관 및 정책">
          <li>
            ${policyLinks
              .map(
                (link, index) => `
              <a href="${link.href}" class="footer__policy-link ${
                  link.isHighlighted ? 'footer__policy-link--highlight' : ''
                }">${link.label}</a>
              ${
                index < policyLinks.length - 1 ? '<span class="footer__policy-divider"></span>' : ''
              }
            `
              )
              .join('')}
          </li>
        </ul>

        <!-- 저작권 정보 -->
        <p class="footer__copyright">${copyright}</p>
      </div>
    </div>
  `
}

// Footer 초기화
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    renderFooter(footerData)
  })
} else {
  renderFooter(footerData)
}
