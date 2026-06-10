import { useMemo } from 'react'
import { Zap, Thermometer, Lightbulb, Plug, TrendingUp, Activity } from 'lucide-react'
import { StatCard } from './StatCard'
import { PieChart } from './PieChart'
import { TrendChart } from './TrendChart'
import { useEnergyStore } from '../../store/useEnergyStore'
import { useSceneStore } from '../../store/useSceneStore'
import { formatTime } from '../../utils/energyCalculator'
import { cn } from '@/lib/utils'

interface EnergyPanelProps {
  className?: string
}

export function EnergyPanel({ className }: EnergyPanelProps) {
  const buildingData = useEnergyStore((state) => state.buildingData)
  const trendData = useEnergyStore((state) => state.trendData)
  const lastUpdate = useEnergyStore((state) => state.lastUpdate)
  const isNightMode = useSceneStore((state) => state.isNightMode)
  
  const stats = useMemo(() => {
    if (!buildingData) return null
    
    const { totalEnergy } = buildingData
    const total = totalEnergy.total
    const ac = totalEnergy.airConditioning
    const lighting = totalEnergy.lighting
    const socket = totalEnergy.socket
    
    return [
      {
        title: '总能耗',
        value: (total / 1000).toFixed(2),
        unit: 'kWh',
        icon: <Zap size={20} />,
        color: 'primary' as const,
        trend: { value: 5.2, isPositive: false },
      },
      {
        title: '空调用电',
        value: (ac / 1000).toFixed(2),
        unit: 'kWh',
        icon: <Thermometer size={20} />,
        color: 'primary' as const,
        trend: { value: 3.1, isPositive: true },
      },
      {
        title: '照明用电',
        value: (lighting / 1000).toFixed(2),
        unit: 'kWh',
        icon: <Lightbulb size={20} />,
        color: 'warning' as const,
        trend: { value: 2.5, isPositive: false },
      },
      {
        title: '插座用电',
        value: (socket / 1000).toFixed(2),
        unit: 'kWh',
        icon: <Plug size={20} />,
        color: 'success' as const,
        trend: { value: 1.8, isPositive: true },
      },
    ]
  }, [buildingData])
  
  const panelBg = isNightMode
    ? 'bg-slate-900/80 border-slate-700/50'
    : 'bg-white/90 border-gray-200'
  
  const textPrimary = isNightMode ? 'text-white' : 'text-gray-900'
  const textSecondary = isNightMode ? 'text-gray-400' : 'text-gray-500'
  
  if (!buildingData) {
    return (
      <div className={cn('rounded-2xl border p-6 backdrop-blur-md', panelBg, className)}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-32 rounded bg-gray-700/50" />
          <div className="grid grid-cols-2 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-24 rounded-lg bg-gray-700/30" />
            ))}
          </div>
        </div>
      </div>
    )
  }
  
  return (
    <div className={cn('rounded-2xl border backdrop-blur-md overflow-hidden', panelBg, className)}>
      <div className="p-4 border-b border-inherit">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="text-blue-400" size={20} />
            <h2 className={cn('text-lg font-semibold', textPrimary)}>能耗概览</h2>
          </div>
          <div className="flex items-center gap-2">
            <TrendingUp size={14} className={textSecondary} />
            <span className={cn('text-xs', textSecondary)}>
              更新于 {lastUpdate ? formatTime(lastUpdate) : '--'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-3">
          {stats?.map((stat, index) => (
            <StatCard
              key={index}
              title={stat.title}
              value={stat.value}
              unit={stat.unit}
              icon={stat.icon}
              color={stat.color}
              trend={stat.trend}
            />
          ))}
        </div>
        
        <div className="grid grid-cols-1 gap-4">
          <div className={cn('rounded-xl border p-4', isNightMode ? 'border-slate-700/50 bg-slate-800/50' : 'border-gray-200 bg-gray-50')}>
            <h3 className={cn('text-sm font-medium mb-2', textPrimary)}>用电分项占比</h3>
            <PieChart data={buildingData.totalEnergy} height={180} />
          </div>
          
          <div className={cn('rounded-xl border p-4', isNightMode ? 'border-slate-700/50 bg-slate-800/50' : 'border-gray-200 bg-gray-50')}>
            <h3 className={cn('text-sm font-medium mb-2', textPrimary)}>24小时能耗趋势</h3>
            <TrendChart data={trendData} height={160} showLegend={true} />
          </div>
        </div>
      </div>
    </div>
  )
}
