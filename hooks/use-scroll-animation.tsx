'use client'

import { useRef } from 'react'
import { useInView } from 'framer-motion'

type ScrollAnimationProps = {
  /** @deprecated Use `amount` instead. Will be removed after deprecation window. */
  threshold?: number
  once?: boolean
  amount?: 'some' | 'all' | number
}

export function useScrollAnimation(props: ScrollAnimationProps = {}) {
  const { threshold, once = true, amount } = props

  // Resolve amount with backward-compat for legacy `threshold`
  const resolvedAmount = amount ?? threshold ?? 0.3

  if (threshold !== undefined && amount === undefined) {
    // eslint-disable-next-line no-console
    console.warn(
      'useScrollAnimation: `threshold` is deprecated. Pass `amount` instead. `threshold` will be removed in a future release.'
    )
  }

  const ref = useRef<HTMLDivElement>(null)
  const isInView = useInView(ref, {
    once,
    amount: resolvedAmount,
  })

  return { ref, isInView }
}
