import { useEffect, useRef } from 'react'

export function useScrollAnimation() {
  const ref = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
          }
        })
      },
      { threshold: 0.12 }
    )

    const elements = ref.current
      ? ref.current.querySelectorAll('.fade-in, .fade-in-left, .fade-in-right')
      : []

    elements.forEach((el) => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  return ref
}

export function useCountUp(target, duration = 2000) {
  const countRef = useRef(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            let start = 0
            const step = target / (duration / 16)
            const timer = setInterval(() => {
              start += step
              if (start >= target) {
                start = target
                clearInterval(timer)
              }
              if (countRef.current) {
                countRef.current.textContent = Math.floor(start)
              }
            }, 16)
            observer.disconnect()
          }
        })
      },
      { threshold: 0.5 }
    )
    if (countRef.current) observer.observe(countRef.current)
    return () => observer.disconnect()
  }, [target, duration])

  return countRef
}
