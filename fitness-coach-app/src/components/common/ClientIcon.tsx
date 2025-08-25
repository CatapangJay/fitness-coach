'use client'

import { useEffect, useState } from 'react'
import { Dumbbell, Target, TrendingUp, Users } from 'lucide-react'

const iconMap = {
  dumbbell: Dumbbell,
  target: Target,
  'trending-up': TrendingUp,
  users: Users,
} as const

interface ClientIconProps {
  name: keyof typeof iconMap
  className?: string
  size?: number
}

export default function ClientIcon({ name, className, size }: ClientIconProps) {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    // Return a placeholder div with the same dimensions during SSR
    return <div className={className} style={{ width: size || 24, height: size || 24 }} />
  }

  const Icon = iconMap[name]
  return <Icon className={className} size={size} />
}