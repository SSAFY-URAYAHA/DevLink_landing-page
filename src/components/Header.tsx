import { useEffect, useRef, useState } from 'react'

function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const headerRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuOpen) return

    const desktop = window.matchMedia('(min-width: 761px)')
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButtonRef.current?.focus()
      }
    }
    const onDocumentClick = (event: MouseEvent) => {
      if (event.target instanceof Node && !headerRef.current?.contains(event.target)) {
        setMenuOpen(false)
      }
    }
    const onDesktopChange = (event: MediaQueryListEvent) => {
      if (event.matches) setMenuOpen(false)
    }

    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('click', onDocumentClick)
    desktop.addEventListener('change', onDesktopChange)

    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('click', onDocumentClick)
      desktop.removeEventListener('change', onDesktopChange)
    }
  }, [menuOpen])

  return (
    <header className="header" ref={headerRef}>
      <a className="brand" href="#top" aria-label="DevLink 홈"><svg viewBox="0 0 36 36" aria-hidden="true"><path d="M15 9H9a9 9 0 0 0 0 18h6M21 9h6a9 9 0 0 1 0 18h-6M11 18h14" /></svg>DevLink<span>®</span></a>
      <nav className="nav" aria-label="주요 메뉴">
        <a href="#about">Why DevLink</a><a href="#connect">주요 기능</a><a href="#how">시작하는 방법</a><a href="#faq">FAQ</a>
        <a className="nav-cta" href="https://devlink.ai.kr" target="_blank" rel="noopener">DevLink 시작하기 <span>↗</span></a>
      </nav>
      <button
        className="menu-toggle"
        type="button"
        ref={menuButtonRef}
        aria-label={menuOpen ? '메뉴 닫기' : '메뉴 열기'}
        aria-controls="mobile-nav"
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      ><span /><span /></button>
      <nav className="mobile-nav" id="mobile-nav" aria-label="모바일 메뉴" hidden={!menuOpen}>
        <a href="#about" onClick={() => setMenuOpen(false)}>Why DevLink</a>
        <a href="#connect" onClick={() => setMenuOpen(false)}>주요 기능</a>
        <a href="#how" onClick={() => setMenuOpen(false)}>시작하는 방법</a>
        <a href="#faq" onClick={() => setMenuOpen(false)}>FAQ</a>
        <a href="https://devlink.ai.kr" target="_blank" rel="noopener" onClick={() => setMenuOpen(false)}>DevLink 시작하기 ↗</a>
      </nav>
    </header>
  )
}

export default Header
