import { useEffect } from 'react'
import type { RefObject } from 'react'

export function useLandingEffects(pageRef: RefObject<HTMLDivElement | null>) {
  useEffect(() => {
    const page = pageRef.current
    if (!page) return

    const documentElement = document.documentElement
    const hadJsClass = documentElement.classList.contains('js')
    const reveals = Array.from(page.querySelectorAll<HTMLElement>('.reveal'))
    const visibility = new Map(
      reveals.map((element) => [element, element.classList.contains('visible')]),
    )
    const delays = new Map<HTMLElement, { value: string; priority: string }>()
    let observer: IntersectionObserver | undefined
    let active = true

    if ('IntersectionObserver' in window) {
      documentElement.classList.add('js')
      observer = new IntersectionObserver(
        (entries) => {
          if (!active) return
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('visible')
              observer?.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.12, rootMargin: '0px 0px -28px 0px' },
      )

      page
        .querySelectorAll('.onboarding, .about-heading, .connect-heading')
        .forEach((group) => {
          group.querySelectorAll<HTMLElement>('.reveal').forEach((element, index) => {
            if (!delays.has(element)) {
              delays.set(element, {
                value: element.style.getPropertyValue('--delay'),
                priority: element.style.getPropertyPriority('--delay'),
              })
            }
            element.style.setProperty('--delay', `${index * 110}ms`)
          })
        })

      reveals.forEach((element) => observer?.observe(element))
    }

    const progress = page.querySelector<HTMLElement>('.scroll-progress')
    const previousTransform = progress?.style.getPropertyValue('transform') ?? ''
    const previousTransformPriority = progress?.style.getPropertyPriority('transform') ?? ''
    let progressFrame: number | null = null

    const updateProgress = () => {
      progressFrame = null
      if (!active || !progress) return
      progress.style.setProperty(
        'transform',
        `scaleX(${window.scrollY / Math.max(1, documentElement.scrollHeight - window.innerHeight)})`,
      )
    }
    const queueProgress = () => {
      if (progressFrame === null) {
        progressFrame = window.requestAnimationFrame(updateProgress)
      }
    }

    if (progress) {
      window.addEventListener('scroll', queueProgress, { passive: true })
      window.addEventListener('resize', queueProgress)
      updateProgress()
    }

    return () => {
      active = false
      observer?.disconnect()
      window.removeEventListener('scroll', queueProgress)
      window.removeEventListener('resize', queueProgress)
      if (progressFrame !== null) window.cancelAnimationFrame(progressFrame)

      if (observer) {
        documentElement.classList.toggle('js', hadJsClass)
        visibility.forEach((wasVisible, element) => {
          element.classList.toggle('visible', wasVisible)
        })
        delays.forEach(({ value, priority }, element) => {
          if (value) element.style.setProperty('--delay', value, priority)
          else element.style.removeProperty('--delay')
        })
      }

      if (progress) {
        if (previousTransform) {
          progress.style.setProperty('transform', previousTransform, previousTransformPriority)
        } else {
          progress.style.removeProperty('transform')
        }
      }
    }
  }, [pageRef])
}
