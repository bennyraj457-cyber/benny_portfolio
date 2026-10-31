import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/utils/cn'

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  as?: 'div' | 'section' | 'main' | 'header' | 'footer'
}

/**
 * Museum-plate matting container implementing Stitch layout margins:
 * - Mobile (< 768px): 1.25rem (`margin`)
 * - Desktop (>= 1024px): 3.5rem (`margin-desktop`)
 */
export function Container({
  children,
  as: Component = 'div',
  className,
  ...props
}: ContainerProps) {
  return (
    <Component className={cn('layout-canvas', className)} {...props}>
      {children}
    </Component>
  )
}

export interface GridProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
}

/**
 * Responsive architectural grid implementing Stitch column & gutter specifications:
 * - Mobile (< 768px): 1-column stack, 1.5rem gutter
 * - Tablet (768px - 1024px): 2-column split, 1.5rem gutter (`gutter`)
 * - Desktop (>= 1024px): 12-column grid, 2.5rem gutter (`gutter-desktop`)
 */
export function Grid({ children, className, ...props }: GridProps) {
  return (
    <div className={cn('layout-grid', className)} {...props}>
      {children}
    </div>
  )
}

