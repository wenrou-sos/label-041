import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: string
  unit?: string
  icon?: ReactNode
  trend?: {
    value: number
    isPositive: boolean
  }
  color?: 'primary' | 'success' | 'warning' | 'danger' | 'info'
  className?: string
}

const colorClasses = {
  primary: 'from-blue-500/20 to-blue-600/20 border-blue-500/30',
  success: 'from-green-500/20 to-green-600/20 border-green-500/30',
  warning: 'from-orange-500/20 to-orange-600/20 border-orange-500/30',
  danger: 'from-red-500/20 to-red-600/20 border-red-500/30',
  info: 'from-gray-500/20 to-gray-600/20 border-gray-500/30',
}

const iconColorClasses = {
  primary: 'text-blue-400',
  success: 'text-green-400',
  warning: 'text-orange-400',
  danger: 'text-red-400',
  info: 'text-gray-400',
}

export function StatCard({
  title,
  value,
  unit,
  icon,
  trend,
  color = 'primary',
  className,
}: StatCardProps) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl border bg-gradient-to-br p-4 backdrop-blur-md transition-all duration-300 hover:scale-[1.02] hover:shadow-lg',
        colorClasses[color],
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-xs font-medium text-gray-400">{title}</p>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl font-bold text-white">{value}</span>
            {unit && <span className="text-xs text-gray-400">{unit}</span>}
          </div>
          {trend && (
            <div
              className={cn(
                'flex items-center gap-1 text-xs',
                trend.isPositive ? 'text-green-400' : 'text-red-400'
              )}
            >
              <span>{trend.isPositive ? '↑' : '↓'}</span>
              <span>{Math.abs(trend.value).toFixed(1)}%</span>
            </div>
          )}
        </div>
        {icon && (
          <div className={cn('p-2 rounded-lg bg-black/20', iconColorClasses[color])}>
            {icon}
          </div>
        )}
      </div>
      
      <div className="absolute -bottom-4 -right-4 h-16 w-16 rounded-full bg-white/5 blur-xl" />
    </div>
  )
}
