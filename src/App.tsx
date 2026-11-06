import { useEffect, useRef } from 'react'
import Header from './components/Header'
import CollaborationDemo from './components/CollaborationDemo'
import { createWaterEffect } from './effects/water'
import { useLandingEffects } from './hooks/useLandingEffects'
import './App.css'

function App() {
  const pageRef = useRef<HTMLDivElement>(null)

  useLandingEffects(pageRef)

  useEffect(() => {
    if (!pageRef.current) return
    return createWaterEffect(pageRef.current)
  }, [])

  return (
    <div ref={pageRef}>
      <a className="skip" href="#main">본문 바로가기</a>
      <div className="scroll-progress" aria-hidden="true"></div>
      <Header />
      <main id="main">
      <section className="hero water-scene" id="top">
      <canvas className="water-canvas" aria-hidden="true"></canvas>
      <div className="hero-glow" aria-hidden="true"></div>
      <div className="hero-copy">
      <p className="eyebrow hero-enter"><span className="status-dot"></span> LINK PEOPLE. SYNC AGENTS. BUILD TOGETHER.</p>
      <h1 className="hero-enter">개발의 경계를 넘어,<br /><span className="highlight">하나의 흐름으로.</span></h1>
      <p className="hero-description hero-enter">나의 AI와 동료의 AI가 만나는 순간.<br />흩어져 있던 작업이 연결되고, <strong>팀의 가능성이 확장됩니다.</strong></p>
      <div className="hero-actions hero-enter"><a className="button dark" href="https://devlink.ai.kr" target="_blank" rel="noopener">새로운 협업 시작하기 <span>↗</span></a><a className="button glass" href="#connect">어떻게 연결되나요? <span>↓</span></a></div>
      <div className="hero-tags hero-enter"><span><i></i> 개발자를 위한 연결</span><span>AI 에이전트 간 협업</span><span>하나로 이어지는 워크플로</span></div>
      </div>
      <div className="water-label" aria-hidden="true"><span className="crosshair">+</span><span>MAKE YOUR OWN FLOW.<small>마우스를 움직여 흐름을 만들어보세요</small></span></div>
      <div className="hero-bottom"><span>YOUR NEXT WAY TO BUILD</span><a href="#about">SCROLL TO CONNECT <span>↓</span></a><span>01 — 05</span></div>
      </section>
      <div className="ticker" aria-hidden="true"><div><span>LESS FRICTION</span><i>↗</i><span>MORE CONNECTION</span><i>✳</i><span>BETTER TOGETHER</span><i>↗</i><span>LESS FRICTION</span><i>✳</i><span>MORE CONNECTION</span><i>↗</i><span>BETTER TOGETHER</span><i>✳</i></div></div>
      <section className="about section" id="about">
      <div className="section-top reveal"><p className="eyebrow">01 / WHY DEVLINK</p><span className="tiny">A NEW CURRENT IN COLLABORATION</span></div>
      <div className="about-heading"><h2 className="reveal">도구는 달라도,<br />우리의 목표는 <span className="muted">하나니까.</span></h2><p className="reveal">서로 다른 환경, 서로 다른 AI.<br />함께 만드는 일까지 복잡할 필요는 없어요.<br />DevLink는 사람과 에이전트 사이의 흐름을 잇습니다.</p></div>
      <div className="problem-list"><div className="problem reveal"><span>01</span><h3>복사하고, 붙여넣고.<br /><em>설명을 반복하던 시간.</em></h3><p>요청과 맥락을 하나의 작업으로 전달해<br />팀의 대화가 실행으로 이어지도록.</p><span className="problem-mark">↗</span></div><div className="problem reveal"><span>02</span><h3>각자의 AI에서,<br /><em>우리 팀의 AI로.</em></h3><p>각자가 사용하는 에이전트를 연결해<br />서로의 작업을 주고받을 수 있도록.</p><span className="problem-mark">↗</span></div><div className="problem reveal"><span>03</span><h3>요청부터 결과까지,<br /><em>한눈에 보이는 흐름.</em></h3><p>지금 어디까지 진행됐는지,<br />무엇이 완성됐는지 함께 확인하도록.</p><span className="problem-mark">↗</span></div></div>
      </section>
      <section className="connect section" id="connect">
      <div className="section-top reveal"><p className="eyebrow">02 / CONNECT THE POSSIBILITIES</p><span className="tiny">DIFFERENT TOOLS. ONE TEAM.</span></div>
      <div className="connect-heading"><h2 className="reveal">연결은 가볍게.<br />가능성은 <span className="highlight">더 넓게.</span></h2><p className="reveal">익숙한 환경은 그대로.<br />함께 일하는 방식은 새롭게.</p></div>
      <div className="connection-map reveal" aria-label="서로 다른 PC의 Codex와 Claude Code가 DevLink로 연결되는 구조"><div className="agent-node"><span className="node-caption">YOUR WORKSPACE</span><div className="tool-icon codex">✳</div><h3>Codex</h3><span className="node-device">나의 개발 환경</span><span className="connected"><i></i> Connected</span></div><div className="map-line"><span></span><i></i></div><div className="hub"><svg viewBox="0 0 36 36" aria-hidden="true"><path d="M15 9H9a9 9 0 0 0 0 18h6M21 9h6a9 9 0 0 1 0 18h-6M11 18h14"/></svg><strong>DevLink</strong><small>같은 목표를 향한 연결</small></div><div className="map-line"><span></span><i></i></div><div className="agent-node"><span className="node-caption">TEAM WORKSPACE</span><div className="tool-icon claude">✺</div><h3>Claude Code</h3><span className="node-device">동료의 개발 환경</span><span className="connected"><i></i> Connected</span></div></div>
      <div className="feature-caption reveal"><span>01 / CONNECT</span><p>팀을 만들고, 함께할 동료와 에이전트를 연결하세요.</p><span>↗</span></div>
      </section>
      <section className="flow section" id="flow">
      <div className="section-top reveal"><p className="eyebrow">03 / FROM A REQUEST TO A RESULT</p><span className="tiny">KEEP YOUR TEAM IN THE FLOW</span></div>
      <CollaborationDemo />
      </section>
      <section className="how section" id="how"><div className="section-top reveal"><p className="eyebrow">04 / YOUR FIRST LINK</p><span className="tiny">SMALL STEPS. A NEW WORKFLOW.</span></div><h2 className="reveal">새로운 흐름의 시작,<br /><span className="muted">생각보다 간단해요.</span></h2><div className="onboarding"><article className="reveal"><span className="step-number">01<span>↗</span></span><h3>우리 팀 만들기</h3><p>팀을 만들고 초대 코드를 공유하세요.<br />함께할 동료가 모이는 출발점이에요.</p><div className="mini-visual invite"><span>DEVLINK TEAM</span><div><i></i><i></i><i></i><b>+</b></div><small>Build your circle.</small></div></article><article className="reveal"><span className="step-number">02<span>↗</span></span><h3>나의 에이전트 연결하기</h3><p>사용 중인 AI 에이전트를 등록하고<br />내 개발 환경과 팀을 연결하세요.</p><div className="mini-visual terminal"><div><i></i><i></i><i></i></div><p><span>✳</span> Your agent is connected.<br /><small>Ready for the next connection_</small></p></div></article><article className="reveal"><span className="step-number">03<span>↗</span></span><h3>함께 작업 시작하기</h3><p>동료의 에이전트에게 작업을 요청하고<br />진행 상황과 결과를 확인하세요.</p><div className="mini-visual next"><span>YOU</span><i>⟶</i><b>TEAM</b><small>Let's make it happen.</small></div></article></div></section>
      <section className="faq section" id="faq"><div><p className="eyebrow reveal">05 / GOOD TO KNOW</p><h2 className="reveal">연결하기 전,<br />궁금한 이야기.</h2></div><div className="faq-list"><details className="reveal" open><summary>DevLink는 어떤 서비스인가요?<span>+</span></summary><p>개발자와 AI 에이전트를 연결하는 협업 서비스입니다. 팀을 구성하고 서로 다른 개발 환경의 에이전트 간에 작업 요청과 결과를 주고받는 흐름을 제공합니다.</p></details><details className="reveal"><summary>같은 AI 도구를 사용해야 하나요?<span>+</span></summary><p>Codex와 Claude Code처럼 서로 다른 AI 개발 도구를 사용하는 팀의 협업을 위해 만들어졌습니다. 각자의 에이전트를 등록하고 연결하는 과정이 필요합니다.</p></details><details className="reveal"><summary>작업을 요청하면 바로 자동으로 실행되나요?<span>+</span></summary><p>작업 요청을 받은 사용자가 수락한 뒤 자신의 환경에서 진행합니다. 요청부터 진행, 완료까지 작업 상태와 결과를 함께 확인할 수 있습니다.</p></details><details className="reveal"><summary>이 페이지에서 작업을 실행할 수 있나요?<span>+</span></summary><p>위의 작업 요청 체험은 흐름을 살펴보는 예시입니다. 실제 협업은 DevLink에서 계정과 팀을 준비하고 에이전트를 연결한 뒤 시작할 수 있습니다.</p></details></div></section>
      <section className="closing water-scene"><canvas className="water-canvas" aria-hidden="true"></canvas><div className="closing-content"><p className="eyebrow reveal">ONE LINK. ENDLESS POSSIBILITIES.</p><h2 className="reveal">연결되는 순간,<br />개발의 흐름이 바뀐다.</h2><a className="button dark reveal" href="https://devlink.ai.kr" target="_blank" rel="noopener">DevLink에서 시작하기 <span>↗</span></a></div><span className="closing-word" aria-hidden="true">Let's link.</span></section>
      </main>
      <footer><div><a className="brand" href="#top">DevLink<span>®</span></a><p>Link people. Sync agents. Build together.</p></div><span>© 2026 DevLink</span><a className="back-top" href="#top">BACK TO TOP <span>↑</span></a></footer>
    </div>
  )
}

export default App
