import { useEffect, useRef, useState } from 'react'

type DemoPhase = 'idle' | 'requested' | 'running' | 'complete'

const demoContent = {
  idle: {
    status: '요청 대기',
    time: '작업 요청 전',
    button: '작업 요청 체험하기',
    note: '버튼을 눌러 협업의 흐름을 경험해보세요.',
    step: 0,
  },
  requested: {
    status: '요청 전달됨',
    time: '방금 요청',
    button: '작업 요청을 전달하고 있어요…',
    note: '예시: 동료의 에이전트에게 맥락과 작업을 전달했어요.',
    step: 0,
  },
  running: {
    status: '진행 중',
    time: '수락 · 작업 진행 중',
    button: '동료의 에이전트가 작업 중이에요…',
    note: '예시: 동료가 요청을 수락하고 자신의 환경에서 작업합니다.',
    step: 1,
  },
  complete: {
    status: '완료',
    time: '방금 완료',
    button: '다시 체험하기',
    note: '예시: 완료된 결과를 확인했어요. 실제 작업이나 데이터 전송은 진행되지 않습니다.',
    step: 2,
  },
} satisfies Record<DemoPhase, { status: string; time: string; button: string; note: string; step: number }>

function CollaborationDemo() {
  const [phase, setPhase] = useState<DemoPhase>('idle')
  const timers = useRef<number[]>([])
  const runningRef = useRef(false)
  const content = demoContent[phase]
  const running = phase === 'requested' || phase === 'running'

  useEffect(() => () => {
    timers.current.forEach(window.clearTimeout)
    timers.current = []
    runningRef.current = false
  }, [])

  const runDemo = () => {
    if (runningRef.current) return
    runningRef.current = true
    timers.current.forEach(window.clearTimeout)
    timers.current = []
    setPhase('requested')

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    timers.current.push(window.setTimeout(() => {
      setPhase('running')
      timers.current.push(window.setTimeout(() => {
        setPhase('complete')
        runningRef.current = false
        timers.current = []
      }, reducedMotion.matches ? 150 : 1800))
    }, reducedMotion.matches ? 150 : 1000))
  }

  return (
    <div className="flow-layout">
      <div className="flow-copy">
        <h2 className="reveal">한 번의 요청이,<br />다음 작업의<br /><span className="cyan">시작이 되도록.</span></h2>
        <p className="reveal">누구에게 맡길지 정하고, 필요한 맥락을 전하세요.<br />요청, 진행 상황, 완료된 결과가<br />끊기지 않는 하나의 흐름이 됩니다.</p>
        <ol className="flow-steps reveal">
          <li className={content.step === 0 ? 'active' : undefined}><span>01</span> 맥락과 함께 작업 요청</li>
          <li className={content.step === 1 ? 'active' : undefined}><span>02</span> 동료가 수락하고 실행</li>
          <li className={content.step === 2 ? 'active' : undefined}><span>03</span> 결과를 공유하고 다음으로</li>
        </ol>
      </div>
      <div className="demo reveal">
        <div className="demo-titlebar"><div className="window-dots"><i /><i /><i /></div><span>DevLink Workspace</span><span className="demo-label">체험용 예시</span></div>
        <div className="demo-body">
          <div className="demo-breadcrumb">TEAM WORKSPACE <span>/</span> WEBSITE LAUNCH</div>
          <div className="demo-heading"><h3>함께 만드는 다음 작업</h3><span className="live"><i /> LIVE DEMO</span></div>
          <div className="task-request"><div className="avatar">Y</div><div><strong>You <small>→ 동료의 Claude Code</small></strong><p>로그인 API 연결을 부탁해.<br />완료되면 변경 파일과 결과도 공유해줘.</p></div></div>
          <div className="task-card">
            <div className="task-card-top"><span className="task-type">DEVELOPMENT</span><span id="task-status" className={`task-status${phase === 'running' ? ' running' : phase === 'complete' ? ' complete' : ''}`}>{content.status}</span></div>
            <h4>로그인 API 연결</h4>
            <p>계정 인증 흐름 · API 연동</p>
            <div className="task-meta"><span>✺ Claude Code</span><span id="task-time">{content.time}</span></div>
            <div className="task-track"><span className="current">요청</span><i /><span className={content.step >= 1 ? 'current' : undefined}>진행 중</span><i /><span className={content.step >= 2 ? 'current' : undefined}>완료</span></div>
            <div id="task-result" className="task-result" hidden={phase !== 'complete'}><span>✓</span><p><strong>작업이 완료되었어요</strong><br />변경 파일과 실행 결과가 공유되었습니다.</p></div>
          </div>
          <button className="button cyan-button" id="demo-run" type="button" disabled={running} onClick={runDemo}>
            {content.button}{!running && <> <span aria-hidden={phase === 'complete' ? true : undefined}>{phase === 'complete' ? '↻' : '↗'}</span></>}
          </button>
          <p className="demo-note" id="demo-note" role="status" aria-live="polite">{content.note}</p>
        </div>
      </div>
    </div>
  )
}

export default CollaborationDemo
